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

	// the changeComponent function changes the selected component (the event.originalTarget.id would probably if we were using the a different element)
	function changeComponent(event) {
		selected = options[event.originalTarget.id];
	}
</script>

<!-- PWA stuff starts ================================ -->
<!-- Manifest -->
<link rel="manifest" href="manifest.json">

<!-- Chrome for Android theme color -->
<meta name="theme-color" content="#90a8b2">

<!-- Add to homescreen for Chrome on Android -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="application-name" content="PSK">
<link rel="icon" sizes="192x192" href="images/touch/icon-192x192.png">

<!-- Add to homescreen for Safari on iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Polymer Starter Kit">
<link rel="apple-touch-icon" href="images/touch/icon-192x192.png">

<!-- Tile for Win8 -->
<meta name="msapplication-TileColor" content="#90a8b2">
<meta name="msapplication-TileImage" content="images/touch/icon-192x192.png">
<!-- PWA stuff ends ================================ -->

<link rel='stylesheet' href='vendor/bootstrap/css/bootstrap.min.css'>

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
  </div>
</div>