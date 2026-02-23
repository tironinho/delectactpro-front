/**
 * SHA-256 in the browser (Web Crypto API). Used for p_hash / subject_hash.
 * PII is never sent to the server; hashing is client-side only.
 * @param {string} str - UTF-8 string to hash
 * @returns {Promise<string>} hex-encoded SHA-256 hash
 */
export async function sha256Hex(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
