import App from './App.svelte';	// starter svelte component

const app = new App({
	target: document.body
});


//Notification.requestPermission();	// add a application notification prompt for the uses of the site (disabled for now)

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
          console.log('Service Worker seems to be registered!');
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
                    console.log('Service Worker installed');
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


// import localforage from 'localforage';
// localforage.config({
//   name: 'svelte2db'
// });

// handle clearing of the CacheStorage when new code updates are pushed
const codeVersion = '__cVersion__'; // current code version
// we need to check if the codeVersion currenlty stored in localStorage in the web browser is the different from the new code version
// we only want to run this code once on the user side to update the service worker cache
const strCodeVersion = localStorage.getItem("codeVersion");
if (strCodeVersion!=codeVersion) {
  localStorage.setItem("codeVersion", codeVersion);
  console.log('codeVersion updated in local storage');
  const l = console.log    
  if ('caches' in window) {
    l('caches in window');
    caches.keys().then(function(cacheArray) {
      l(cacheArray);
      cacheArray.forEach(function(cache) {
        caches.delete(cache).then((bool) => {
          l('deleted cache: '+cache); // true
        }).catch((err) => {l(err)});
      });
    });
  }
}


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