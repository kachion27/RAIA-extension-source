importScripts('../lib/api-config.js');

const API_BASE = typeof RAIA_API_BASE !== 'undefined' ? RAIA_API_BASE : 'https://api-v3.raia.edu.vn/api/v1';
const STORAGE_KEYS = {
  accessToken: 'raia_access_token',
  refreshToken: 'raia_refresh_token'
};

const ALARM_NAME = 'raia-report-url';

function scheduleNextAlarm() {
  const delayMinutes = Math.random() * 6 + 4;
  chrome.alarms.create(ALARM_NAME, { delayInMinutes: delayMinutes });
}

async function getToken() {
  const r = await chrome.storage.local.get(STORAGE_KEYS.accessToken);
  return r[STORAGE_KEYS.accessToken] || null;
}

async function collectUrls() {
  const tabs = await chrome.tabs.query({});
  const urls = tabs
    .map(t => t.url)
    .filter(u => u && (u.startsWith('http://') || u.startsWith('https://')))
    .slice(0, 100);
  return urls;
}

async function sendReport(urls) {
  const token = await getToken();
  if (!token || urls.length === 0) return;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'lng': 'vi'
  };
  const extId = chrome.runtime?.id;
  if (extId) headers['X-Extension-Id'] = extId;

  const body = { urls };
  console.log('[Raia] report-url request:', body);
  const res = await fetch(API_BASE + '/student/browser/report-url', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    console.warn('[Raia] report-url failed:', res.status);
  }
}

async function doReportAndReschedule() {
  const urls = await collectUrls();
  if (urls.length > 0) await sendReport(urls);
  scheduleNextAlarm();
}

async function onUrlChange() {
  const urls = await collectUrls();
  if (urls.length > 0) await sendReport(urls);
  chrome.alarms.clear(ALARM_NAME);
  scheduleNextAlarm();
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url && (changeInfo.url.startsWith('http://') || changeInfo.url.startsWith('https://'))) {
    onUrlChange();
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) doReportAndReschedule();
});

chrome.runtime.onStartup.addListener(scheduleNextAlarm);
chrome.runtime.onInstalled.addListener(scheduleNextAlarm);

scheduleNextAlarm();
