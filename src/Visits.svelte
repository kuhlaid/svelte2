<div class='m-1'>This is a Svelte app. It is also a progressive web app. The goal of this app is to demonstrate how a vanilla Svelte build
can be transformed into a PWA front-end UI that pulls data from a server API. One of the critical pieces of this app is the ability to update 
the application code/cache for the end user if a new version of the code is released. Since our service worker script is basically controlling 
the versions of our scripts we need to be able to tell the service worker, "Stop what you are doing, because I'm about to ruin, the version of the code you are used to."
We do this by storing the code version to the user browser in localStorage. When a new version of code is released, the service worker is replaced.
</div>
<div class='m-1'>If you want to play along with this code then you will also want to have a server side app like https://github.com/kuhlaid/laravel2020.03.31
to test server API calls. </div>