LoginManager.isLoggedIn().then(async (e) => {
  if (e) window.location.href = 'https://login.netdb.at'; return;
});
