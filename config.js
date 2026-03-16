/**
 * API config - được sinh từ .env bởi scripts/sync-env.js
 */
const API_CONFIG = {
  host: 'https://api-v3.raia.edu.vn',
  apiVersion: 'v1'
};
// const API_CONFIG = {
//   host: 'http://localhost:4111',
//   apiVersion: 'v1'
// };

const API_BASE = `${API_CONFIG.host}/api/${API_CONFIG.apiVersion}`;
if (typeof window !== 'undefined') window.API_BASE = API_BASE;
