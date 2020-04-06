## Getting started
The easiest way to begin using this code is to simply fork it to your personal GitHub project space, log into https://zeit.co/ (create an account using your GitHub account) then use the Import Project option, select your forked version of this repository, then deploy it so you can see the app in action. 

## Notes about the app
This app is only built and tested against the Chrome browser (as of writing this, version 80). There are no special configuration files that need to be adjuested to run the code locally, however the rollup.config.js contains a 'fileVersion' variable for clearing the application cache in the browser. You need to change this variable when updating a build for the application in order force the app to refresh in the browser (unless you manually clear the browser cache).


## Change log

April 6, 2020
- tested using nanoSQL for indexedDb but the basic functions such as listDatabases are not able to find databases after creating a database and reloading the app; switched to idb plugin instead since that is in active development and has great documentation

April 5, 2020
- looking at nanoSQL as an alternative to localForage to save data locallly to indexedDb but it does not seem stable enough; may 
want to look at https://github.com/jakearchibald/idb#opendb

April 2, 2020
- creating a staging directory where the src code will be copied and versioning strings will be updated before compiling and building
- reworking the cache clearing in the main.js and rollup.config.js

April 1, 2020
- adding a 'replace-in-file' plugin that allows for string replacement of constants/variables in my distribution/build files (using to clear file cache)
- tested trying to use the @rollup/plugin-replace and rollup-plugin-modify but only the main.js and svelte files were affected so I had to rework the rollup process

March 31, 2020
- creating a new component for entering back-end API connection information
- creating a basic Laravel template with simple API test to use against this Svelte front-end (https://github.com/kuhlaid/laravel2020.03.31)

March 30, 2020
- finishing up basic network status handler
- looking into Laravel integration; thought of using a Laravel Svelte combined build but that would be overly complicated and poor practice in my opinion

March 29, 2020
- trying to understand Promise syntax in Svelte

March 28, 2020
- testing localforage

March 27, 2020
- released version 0.1.3
- running PWA audits in Lighthouse and finally getting a green light
- gave up on trying to get the service worker registered in Firefox since it seems to simply ignore that a service working is trying to be installed (from what I have read there are issues outstanding regarding permission settings set my users being incompatible with service workers)
- optimized bootstrap to only use a single minified css file and removed the bootstrap module (which did not allow for simply loading the css file since it included a reference to the css map file which we do not need)

March 26, 2020
- released version 0.1
- beginning to run PWA audits and add placeholders for missing PWA pieces; working on offline file caching to the service worker

March 25, 2020
- I started building this Svelte app using the starter Svelte template at https://github.com/sveltejs some of the following comands to copy a basic Svelte template and the modules I would use to develop the app:
```bash
npx degit sveltejs/template svelte2
cd svelte2
npm install
npm install bootstrap
npm install rollup-plugin-copy
npm install workbox-sw
npm install gulp
npm install workbox-build
npm install rollup-plugin-workbox-build
```
