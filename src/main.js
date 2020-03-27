import App from './App.svelte';	// starter svelte component

const app = new App({
	target: document.body
});

Notification.requestPermission();	// add a application notification prompt for the uses of the site

// Add basic service worker registration code
// NOTE: the registered path is root so if building an placing under a subdirectory of
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log(`Service Worker registered! Scope: ${registration.scope}`);
        //registration.showNotification(`Service Worker registered!`);  // if we want to send a push notification to the user
      })
      .catch(err => {
        console.log(`Service Worker registration failed: ${err}`);
        //err.showNotification(`Service Worker registration failed`);  // if we want to send a notification to the user
      });
  });
}

const gulp = require('gulp');
const workboxBuild = require('workbox-build');
// add "service worker" task here
const serviceWorker = () => {
	console.log('init sw workboxBuild');
	return workboxBuild.injectManifest({
	  swSrc: 'src/sw.js',
	  swDest: 'public/sw.js',
	  globDirectory: 'public',
	  globPatterns: [
		'**/*.{html,json,js,css}'
	  ]
	}).then(resources => {
	  console.log(`Injected ${resources.count} resources for precaching, ` +
		  `totaling ${resources.size} bytes.`);
	}).catch(err => {
	  console.log('Uh oh 😬', err);
	});
}
gulp.task('service-worker', serviceWorker);

export default app;