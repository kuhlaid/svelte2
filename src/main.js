import App from './App.svelte';	// starter svelte component

const app = new App({
	target: document.body
});

Notification.requestPermission();	// add a application notification prompt for the uses of the site

// Add basic service worker registration code (works in Chrome but not Firefox)
// NOTE: the registered path is root
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('./sw.js')
//       .then(registration => {
//         console.log(`Service Worker registered! Scope: ${registration.scope}`);
//         //registration.showNotification(`Service Worker registered!`);  // if we want to send a push notification to the user
//       })
//       .catch(err => {
//         console.log(`Service Worker registration failed: ${err}`);
//         //err.showNotification(`Service Worker registration failed`);  // if we want to send a notification to the user
//       });
//   });
// }





// trying this service working initializer to see if it works in Firefox
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors.
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  window.addEventListener('load', function() {
      if ('serviceWorker' in navigator &&
          (window.location.protocol === 'https:' || isLocalhost)) {
        navigator.serviceWorker.register('./sw.js')
        .then(function(registration) {
          // updatefound is fired if service-worker.js changes.
          registration.onupdatefound = function() {
            // updatefound is also fired the very first time the SW is installed,
            // and there's no need to prompt for a reload at that point.
            // So check here to see if the page is already controlled,
            // i.e. whether there's an existing service worker.
            if (navigator.serviceWorker.controller) {
              // The updatefound event implies that registration.installing is set
              var installingWorker = registration.installing;

              installingWorker.onstatechange = function() {
                switch (installingWorker.state) {
                  case 'installed':
                    // At this point, the old content will have been purged and the
                    // fresh content will have been added to the cache.
                    // It's the perfect time to display a "New content is
                    // available; please refresh." message in the page's interface.
                    break;

                  case 'redundant':
                    throw new Error('The installing ' +
                                    'service worker became redundant.');

                  default:
                    // Ignore
                }
              };
            }
          };
        }).catch(function(e) {
          console.error('Error during service worker registration:', e);
        });
      }
  });
})();

// - create indexedDB database (comment out for now)
// const dbPromise = createIndexedDB();
// function createIndexedDB() {
//   if (!('indexedDB' in window)) {return null;}
//   return idb.open('svelte2db', 1, function(upgradeDb) {
//     if (!upgradeDb.objectStoreNames.contains('events')) {
//       const eventsOS = upgradeDb.createObjectStore('events', {keyPath: 'id'});
//     }
//   });
// }
export default app;