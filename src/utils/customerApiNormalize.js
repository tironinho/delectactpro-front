/**
 * Normalize customer API integration row from backend (camelCase or snake_case).
 * Accepts response shapes: { items }, { integrations }, or raw array.
 */
export function normalizeCustomerApiIntegration(row) {
  if (row == null) return null
  const r = typeof row !== 'object' ? { id: row } : { ...row }
  return {
    id: r.id,
    name: r.name,
    baseUrl: r.baseUrl ?? r.base_url ?? '',
    healthPath: r.healthPath ?? r.health_path ?? '',
    deletePath: r.deletePath ?? r.delete_path ?? '',
    statusPath: r.statusPath ?? r.status_path ?? '',
    webhookPath: r.webhookPath ?? r.webhook_path ?? '',
    authType: r.authType ?? r.auth_type ?? 'HMAC',
    last_healthcheck: r.last_healthcheck ?? r.lastHealthcheck,
    lastHealthcheck: r.last_healthcheck ?? r.lastHealthcheck,
    endpoints: r.endpoints,
    timeoutMs: r.timeoutMs ?? r.timeout_ms,
    retries: r.retries,
    expectedSuccessStatusCodes: r.expectedSuccessStatusCodes ?? r.expected_success_status_codes
  }
}

/** Extract list from listCustomerApis response */
export function normalizeCustomerApiList(data) {
  if (data == null) return []
  if (Array.isArray(data)) return data.map(normalizeCustomerApiIntegration)
  const arr = data.items ?? data.integrations
  return Array.isArray(arr) ? arr.map(normalizeCustomerApiIntegration) : []
}
