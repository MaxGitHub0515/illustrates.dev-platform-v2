import { Request, Response } from 'express'
import { sendSuccess } from '../../../utils/response'
import { Project }    from '../projects/projects.model'
import { BlogPost }   from '../blog/blog.model'
import { Discussion } from '../discussions/discussions.model'
import { User }       from '../users/users.model'

interface AggResult { _id: string; count: number; totalViews?: number; totalLikes?: number }

export async function getStats(_req: Request, res: Response): Promise<void> {
  const [projectStats, postStats, discussionStats, userCount] = await Promise.all([
    Project.aggregate<AggResult>([
      { $group: { _id: '$status', count: { $sum: 1 }, totalViews: { $sum: '$viewCount' }, totalLikes: { $sum: '$likeCount' } } }
    ]),
    BlogPost.aggregate<AggResult>([
      { $group: { _id: '$status', count: { $sum: 1 }, totalViews: { $sum: '$viewCount' } } }
    ]),
    Discussion.aggregate<AggResult>([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    User.countDocuments(),
  ])

  const byStatus = (arr: AggResult[]) =>
    Object.fromEntries(arr.map(s => [s._id, s.count]))

  const pByStatus = byStatus(projectStats)
  const bByStatus = byStatus(postStats)
  const dByStatus = byStatus(discussionStats)

  const sum = (obj: Record<string,number>) =>
    Object.values(obj).reduce((a,b) => a + b, 0)

  sendSuccess(res, {
    projects: {
      total:      sum(pByStatus),
      published:  pByStatus['published']  ?? 0,
      draft:      pByStatus['draft']      ?? 0,
      archived:   pByStatus['archived']   ?? 0,
      totalViews: projectStats.reduce((s,x) => s + (x.totalViews ?? 0), 0),
      totalLikes: projectStats.reduce((s,x) => s + (x.totalLikes ?? 0), 0),
    },
    posts: {
      total:      sum(bByStatus),
      published:  bByStatus['published']  ?? 0,
      draft:      bByStatus['draft']      ?? 0,
      totalViews: postStats.reduce((s,x) => s + (x.totalViews ?? 0), 0),
    },
    discussions: {
      total:  sum(dByStatus),
      open:   dByStatus['open']   ?? 0,
      closed: dByStatus['closed'] ?? 0,
      locked: dByStatus['locked'] ?? 0,
    },
    users: { total: userCount },
  })
}
