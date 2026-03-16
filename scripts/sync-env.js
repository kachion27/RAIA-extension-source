/**
 * Đồng bộ .env sang config.js
 * Chạy: node scripts/sync-env.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const configPath = path.join(root, 'config.js');

let host = 'https://api-v3.raia.edu.vn';
let apiVersion = 'v1';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const mHost = content.match(/^\s*VITE_SV_HOST\s*=\s*["']?([^"'\s#]+)/m);
  const mVer = content.match(/^\s*VITE_API_VERSION\s*=\s*["']?([^"'\s#]+)/m);
  if (mHost) host = mHost[1].trim();
  if (mVer) apiVersion = mVer[1].trim();
}

const config = `/**
 * API config - được sinh từ .env bởi scripts/sync-env.js
 */
const API_CONFIG = {
  host: '${host}',
  apiVersion: '${apiVersion}'
};

const API_BASE = \`\${API_CONFIG.host}/api/\${API_CONFIG.apiVersion}\`;
if (typeof window !== 'undefined') window.API_BASE = API_BASE;
`;

fs.writeFileSync(configPath, config);
const apiConfigPath = path.join(root, 'lib', 'api-config.js');
const apiConfigContent = `/** API base cho background - sinh từ .env */\nvar RAIA_API_BASE = '${host}/api/${apiVersion}';\n`;
fs.writeFileSync(apiConfigPath, apiConfigContent);
console.log('Synced .env -> config.js, lib/api-config.js:', { host, apiVersion });
