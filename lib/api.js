/**
 * API client - auth, token storage, refresh
 */
(function (global) {
  const STORAGE_KEYS = {
    accessToken: 'raia_access_token',
    refreshToken: 'raia_refresh_token',
    expiresAt: 'raia_expires_at',
    userEmail: 'raia_user_email'
  };

  function getApiBase() {
    return typeof API_BASE !== 'undefined' ? API_BASE : 'https://api-v3.raia.edu.vn/api/v1';
  }

  function getExtensionId() {
    return (typeof chrome !== 'undefined' && chrome.runtime?.id) ? chrome.runtime.id : '';
  }

  function getHeaders(withAuth) {
    const headers = {
      'Content-Type': 'application/json',
      'lng': 'vi'
    };
    const extId = getExtensionId();
    if (extId) headers['X-Extension-Id'] = extId;
    if (withAuth) {
      const token = localStorage.getItem(STORAGE_KEYS.accessToken);
      if (token) headers['Authorization'] = 'Bearer ' + token;
    }
    return headers;
  }

  function safeLogBody(bodyStr) {
    if (!bodyStr) return;
    try {
      const o = JSON.parse(bodyStr);
      if (o && typeof o.password !== 'undefined') {
        const redacted = { ...o, password: '***' };
        console.log('[Raia] request body:', redacted);
      } else {
        console.log('[Raia] request body:', o);
      }
    } catch (_) {
      console.log('[Raia] request body (raw):', bodyStr);
    }
  }

  async function fetchApi(path, options, retried) {
    const url = getApiBase() + path;
    console.log('[Raia] request:', options?.method || 'GET', url);
    if (options?.body) safeLogBody(options.body);
    const res = await fetch(url, {
      ...options,
      headers: { ...getHeaders(options?.auth !== false), ...options?.headers }
    });
    const data = await res.json().catch(() => ({}));

    if (res.status === 401 && options?.auth !== false && !retried) {
      const newToken = await refreshTokens();
      if (newToken) {
        return fetchApi(path, options, true);
      }
      await clearTokens();
    }
    return { ok: res.ok, status: res.status, data };
  }

  async function saveTokens(accessToken, refreshToken, expiresIn) {
    const expiresAt = Date.now() + (expiresIn * 1000);
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    localStorage.setItem(STORAGE_KEYS.expiresAt, String(expiresAt));
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({
        [STORAGE_KEYS.accessToken]: accessToken,
        [STORAGE_KEYS.refreshToken]: refreshToken,
        [STORAGE_KEYS.expiresAt]: String(expiresAt)
      });
    }
  }

  async function clearTokens() {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.expiresAt);
    localStorage.removeItem(STORAGE_KEYS.userEmail);
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.remove([
        STORAGE_KEYS.accessToken, STORAGE_KEYS.refreshToken,
        STORAGE_KEYS.expiresAt, STORAGE_KEYS.userEmail
      ]);
    }
  }

  async function setUserEmail(email) {
    if (email) {
      localStorage.setItem(STORAGE_KEYS.userEmail, email);
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({ [STORAGE_KEYS.userEmail]: email });
      }
    }
  }

  function getUserEmail() {
    return localStorage.getItem(STORAGE_KEYS.userEmail) || '';
  }

  async function refreshTokens() {
    const rt = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!rt) return null;
    const { ok, data } = await fetchApi('/student/auth/refresh', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ refreshToken: rt })
    });
    if (!ok || !data?.data) return null;
    const { accessToken, refreshToken: newRefresh, expiresIn } = data.data;
    await saveTokens(accessToken, newRefresh, expiresIn);
    return accessToken;
  }

  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    const at = localStorage.getItem(STORAGE_KEYS.accessToken);
    if (at) {
      chrome.storage.local.set({
        [STORAGE_KEYS.accessToken]: at,
        [STORAGE_KEYS.refreshToken]: localStorage.getItem(STORAGE_KEYS.refreshToken),
        [STORAGE_KEYS.expiresAt]: localStorage.getItem(STORAGE_KEYS.expiresAt),
        [STORAGE_KEYS.userEmail]: localStorage.getItem(STORAGE_KEYS.userEmail)
      }).catch(() => {});
    }
  }

  global.RaiaAPI = {
    verifyEmail: (email) =>
      fetchApi('/student/auth/verify-email', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email })
      }),
    login: (email, password) =>
      fetchApi('/student/auth/login', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email, password })
      }),
    me: () => fetchApi('/student/auth/me'),
    refresh: refreshTokens,
    saveTokens,
    clearTokens,
    setUserEmail,
    getUserEmail,
    getAccessToken: () => localStorage.getItem(STORAGE_KEYS.accessToken),
    isLoggedIn: () => !!localStorage.getItem(STORAGE_KEYS.accessToken),
    getExtensionId: getExtensionId,
    getTokenDebug: () => ({
      storage: 'localStorage',
      keys: Object.values(STORAGE_KEYS),
      accessToken: localStorage.getItem(STORAGE_KEYS.accessToken) || null,
      refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken) || null,
      expiresAt: localStorage.getItem(STORAGE_KEYS.expiresAt) || null
    })
  };
})(typeof window !== 'undefined' ? window : this);
