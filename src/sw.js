/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// include workbox-sw (https://developers.google.com/web/tools/workbox/modules/workbox-sw)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
    console.log(`(v=__cVersion__) Yay! Workbox and the service worker are loaded 🎉`);
    workbox.precaching.precacheAndRoute([]);

    // const showNotification = () => {
    //     self.registration.showNotification('Background sync success!', {
    //       body: '🎉`🎉`🎉`'
    //     });
    //   };
      
    // const bgSyncPlugin = new workbox.backgroundSync.Plugin(
    // 'svelte2db-queue',
    // {
    //     callbacks: {
    //     queueDidReplay: showNotification
    //     // other types of callbacks could go here
    //     }
    // }
    // );

    // const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    // plugins: [bgSyncPlugin],
    // });

    // workbox.routing.registerRoute(
    // /\/api\/add/,
    // networkWithBackgroundSync,
    // 'POST'
    // );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}