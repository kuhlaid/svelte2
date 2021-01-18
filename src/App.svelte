<script>
/**
Pulling sample code from https://svelte.dev/examples#svelte-component

March 25, 2020 - wpg
- resorted to using Bootstrap instead of Smelte

March 24, 2020 - wpg
- tried to use the NavigationDrawer smelte component but it does not link to components from what I can tell
*/
	import { objOfflineStatus, objAppDbConn } from './stores.js';

	import Visits from './Visits.svelte';
	import DFG from  './DFG.svelte';
	import Drawer from './Drawer.svelte';
	import ApiSettings from './ApiSettingsIdb.svelte';

	// these are our 'pages'
	const options = [
		{ page: 'Intro',   component: Visits   },
		{ page: 'API Settings',   component: ApiSettings   },
		{ page: 'Data drawer',   component: Drawer   },
	];
	//{ page: 'DFG',   component: DFG   },
	let selected = options[0];

	/**
	 *  NOTE: We could save a session variable 'selectedComponentId' to keep track of the last 'tab/page' the user was on if the app refreshes,
	 * HOWEVER indexedDb will throw a transaction error if you load a component that tries to get data from the database before all of the code
	 * to establish the database connection is complete in this script. That is why I have the app. load initially on a component that DOES NOT
	 * pull from indexedDb. 
	 */
	// if (sessionStorage.getItem("selectedComponentId")) {
	// 	selected = options[sessionStorage.getItem("selectedComponentId")];
	// }
	
	let intSelected = 0;
	let strActiveComponent;
	export const __DBVERSION__=1;


	// the changeComponent function changes the selected component (the event.originalTarget.id is not accessible in Chrome so switched to event.srcElement.id)
	function changeComponent(event) {
		console.log("changeComponent");
		selected = options[event.srcElement.id];
		intSelected = event.srcElement.id;
		//sessionStorage.setItem("selectedComponentId", event.srcElement.id);	// saving the component ID to a session
	}

	// just some testing code to send console messages to the browser window
	// let consolelogs = "";
	// console.log = function() {
	// 	consolelogs += 'log-----'+(JSON && JSON.stringify ? JSON.stringify(arguments) : arguments);
	// };

	// console.warn = function() {
	// 	consolelogs += 'warn-----'+(JSON && JSON.stringify ? JSON.stringify(arguments) : arguments);
	// };

	// console.error = function() {
	// 	consolelogs += 'err----'+(JSON && JSON.stringify ? JSON.stringify(arguments) : arguments);
	// };

	$objOfflineStatus = {
		bsAlert: 'alert-light',
		statusColor: '',
		status: 'online'
	};

function onlineStatus(blnStatus) {
  if (blnStatus) {
	//console.log('online');
	$objOfflineStatus.statusColor='text-success';
	$objOfflineStatus.bsAlert='alert-light';
    $objOfflineStatus.status='online';
  } else {
	//console.log('offline');
	$objOfflineStatus.bsAlert='alert-danger';
	$objOfflineStatus.statusColor='';
    $objOfflineStatus.status='offline';
  }
}

// listen for changes in the network status of the app
window.addEventListener("load", () => {
  onlineStatus(navigator.onLine); // check for online network status when the app loads ...
  // ...then listen for changes
  function handleNetworkChange(event) {
    onlineStatus(navigator.onLine);
  }  
  window.addEventListener("online", handleNetworkChange);	// listen for online and offline event changes
  window.addEventListener("offline", handleNetworkChange);
});

// basic indexedDB API connections
var openRequest = indexedDB.open("__INDEXEDDB_NAME__", 1);

openRequest.onupgradeneeded = function(e) {
	$objAppDbConn = e.target.result;
	//console.log('running onupgradeneeded');

	// connect to our core tables
	var dbCoreTablesArray = __ARRAY_DB_CORE_TABLES__;
	dbCoreTablesArray.forEach(function(dbTable) {
		//console.log(dbTable.name);
		// here we need to connect to each of the data tables locally so we can use them throughout the app
		if (!$objAppDbConn.objectStoreNames.contains(dbTable.name)) {
			$objAppDbConn.createObjectStore(dbTable.name,{keyPath: dbTable.keypath});
		}
	});  

	// dynamically connect to each of our database table connections defines in the .env file
	var dbTablesArray = __ARRAY_DB_TABLES__;
	dbTablesArray.forEach(function(dbTable) {
		//console.log(dbTable.name);
		// here we need to connect to each of the data tables locally so we can use them throughout the app
		if (!$objAppDbConn.objectStoreNames.contains(dbTable.name)) {
			$objAppDbConn.createObjectStore(dbTable.name,{keyPath: dbTable.keypath});
		}
	});  
};
openRequest.onsuccess = function(e) {
  //console.log('running onsuccess');
  $objAppDbConn = e.target.result;
  //console.log(e.target.result);
  //addItem();
};
openRequest.onerror = function(e) {
  console.log('Error opening indexedDb!');
  console.dir(e);
};
</script>

<link rel='stylesheet' href='/bs4.4.1.css'>

<div class="container">
	<ul class="nav nav-tabs">
	{#each options as option, i}
	<li class="nav-item">
		<button class={intSelected==i ? "nav-link active p-2 ml-1" : "p-2 ml-1 nav-link"} on:click={changeComponent} id={i} role="tab">{option.page}</button>
	</li>
	{/each}
	</ul>


  <div class="row">
    <div class="col-sm-12">
		<div class="p-2">
			<h1>{selected.page}</h1>
			<svelte:component this={selected.component}/>
		</div>
    </div>
  </div>

	<div class="alert {$objOfflineStatus.bsAlert} p-1 m-2 mt-4">Network status: <strong class="{$objOfflineStatus.statusColor}">{$objOfflineStatus.status}</strong></div>

  <div class="alert alert-light p-2">(__cVersion__) The source code for this app can be found at <a href="https://github.com/kuhlaid/svelte2" target="_blank">https://github.com/kuhlaid/svelte2</a></div>
</div>
