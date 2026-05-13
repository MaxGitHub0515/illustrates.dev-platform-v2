/**
 * Clerk v6 appearance config.
 *
 * ── To enable social login (Google, GitHub, Discord): ─────────────────────
 *   Clerk Dashboard → Configure → Social Connections → toggle ON each provider
 *
 * ── To enable phone number + SMS verification: ────────────────────────────
 *   Clerk Dashboard → Configure → User & Authentication
 *   → Phone number → Enable → set as Required or Optional
 *   → SMS verification → enable OTP
 */
export const clerkAppearance = {
  variables: {
    colorBackground:      'transparent',
    colorInputBackground: 'rgba(255,255,255,0.05)',
    colorInputText:       '#f0f4ff',
    colorText:            '#f0f4ff',
    colorTextSecondary:   'rgba(255,255,255,0.45)',
    colorPrimary:         '#6366f1',
    colorDanger:          '#ef4444',
    colorSuccess:         '#22c55e',
    borderRadius:         '10px',
    spacingUnit:          '16px',
    fontFamily:           'var(--font-geist-sans),system-ui,sans-serif',
    fontSize:             '14px',
  } as Record<string, string>,
  elements: {
    /* Card wrapper */
    rootBox:  'w-full',
    card:     '!bg-transparent !shadow-none !border-0 !p-0 w-full',
    header:   'hidden',
    footer:   'hidden',

    /* Social buttons — each in its own row, full width */
    socialButtonsBlockButton: [
      '!flex !w-full !items-center !gap-3 !px-4 !py-3 !mb-2',
      '!rounded-xl !text-sm !font-medium',
      '!border !border-white/20 !bg-white/[0.05]',
      'hover:!bg-white/[0.1] hover:!border-white/30',
      '!text-white !transition-all !duration-150',
    ].join(' '),
    socialButtonsBlockButtonText: '!text-[13px] !font-medium !text-white/90',
    socialButtonsProviderIcon:    '!w-5 !h-5',

    /* Divider */
    dividerRow:  '!my-5',
    dividerLine: '!bg-white/10',
    dividerText: '!text-[11px] !text-white/25 !uppercase !tracking-widest',

    /* Form field spacing — prevents overlap */
    formFieldRow: '!mb-5 !relative',

    /* Labels */
    formFieldLabel: '!text-white/50 !text-[11px] !font-medium !mb-1.5 !uppercase !tracking-wide',

    /* Inputs — visible border, no overlap on focus */
    formFieldInput: [
      '!w-full !px-3 !py-2.5',
      '!bg-white/[0.05] !text-white/90',
      '!border !border-white/[0.2]',
      '!rounded-xl',
      'placeholder:!text-white/20',
      'focus:!border-indigo-400/80',
      'focus:!ring-2 focus:!ring-indigo-500/25 focus:!ring-offset-0',
      'focus:!outline-none focus:!relative focus:!z-10',
      '!transition-all !duration-150',
    ].join(' '),

    /* Phone input */
    phoneInputBox: '!border !border-white/[0.2] !rounded-xl !overflow-hidden',
    formFieldInputPhoneExtension: '!border-r !border-white/[0.15] !bg-white/[0.07] !text-white/60 !px-3',

    /* OTP code inputs */
    otpCodeFieldInput: [
      '!bg-white/[0.05] !border !border-white/[0.2]',
      '!text-white/90 !rounded-xl !text-center !text-lg !font-mono',
      'focus:!border-indigo-400/80 focus:!ring-2 focus:!ring-indigo-500/25',
    ].join(' '),

    /* Primary button */
    formButtonPrimary: [
      '!w-full !py-2.5 !rounded-xl !font-medium !text-sm !text-white !border-0',
      '!bg-gradient-to-r !from-indigo-500 !to-cyan-500',
      'hover:!opacity-90 !transition-opacity',
    ].join(' '),

    /* Password show/hide */
    formFieldInputShowPasswordButton: '!text-white/30 hover:!text-white/60',

    /* Errors */
    formFieldErrorText: '!text-red-400 !text-xs !mt-1',
    alert:     '!bg-red-500/10 !border !border-red-500/25 !rounded-xl !p-3 !mb-4',
    alertText: '!text-red-400 !text-sm',

    /* Links */
    formFieldAction:  '!text-indigo-400 hover:!text-indigo-300',
    footerActionLink: '!text-indigo-400 hover:!text-indigo-300',

    /* Internal nav (back buttons etc.) */
    identityPreviewText:         '!text-white/70',
    identityPreviewEditButton:   '!text-indigo-400',
  },
} as const
