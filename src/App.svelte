<!--
Pulling sample code from https://svelte.dev/examples#svelte-component

March 25, 2020 - wpg
- resorted to using Bootstrap instead of Smelte

March 24, 2020 - wpg
- tried to use the NavigationDrawer smelte component but it does not link to components from what I can tell
-->
<script>
	// adding Smelte button
	//import "smelte/src/tailwind.css";

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

	function changeComponent(event) {
		// change the selected component
		selected = options[event.originalTarget.attributes.id.nodeValue];
	}
</script>
<link rel='stylesheet' href='vendor/bootstrap/css/bootstrap.min.css'>
<!-- Page selector using form element
<select bind:value={selected} multiple=1>
	{#each options as option}
		<option value={option}>{option.page}</option>
	{/each}
</select>
 -->

<div class="container">
 <!-- component selector using normal html element could be used in connection with bootstrap.
 Using the array index value in the foreach statement. -->
 <div class="btn-group btn-group-lg">
  {#each options as option, i}
  <button type="button" class="btn btn-primary" on:click={changeComponent} id={i}>{option.page}</button>
 {/each}
</div> 

  <div class="row">
    <div class="col-sm-4">
      <h3>Column 1</h3>
      <p>Lorem ipsum dolor..</p>
    </div>
    <div class="col-sm-4">
      <h3>Column 2</h3>
      <p>Lorem ipsum dolor..</p>
    </div>
    <div class="col-sm-4">
      <h3>Column 3</h3>
      <p>Lorem ipsum dolor..</p>
    </div>
  </div>
  <div class="row">
	<!-- this is where our main content is placed -->
	<svelte:component this={selected.component}/>
  </div>
</div>