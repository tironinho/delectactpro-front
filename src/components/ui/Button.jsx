export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-regulatory-500/40 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-regulatory-500 text-white hover:bg-regulatory-400 shadow-glow-blue',
    ghost: 'bg-slate-950/60 text-slate-100 border border-slate-800 hover:bg-slate-900',
    danger: 'bg-danger-500 text-white hover:bg-danger-400 shadow-glow-red'
  }

  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-4 py-3 text-sm', lg: 'px-5 py-3.5 text-base' }

  return <Tag className={[base, variants[variant], sizes[size], className].join(' ')} {...props} />
}
