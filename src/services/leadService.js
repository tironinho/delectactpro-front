const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4242'

export async function submitLead({ email, company, role, source = 'landing' }) {
  const res = await fetch(`${API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, company, role, source })
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Lead submit failed: ${res.status} ${text}`)
  }
  return res.json()
}
