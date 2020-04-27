## Getting started
The easiest way to begin using this code is to simply fork it to your personal GitHub project space, log into https://zeit.co/ (create an account using your GitHub account) then use the Import Project option, select your forked version of this repository, then deploy it so you can see the app in action. As for working with this code locally, for newbies this app is built from Node.js so will want to have the latest version of Node.js installed along with npm.

## Screenshots from version v0.2.0
> ![intro](https://user-images.githubusercontent.com/41551429/80168316-86c4bc80-85b0-11ea-85a7-96f30720d370.png)

> ![api](https://user-images.githubusercontent.com/41551429/80168314-862c2600-85b0-11ea-94ae-ddf7d5151e0b.png)

> ![table](https://user-images.githubusercontent.com/41551429/80168313-862c2600-85b0-11ea-9bb6-13cd1d81d8d4.png)

> ![dfg](https://user-images.githubusercontent.com/41551429/80168312-85938f80-85b0-11ea-84d9-85439a903a48.png)



## Notes about the app
This app is only built and tested against the Chrome browser (as of writing this, version 80). There are no special configuration files that need to be adjuested to run the code locally, however the rollup.config.js contains a 'fileVersion' variable for clearing the application cache in the browser. You need to change this variable value 
(within the .env file) when updating a build for the application in order force the app to refresh in the browser (unless you manually clear the browser cache - which should only be done in development).

## @ToDo
- should probably create a local db table that keeps track of all of the data API tables available to access and then 
generate a dynamic selection list on the ApiSettings component for selection which API to pull data from, when it was last
pulled and when data was last pushed? 
- would be nice if the Svelte store variables could be created dynamically based on the data API configuration; I suppose this could be set within the .env config
- link data rows with a form configuration version so that when we need to view or edit the data, the correct version of the 
data configuration is used
- need to determine the form config version to use when adding new records (need to save an app setting key=>value pair whenever an API is downloaded from the server or data is pushed so we know the latest version to use)

## Change log
April 27, 2020
- Moving the indexedDb table config out of the Svelte store to .env file to dynamically connect to the database tables our app is using. Adding a a second API
set of data in order to test multiple data tables for adding and editing records. Adding a selection list for data tables to pull from on the data selection view. 
Dynamically connecting to indexedDb tables based on a environment configuration instead of hard-coded table connections.

April 25, 2020
- Modifying the data table to respond to a user clicking a record row/cell in order to load the record details into the record edit form. Also modifying the dynamic form generator to fill the form with a record selected from the data table.

April 23, 2020
- One of the issues with an offline PWA is how do you differentiate data entries created through the PWA while offline and data retrieved from the data server API? UUID is useful in this instance because in server-side only data entry, primary keys for records are generally auto-incremented integers, however this is a problem with client-side and server-side data entry happening simultaniously. For this app we are using timestamp based UUID for record identifying. Data retrieved from the server-side and updated locally on the client side will simply keep the same UUID sent from the server, and new client-side records will contain a unique UUID to be pushed to the server. Adding a uuid module to the project code.
- Finished setup of a basic server data API GET request and parsing of the returned JSON to save unique data records to the browser as well as the data dictionary and API definitions.
- Updated the sample dynamic form generation component to pull the form definition from our data API server instead of
hard-coding the form field definitions into the component.

April 22, 2020
- After taking time to explore the workings of a Laravel data API I thought it would be appropriate 
to look at dynamic form generation within Svelte. The reason for this is I do not want to hard-code a bunch of forms
within this front-end app. I want the back-end data API to define the data through which our front-end will build views and forms to work with the data and send that configuration via a JSON formatted object to our front-end app.
The svelte-formly module is a good starting point as it dynamically builds a form based on a JSON formatted configuration.
- Beginning to move the application settings from localStorage to indexedDb since the values in indexedDb do not appear
editable from the browser developer tools
- Moved the 'online' status to the Svelte store so the status is accessible across components for disabling buttons to the server API for instance when offline

April 13, 2020
- I spent a week on indexedDb testing and pulling my hair out wondering why I couldn't force a indexedDb connection to close (even when there were no transactions taking place) and then reopen the db connection. The API makes it rather clear this is not possible. Closing a db connection (using the close method) within your code is fairly worthless and does not mean the browser has forgotten the browser tab that opened the connection. The browser still locks the connection for reuse in the same session by the same point of origin as they like to say in the indexedDb documentation. IndexedDb is useless unless you are making a simple counter app or add/delete notes app, which all of the example indexedDb code consists of. So while there is lot of boasting about all the features of indexedDb, it doesn't cut it for serious production apps. Blah.
- With that said I went back to the drawing board to try a different approach. I ditched the idb plugin and opted for a direct indexedDb API connection without the Promises library. Instead of simply trying to open the database connection within my Svelte sub-components, I open it under the main App.svelte component and save the database connection to the Svelte store (this step was important). This new approach improved things quite a bit since I was no longer seeing the database connection loss when navigating between components/pages. So as long as the browser doesn't drop the db connection for some reason I should be able to work with this approach. NOTE: One thing that is super important with regards to when you setup the database connection is that it must be setup before attempting any transactions. This is why I have the Intro component/page load first in order to ensure my database connection is in place before loading any of the other components that try to pull data from the database.***

April 7, 2020
- seeing if it is possible to serialze js code so when we make server API requests, data AS WELL AS js code to present the data can be passed back
to the app (dynamic data presentation in our static front-end app); found that this can be done using the serialize-javascript plugin, but not sure if it is worth implementing
- testing and debugging indexedDb code

April 6, 2020
- tested using nanoSQL for indexedDb but the basic functions such as listDatabases are not able to find databases after creating a database and reloading the app; switched to idb plugin instead since that is in active development and has great documentation
- looking into Svelte datatable; first tried jQuery datatables with bootstrap but that didn't work; switched to svelte-table plugin which worked well

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
npm install (some other stuff to get going)
```
