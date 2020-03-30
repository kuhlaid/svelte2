<!--
Pulling sample code from https://svelte.dev/examples#svelte-component

March 25, 2020 - wpg
- resorted to using Bootstrap instead of Smelte

March 24, 2020 - wpg
- tried to use the NavigationDrawer smelte component but it does not link to components from what I can tell
-->
<script>
	import Visits from './Visits.svelte';
	import Articles from  './Articles.svelte';
	import Drawer from './Drawer.svelte';

	// these are our 'pages'
	const options = [
		{ page: 'Visits',   component: Visits   },
		{ page: 'Articles', component: Articles },
		{ page: 'Drawer',   component: Drawer   },
	];
	let selected = options[0];

	// the changeComponent function changes the selected component (the event.originalTarget.id is not accessible in Chrome so switched to event.srcElement.id)
	function changeComponent(event) {
		//console.log(event);
		selected = options[event.srcElement.id];
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
		bsAlert: 'alert-success',
		status: 'online'
	};

function onlineStatus(blnStatus) {
  if (blnStatus) {
	//console.log('online');
	offlineCheck.bsAlert='alert-success';
    offlineCheck.status='online';
  } else {
	//console.log('offline');
	offlineCheck.bsAlert='alert-secondary';
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
</script>

<!-- Include Bootstrap CSS-->
<link rel='stylesheet' href='/bs4.4.1.css'>

<div class="container">
 <!-- component selector using normal html element could be used in connection with bootstrap.
 Using the array index value in the foreach statement. -->
 <div class="btn-group btn-group-lg">
  {#each options as option, i}
  <button type="button" class="btn btn-primary" on:click={changeComponent} id={i}>{option.page}</button>
 {/each}
</div> 

<!-- Simple network status notification -->
<div class="alert {offlineCheck.bsAlert} m-2 ">Network status: <strong>{offlineCheck.status}</strong></div>

  <div class="row">
    <div class="col-sm-12">
      <h3>{selected.page}</h3>
      <!-- this is where our main content is placed -->
	<svelte:component this={selected.component}/>
    </div>
	<!--<div class="alert alert-warning">{consolelogs}</div>-->
  </div>
</div>