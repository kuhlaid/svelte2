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
	import ApiSettings from './ApiSettings.svelte';

	// these are our 'pages'
	const options = [
		{ page: 'Nav 1',   component: Visits   },
		{ page: 'LocalStorage Test', component: Articles },
		{ page: 'Nav 2',   component: Drawer   },
		{ page: 'API Settings',   component: ApiSettings   },
	];
	let selected = options[0];
	let intSelected = 0;
	let strActiveComponent;

	// the changeComponent function changes the selected component (the event.originalTarget.id is not accessible in Chrome so switched to event.srcElement.id)
	function changeComponent(event) {
		//console.log(event);
		selected = options[event.srcElement.id];
		intSelected = event.srcElement.id;
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

  <div class="alert alert-light p-2">The source code for this app can be found at <a href="https://github.com/kuhlaid/svelte2" target="_blank">https://github.com/kuhlaid/svelte2</a></div>
</div>