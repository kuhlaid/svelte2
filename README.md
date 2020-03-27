## Getting started
The easiest thing to start using this code is simply fork it to your personal GitHub space, log into https://zeit.co/ (create an account using your GitHub account) then use the Import Project option, select your forked version of this repository, then deploy it so you can see the app in action.

## Change log

March 26, 2020
- released version 0.1
- beginning to run PWA audits and add placeholders for missing PWA pieces; adding offline file caching to the service worker

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
``