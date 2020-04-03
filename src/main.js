/**
 * The execution of this code is tricky because many of the functions return promises which means the order of operations needs 
 * to 'wait' for the promises to resolve before moving on.
 */

import App from './App.svelte';	// starter svelte component

// setup some variables
const app = new App({
	target: document.body
});
let objCodeVersion = '';
const strLsCodeVersion = localStorage.getItem("codeVersion");
if (strLsCodeVersion === undefined) {
  strLsCodeVersion='';
}
// Check to make sure service workers are supported in the current browser,
// and that the current page is accessed from a secure origin. Using a
// service worker from an insecure origin will trigger JS console errors.
const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

// track offline status since it does not appear we can export the status from the App.svelte component
let offlineCheck = navigator.onLine;
console.log(offlineCheck + ' network status');
// listen for changes in the network status of the app
// window.addEventListener("load", () => {
  // ...then listen for changes
  function handleNetworkChange(event) {
    offlineCheck = navigator.onLine;
  }  
  window.addEventListener("online", handleNetworkChange);	// listen for online and offline event changes
  window.addEventListener("offline", handleNetworkChange);
//});

// only check the app version if online else we skip to the service worker
if (offlineCheck) func1();
else func2();

//Notification.requestPermission();	// add a application notification prompt for the uses of the site (disabled for now)

function func1(){
  console.log('start func1');  
  async function fetchLatesCV() {
    let response = await fetch('/codeVersion.json');
    let data = await response.json()
    return data;
  }

  fetchLatesCV().then((response) => {
      // here we will fetch a 'version file' that is NOT cached by the service worker; this will be used to flag if we need to update the service worker or not
      objCodeVersion = JSON.parse(JSON.stringify(response));
      console.log('got latest codeRelease from the server: '+objCodeVersion.codeVersion+' and local storage version is '+strLsCodeVersion);
      func2();
    })
    .catch((err) => {
      alert(err +' blah codeVersion fetch errrrrr');
    });

};
console.log('trying fetchLatesCV()');  


// trying this service working initializer to see if it works in Firefox
function func2() {
  'use strict';

  console.log('start func2');  

  // window.addEventListener('load', function() {
      if ('serviceWorker' in navigator &&
          (window.location.protocol === 'https:' || isLocalhost)) {

            // as long as we are online we can update the service worker
            if (offlineCheck) {
              console.log('add event listener on load with objCodeVersion.codeVersion='+objCodeVersion.codeVersion);
              // try and unregister any prior service workers already there (if we are changing version)
              if (objCodeVersion.codeVersion !='' && strLsCodeVersion!=objCodeVersion.codeVersion) {
                //  update the local code version
                console.log('codeVersion will be updating from local storage ' + strLsCodeVersion + ' to ' + objCodeVersion.codeVersion);
                if (strLsCodeVersion!=objCodeVersion.codeVersion) {
                  localStorage.setItem("codeVersion", objCodeVersion.codeVersion);
                  console.log('codeVersion updated in local storage from ' + strLsCodeVersion + ' to ' + objCodeVersion.codeVersion);
                }
                
                // unregister service worker
                swUnreg();
              }
            }
            // service worker registration
            swReg();
      }
  //});
}

function swUnreg(){
  console.log('===========================swUnreg() started');
  async function asUnregSw() {
    let response = await navigator.serviceWorker.getRegistrations()
      .then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
        console.log('Service workers unregistered');
        // clear CacheStorage as well (this causes problems)
        // const l = console.log   
        if ('caches' in window) {
          //l('caches in window');
          caches.keys().then(function(cacheArray) {
            //l(cacheArray);
            cacheArray.forEach(function(cache) {
              caches.delete(cache).then((bool) => {
                //l('deleted cache: '+cache); // true
              }).catch((err) => {l(err)});
            });
          });
        }
      });
      return response;
  }

  asUnregSw().then((response) => {
      console.log('finished unregistering the service workers, now register a new one');
      location.reload();  // we need to reload the page for the new service worker to register fully
    })
    .catch((err) => {
      alert(err +' blah asUnregSw failed errrrrr');
    });


  
}

function swReg() {
  console.log('try to register Service Worker');
  navigator.serviceWorker.register('./sw.js?v=__cVersion__')
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

// import localforage from 'localforage';
// localforage.config({
//   name: 'svelte2db'
// });




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

console.log('end of main.js');
export default app;