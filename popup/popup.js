document.getElementById('open-auth').addEventListener('click', function () {
  const url = chrome.runtime.getURL('auth/auth.html');
  chrome.tabs.create({ url });
  window.close();
});
