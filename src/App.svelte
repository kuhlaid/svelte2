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
</script>

<link rel='stylesheet' href='/bootstrap.min.css'>

<div class="container">
 <!-- component selector using normal html element could be used in connection with bootstrap.
 Using the array index value in the foreach statement. -->
 <div class="btn-group btn-group-lg">
  {#each options as option, i}
  <button type="button" class="btn btn-primary" on:click={changeComponent} id={i}>{option.page}</button>
 {/each}
</div> 

  <div class="row">
    <div class="col-sm-12">
      <h3>{selected.page}</h3>
      <!-- this is where our main content is placed -->
	<svelte:component this={selected.component}/>
    </div>
	<!--<div class="alert alert-warning">{consolelogs}</div>-->
  </div>
</div>