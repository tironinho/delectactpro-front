import { fetchJSON, toList, normalizeApiPath } from './apiClient.js'

// ----- Paths: auth -> /auth/* (no /api); app -> /api/app/*; public -> /api/* -----

// Integration summary: try GET /api/app/integrations/summary, else build from listConnectors + listCustomerApis
export async function getIntegrationSummary() {
  try {
    const data = await fetchJSON('/api/app/integrations/summary')
    return data
  } catch {
    try {
      const [connectors, customerApis] = await Promise.all([
        listConnectors().then((d) => toList(d, ['connectors', 'items'])),
        listCustomerApis().then((d) => toList(d, ['integrations', 'items']))
      ])
      const lastConnector = connectors
        .filter((c) => c.last_heartbeat || c.lastHeartbeat)
        .sort((a, b) => new Date(b.last_heartbeat || b.lastHeartbeat || 0) - new Date(a.last_heartbeat || a.lastHeartbeat || 0))[0]
      const lastApi = customerApis
        .filter((a) => a.last_healthcheck || a.lastHealthcheck)
        .sort((a, b) => new Date(b.last_healthcheck || b.lastHealthcheck || 0) - new Date(a.last_healthcheck || a.lastHealthcheck || 0))[0]
      const lastAt = lastConnector?.last_heartbeat || lastConnector?.lastHeartbeat || lastApi?.last_healthcheck || lastApi?.lastHealthcheck
      return {
        connectorsCount: connectors.length,
        customerApisCount: customerApis.length,
        modeDetected: connectors.length > 0 && customerApis.length > 0 ? 'hybrid' : connectors.length > 0 ? 'agent' : customerApis.length > 0 ? 'customer_apis' : 'none',
        lastOnlineConnectorAt: lastAt || null
      }
    } catch {
      return { connectorsCount: 0, customerApisCount: 0, modeDetected: 'none', lastOnlineConnectorAt: null }
    }
  }
}

// Connectors (Agent) — backend may use dbType (camelCase) or db_type (snake_case)
export async function listConnectors() {
  return fetchJSON('/api/app/connectors')
}
export async function createConnector({ name, db_type, dbType }) {
  const body = { name, db_type: db_type ?? dbType }
  if (body.db_type == null) body.db_type = 'postgres'
  return fetchJSON('/api/app/connectors', { method: 'POST', body })
}
export async function rotateConnectorToken(connectorId) {
  return fetchJSON(`/api/app/connectors/${connectorId}/rotate-token`, { method: 'POST' })
}

// Customer APIs
export async function listCustomerApis() {
  return fetchJSON('/api/app/customer-apis').catch(() => ({ integrations: [] }))
}
export async function createCustomerApi(payload) {
  return fetchJSON('/api/app/customer-apis', { method: 'POST', body: payload })
}
export async function updateCustomerApi(id, payload) {
  return fetchJSON(`/api/app/customer-apis/${id}`, { method: 'PATCH', body: payload })
}
export async function deleteCustomerApi(id) {
  return fetchJSON(`/api/app/customer-apis/${id}`, { method: 'DELETE' })
}
export async function testCustomerApiHealth(id) {
  return fetchJSON(`/api/app/customer-apis/${id}/test-health`, { method: 'POST' })
}
export async function testCustomerApiDelete(id, sampleSubjectHash = '') {
  return fetchJSON(`/api/app/customer-apis/${id}/test-delete`, { method: 'POST', body: { sampleSubjectHash: sampleSubjectHash || undefined } })
}
export async function testCustomerApiStatus(id) {
  return fetchJSON(`/api/app/customer-apis/${id}/test-status`, { method: 'POST' })
}
export async function rotateCustomerApiSecret(id) {
  return fetchJSON(`/api/app/customer-apis/${id}/rotate-secret`, { method: 'POST' })
}

// Hash recipes
export async function listHashRecipes() {
  return fetchJSON('/api/app/hash-recipes')
}
export async function createHashRecipe(payload) {
  return fetchJSON('/api/app/hash-recipes', { method: 'POST', body: payload })
}
export async function updateHashRecipe(id, payload) {
  return fetchJSON(`/api/app/hash-recipes/${id}`, { method: 'PATCH', body: payload })
}
export async function deleteHashRecipe(id) {
  return fetchJSON(`/api/app/hash-recipes/${id}`, { method: 'DELETE' })
}
export async function setActiveHashRecipe(id) {
  return fetchJSON(`/api/app/hash-recipes/${id}/activate`, { method: 'POST' })
}

// Partners
export async function listPartners() {
  return fetchJSON('/api/app/partners')
}
export async function createPartner(payload) {
  return fetchJSON('/api/app/partners', { method: 'POST', body: payload })
}
export async function updatePartner(id, payload) {
  return fetchJSON(`/api/app/partners/${id}`, { method: 'PATCH', body: payload })
}
export async function deletePartner(id) {
  return fetchJSON(`/api/app/partners/${id}`, { method: 'DELETE' })
}

// Cascade policies — backend: GET/POST /api/app/partners/policies (adapt to listCascadePolicies / upsertCascadePolicy)
export async function listCascadePolicies() {
  try {
    return await fetchJSON('/api/app/partners/policies')
  } catch {
    return fetchJSON('/api/app/cascade-policies').catch(() => [])
  }
}
export async function upsertCascadePolicy(payload) {
  try {
    return await fetchJSON('/api/app/partners/policies', { method: 'POST', body: payload })
  } catch {
    return fetchJSON('/api/app/cascade-policies', { method: 'PUT', body: payload })
  }
}

// Dispatch test — backend expects requestId; POST /api/app/cascade/dispatch-test with body { requestId }
export async function dispatchCascadeTest(requestId) {
  const body = requestId != null ? { requestId } : {}
  try {
    return await fetchJSON('/api/app/cascade/dispatch-test', { method: 'POST', body })
  } catch {
    return fetchJSON('/api/app/admin/dispatch', { method: 'POST', body })
  }
}

// Deletion requests (for dispatch test dropdown when backend supports)
export async function listDeletionRequests(params = {}) {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/api/app/deletion-requests${q ? `?${q}` : ''}`).catch(() => ({ items: [] }))
}

// Runs
export async function listRuns(params = {}) {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/api/app/runs${q ? `?${q}` : ''}`)
}
export async function getRun(runId) {
  return fetchJSON(`/api/app/runs/${runId}`)
}

// Audit logs
export async function getAuditLogs(params = {}) {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/api/app/audit${q ? `?${q}` : ''}`)
}
export async function exportAuditPacket(params = {}) {
  const q = new URLSearchParams(params).toString()
  const url = normalizeApiPath(`/api/app/audit/export${q ? `?${q}` : ''}`)
  const token = localStorage.getItem('token')
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!res.ok) throw new Error(`Export failed: ${res.status}`)
  return res.blob()
}

// Billing
export async function getBillingStatus() {
  return fetchJSON('/api/app/billing')
}
export async function getCustomerPortalUrl() {
  const data = await fetchJSON('/api/app/billing/portal-url', { method: 'POST' })
  return data?.url
}

export { toList }
