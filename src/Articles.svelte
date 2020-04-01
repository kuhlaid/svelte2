<!--
    One thing I am trying to understand is whether the promiseStore is run each time this component is accessed. For instance when I change the value in the input field then navigate 
    to another component and then return to this one, the '{#await $promiseStore}' seems to execute. The text input field keeps reverting back to [object Promise]
-->
<script>
	function handleClick() {
		alert('no more alerts')
    }


     //https://svelte.dev/repl/372886ec7caf4db8a855b70eac87da05?version=3.16.0
    // v3 - having an issue making both a readable and a writable store linked to the input box with promises
    // import { writable } from "svelte/store";
    // import localforage from 'localforage';
    // const store = writable(localforage.getItem("lfstore")
    //     .then(function (value) {
    //         console.log('early get: ' + value);
    //     }));   //this runs each time the component is loaded/accessed so if I leave the component and come back then it executes again
    // store.subscribe(val => localforage.setItem("lfstore", val).then(function (value) {console.log('saved to local db: ' + value);}));    // this just sets the database value for the lfstore key as the user enters it


// v1 - simply localstorage offline data
    import { writable } from "svelte/store";
    const store = writable(localStorage.getItem("store") || "");
    store.subscribe(val => localStorage.setItem("store", val));

 // v2 - this version doesn't constantly listen for the changes but ... 
    // import { writable } from "svelte/store";
    // import localforage from 'localforage';
    // export const promiseStore = writable(Promise.resolve(localforage.getItem("lfstore"))); 
    // const store = writable(localforage.getItem("lfstore") || "blah");
    // store.subscribe(val => localforage.setItem("lfstore", val));

    // vBlahh
    // const store = writable(localforage.getItem("lfstore").then(function (value) {console.log('early get ' + value);}));   //this runs each time the component is loaded/accessed so if I leave the component and come back then it executes again
    // store.subscribe(val => localforage.setItem("lfstore", val));    // this just sets the database value for the lfstore key as the user enters it
    // store.subscribe(val => localforage.getItem("lfstore").then(function (value) {console.log('later get ' + value); return value;}));

    console.log({$store});  // see if we can get the same store value
</script>

<div class="p-2">
This component is used to show how to save data to localStorage.
</div>
<label for="testData">Enter test data</label>
<input bind:value={$store} placeholder="give some input here"/>

<p class="alert alert-primary mt-2">Data entered by user: 
<strong>{$store}</strong>
</p>

<!-- 
<input placeholder="give some input here">
<button on:click|once={handleClick}>
	Save your input
</button>
-->
