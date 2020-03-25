import App from './App.svelte';	// starter svelte component

const app = new App({
	target: document.body
});

Notification.requestPermission();	// add a application notification prompt for the uses of the site

// Add basic service worker registration code
// NOTE: the registered path is root so if building an placing under a subdirectory of
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log(`Service Worker registered! Scope: ${registration.scope}`);
      })
      .catch(err => {
        console.log(`Service Worker registration failed: ${err}`);
      });
  });
}

export default app;