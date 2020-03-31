<!--
    @abstract This component will be used to update the URL of the server-side API to connect to.
    We need to read the localstorage strApiUrl value and copy to a writable variable
-->
<script>
    
    import { readable, writable } from "svelte/store";  // we want to use both read-only and writable promises to local storage
    let storeApiUrlReadable; // this will be the read-only store promise we read from the database but do not change
    let strApiUrlReadable;  // this is the prior URL value
    getReadableApiUrl();
    let storeApiUrlWritable = writable(localStorage.getItem("strApiUrl") || "");
    let objApiData=''; // this will hold any data we retrieve from the server API

    let strApiUrlToSave='';
    function btnSaveClick_ApiUrl() {
        //console.log('old value is strApiUrlReadable '+ strApiUrlReadable);
        const unsubscribe = storeApiUrlWritable.subscribe(value => {
		    strApiUrlToSave = value;
        });
    
        localStorage.setItem("strApiUrl", strApiUrlToSave); // set the new API URL in local storage
        getReadableApiUrl();
        checkApi();
    }
    // here we create a request to pull the latest API URL from local storage
    function getReadableApiUrl() {
        storeApiUrlReadable = readable(localStorage.getItem("strApiUrl") || "");
        const unsubscribeReable = storeApiUrlReadable.subscribe(value => {
            strApiUrlReadable = value;
        });
    }

    function checkApi() {
        objApiData = '<div class="spinner-border" role="status"><span class="sr-only">Checking the API, please wait...</span></div>';   // note the '@html' in the output
        fetch($storeApiUrlReadable, {mode: 'cors'})
        .then(
            function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                objApiData = '';
                return;
            }

            // Examine the text in the response
            response.json().then(function(data) {
                objApiData = JSON.stringify(data);
                console.log(data);
            });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
            objApiData = '';
        });

    }
</script>
<div class="p-4 m-3 border border-solid">This Svelte component contains code to save a URL to a server API to the browser localstorage and attempt to retrieve
data from the server API. If you start a local copy of the Laravel API testing template at https://github.com/kuhlaid/laravel2020.03.31 and start up the local server, 
you should be able to copy the following URL into the server API address field to pull test API data from the local Laravel server:<br/>
<strong>http://127.0.0.1:8000/api_ex</strong>
</div>
<div class="input-group input-group-sm mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="inputGroup-sizing-sm">Server API URL</span>
  </div>
  <input type="text" class="form-control" aria-label="Server API URL" aria-describedby="inputGroup-sizing-sm" bind:value={$storeApiUrlWritable} placeholder="Paste/Enter the server API address here" id="apiUrlInput"/>
</div>
<button on:click={btnSaveClick_ApiUrl} class="btn btn-primary">Save the server API address and check for data from the API</button>

<div class="p-4 m-3 border border-solid">
<h3>Data from the server API:</h3>
{@html objApiData}
</div>
<p class="alert alert-primary mt-2">The server API address is set to: 
<strong>{$storeApiUrlReadable}</strong>
</p>