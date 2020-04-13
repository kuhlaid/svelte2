<!--
Pulling sample code from https://svelte.dev/examples#svelte-component

March 25, 2020 - wpg
- resorted to using Bootstrap instead of Smelte

March 24, 2020 - wpg
- tried to use the NavigationDrawer smelte component but it does not link to components from what I can tell
-->
<script>
	import { dbConnection,storeConnection,basicDbConnection } from './stores.js';
	import { openDB, deleteDB, wrap, unwrap } from 'idb/with-async-ittr.js';    // using this version of idb since it is needed for iterating through index queries

	// let dbConn=get(dbConnection);
	// let storeConn=get(storeConnection);
	let intDbVersion=1;
	const __DBNAME__ = 'WpgTest';
    const __STORENAME__ = 'storeTest';

	// update the db connection and store connection in the Svelte store
	// $: storeConnection.update(storeConn);
	// $: dbConnection.update(dbConn);

	// $: {
	// 	console.log('db connection is:');
	// 	console.log({dbConn});
	// 	console.log('store connection is:');
	// 	console.log({storeConn});
	// }

	function setupStore($dbConnection){
        try {
            console.log('try to connect to the storeConn');
            // Create a $storeConnection of objects
            $storeConnection = $dbConnection.createObjectStore(__STORENAME__+intDbVersion, {
                // The 'id' property of the object will be the key.
                keyPath: 'id',
                // If it isn't explicitly set, create a value by auto incrementing.
                autoIncrement: true,
            });
            // Create an index on the 'date' property of the objects.
            $storeConnection.createIndex('date', 'date');
        }
        catch(err) {
            console.log("*********************setupStore"+err);
           const $storeConnection = $dbConnection.transaction(__STORENAME__+intDbVersion).objectStore(__STORENAME__+intDbVersion);
        }
    }
	// --- simply try to open the database
    async function tryDbOpen() {
        console.log('tryDbOpen start for version ' + intDbVersion);
        console.log($dbConnection);
        if (!$dbConnection) {
            console.log('$dbConnection connection missing so need to establish a new conn');
            // open the database
            $dbConnection = await openDB(__DBNAME__, intDbVersion, {
                upgrade($dbConnection) {
                    console.log('upgrade tryDbOpen');
                    setupStore($dbConnection);
                },
                blocked() {
                    console.log('blocked tryDbOpen');
                },
                blocking() {
                    console.log('blocking tryDbOpen');
                },
                terminated() {
                    console.log('terminated tryDbOpen');
                }
            });
        }
        console.log("db1: ");
        console.log(unwrap($dbConnection));
        console.log("$storeConnection init: ");
        console.log(unwrap($storeConnection));
        // if the $storeConnection does not exist then setup
        // if (!$storeConnection) {
        //     console.log("$storeConnection needs to be setup again");
        //     closeDb();
        //     console.log("$dbConnection should be closed: ");
        //     console.log(unwrap($dbConnection));
        //     // open new version of the database
        //     $dbConnection = await openDB(__DBNAME__, intDbVersion, {
        //         upgrade($dbConnection) {
        //             console.log("upgrade $dbConnection again");
        //             setupStore($dbConnection);
        //         },
        //         blocked() {
        //             console.log('blocked $storeConnection empty');
        //         },
        //         blocking() {
        //             console.log('blocking $storeConnection empty');
        //         },
        //         terminated() {
        //             console.log('terminated $storeConnection empty');
        //         }
		// 	});
		// 	console.log("$storeConnection v2: ");
        // 	console.log(unwrap($storeConnection));
        // }
        return $dbConnection;
    }
	tryDbOpen().then(($dbConnection) => {
		console.log('tryDbOpen opened the $dbConnection');
    })
    .catch((err) => {
      console.log(err +': tryDbOpen $dbConnection key not found');
	});
	
	import Visits from './Visits.svelte';
	import Articles from  './Articles.svelte';
	import Drawer from './Drawer.svelte';
	import ApiSettings from './ApiSettings.svelte';

	// these are our 'pages'
	const options = [
		{ page: 'Intro',   component: Visits   },
		{ page: 'API Settings',   component: ApiSettings   },
		{ page: 'idb Test',   component: Drawer   },
		{ page: 'Data table',   component: Articles   },
	];
	let selected = options[0];

	// if the session is set then go back to last component on refresh
	if (sessionStorage.getItem("selectedComponentId")) {
		selected = options[sessionStorage.getItem("selectedComponentId")];
	}
	
	let intSelected = 0;
	let strActiveComponent;
	export const __DBVERSION__=1;


	// the changeComponent function changes the selected component (the event.originalTarget.id is not accessible in Chrome so switched to event.srcElement.id)
	function changeComponent(event) {
		console.log("changeComponent");
		selected = options[event.srcElement.id];
		intSelected = event.srcElement.id;
		sessionStorage.setItem("selectedComponentId", event.srcElement.id);	// saving the component ID to a session
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

let offlineCheck = {
		bsAlert: 'alert-light',
		statusColor: '',
		status: 'online'
	};

function onlineStatus(blnStatus) {
  if (blnStatus) {
	//console.log('online');
	offlineCheck.statusColor='text-success';
	offlineCheck.bsAlert='alert-light';
    offlineCheck.status='online';
  } else {
	//console.log('offline');
	offlineCheck.bsAlert='alert-danger';
	offlineCheck.statusColor='';
    offlineCheck.status='offline';
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
var openRequest = indexedDB.open('test_db', 1);

openRequest.onupgradeneeded = function(e) {
  var $basicDbConnection = e.target.result;
  console.log('running onupgradeneeded');
  if (!$basicDbConnection.objectStoreNames.contains('store')) {
    var storeOS = $basicDbConnection.createObjectStore('store',
      {keyPath: 'id', autoIncrement:true});
  }
};
openRequest.onsuccess = function(e) {
  console.log('running onsuccess');
  $basicDbConnection = e.target.result;
  addItem();
};
openRequest.onerror = function(e) {
  console.log('onerror!');
  console.dir(e);
};

function addItem() {
  var transaction = $basicDbConnection.transaction(['store'], 'readwrite');
  var store = transaction.objectStore('store');
  var item = {
    name: 'banana',
    price: '$2.99',
    description: 'It is a purple banana!',
    created: new Date().getTime()
  };

 var request = store.add(item);

 request.onerror = function(e) {
    console.log('Error', e.target.error.name);
  };
  request.onsuccess = function(e) {
    console.log('Woot! Did it');
  };
}
</script>

<!-- Include Bootstrap CSS-->
<link rel='stylesheet' href='/bs4.4.1.css'>

<div class="container">
	<!--app navigation -->
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
			<!-- this is where our main content is placed -->
			<svelte:component this={selected.component}/>
		</div>
    </div>
  </div>

	<!-- Simple network status notification -->
	<div class="alert {offlineCheck.bsAlert} p-1 m-2 mt-4">Network status: <strong class="{offlineCheck.statusColor}">{offlineCheck.status}</strong></div>

  <div class="alert alert-light p-2">(__cVersion__) The source code for this app can be found at <a href="https://github.com/kuhlaid/svelte2" target="_blank">https://github.com/kuhlaid/svelte2</a></div>
</div>