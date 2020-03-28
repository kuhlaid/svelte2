## Getting started
The easiest thing to start using this code is simply fork it to your personal GitHub space, log into https://zeit.co/ (create an account using your GitHub account) then use the Import Project option, select your forked version of this repository, then deploy it so you can see the app in action.

## Change log

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
