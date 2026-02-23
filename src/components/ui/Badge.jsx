export default function Badge({ tone = 'blue', className = '', children }) {
  const tones = {
    blue: 'bg-regulatory-500/15 text-regulatory-200 ring-1 ring-regulatory-500/25',
    red: 'bg-danger-500/15 text-danger-200 ring-1 ring-danger-500/25',
    slate: 'bg-slate-800/50 text-slate-200 ring-1 ring-slate-700/30'
  }
  return (
    <span className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', tones[tone], className].join(' ')}>
      {children}
    </span>
  )
}
