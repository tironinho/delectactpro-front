export default function Container({ className = '', ...props }) {
  return <div className={['mx-auto w-full max-w-6xl px-4', className].join(' ')} {...props} />
}
