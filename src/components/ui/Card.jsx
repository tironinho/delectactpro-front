export function Card({ className = '', ...props }) {
  return (
    <div className={['rounded-2xl border border-slate-800 bg-slate-950/40 shadow-soft', className].join(' ')} {...props} />
  )
}

export function CardHeader({ className = '', ...props }) {
  return <div className={['p-6 pb-2', className].join(' ')} {...props} />
}

export function CardContent({ className = '', ...props }) {
  return <div className={['p-6 pt-2', className].join(' ')} {...props} />
}

export function CardFooter({ className = '', ...props }) {
  return <div className={['p-6 pt-0', className].join(' ')} {...props} />
}
