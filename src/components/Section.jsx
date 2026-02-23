export default function Section({ className = '', ...props }) {
  return <section className={['py-16', className].join(' ')} {...props} />
}
