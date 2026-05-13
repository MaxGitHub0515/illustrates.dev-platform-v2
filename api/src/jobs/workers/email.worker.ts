import { Worker, Job } from 'bullmq'
import { Resend }       from 'resend'
import { bullMQRedis }  from '../../lib/redis'
import { logger }       from '../../lib/logger'
import { workerRegistry } from '../registry'
import { jobsTotal }    from '../../lib/metrics'
import { env }          from '../../config/env'
import type { EmailJobData } from '../queues'

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

function buildHtml(template: string, variables: Record<string, unknown>): string {
  const v = variables as Record<string, string>
  switch (template) {
    case 'support-request':
      return `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#4f46e5;margin:0 0 16px">New contact form submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#6b7280;width:120px">From</td>
                <td style="padding:8px 0;font-weight:500">${v.name} &lt;${v.email}&gt;</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Type</td>
                <td style="padding:8px 0">${v.type}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="white-space:pre-wrap;color:#374151;line-height:1.6">${v.message}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="color:#9ca3af;font-size:12px">Reply directly to this email to respond to ${v.name}.</p>
        </div>`

    case 'welcome':
      return `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#4f46e5">Welcome to illustrates.dev, ${v.username}!</h2>
          <p style="color:#374151;line-height:1.6">
            Your account is ready. Head over to your dashboard to get started.
          </p>
          <a href="${v.dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#06b6d4);color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:12px">
            Go to dashboard →
          </a>
        </div>`

    default:
      return `<p>${JSON.stringify(variables)}</p>`
  }
}

const worker = new Worker<EmailJobData>(
  'emails',
  async (job: Job<EmailJobData>) => {
    const { to, subject, template, variables } = job.data
    logger.info('Processing email job', { jobId: job.id, to, subject, template })
    await job.updateProgress(10)

    if (!resend) {
      logger.warn('RESEND_API_KEY not set — email not sent (dev mode)', { to, subject })
      await job.updateProgress(100)
      jobsTotal.inc({ queue: 'emails', status: 'completed' })
      return { sent: false, reason: 'no_api_key', to }
    }

    const html = buildHtml(template, variables)

    const { error } = await resend.emails.send({
      from:     env.FROM_EMAIL,
      to:       [to],
      subject,
      html,
      replyTo:  (variables as Record<string, string>).email ?? undefined,
    })

    if (error) {
      logger.error('Resend error', { error, to, subject })
      throw new Error(`Resend: ${error.message}`)
    }

    logger.info('Email sent via Resend', { to, subject })
    await job.updateProgress(100)
    jobsTotal.inc({ queue: 'emails', status: 'completed' })
    return { sent: true, to, template }
  },
  { connection: bullMQRedis, concurrency: 5 }
)

worker.on('failed', (job, err) => {
  logger.error('Email job failed', { jobId: job?.id, error: err.message })
  jobsTotal.inc({ queue: 'emails', status: 'failed' })
})
worker.on('completed', (job) => logger.debug('Email job completed', { jobId: job.id }))

workerRegistry.register(worker)
