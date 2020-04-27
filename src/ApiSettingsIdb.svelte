<!--
    @abstract This component will be used to update the URL of the server-side API to connect to.
    We need to read the localstorage strApiUrl value and copy to a writable variable.

    @todo Check the session token with the API server.
    Check if the user has an active session with a back-end API and save session.
-->
<script>
    import { objOfflineStatus, objAppDbConn } from './stores.js';
    let strApiUrl; // this will be the read-only store promise we read from the database but do not change
    let strApiUrlReadable='';  // this is the prior URL value
    let objApiData=''; // this will hold any data we retrieve from the server API

    let storeApiTokenReadable;
    let strApiToken;
    let blnGetApiData;  // determine if we can make calls to the API or not (if we are offline)
    let strGetApiBtnClass='primary';
    let selectdTable;
    function btnSaveClick_ApiUrl() {
        objApiData='';
        putApiAddress();
    }

    function getApiToken() {console.log("getApiToken");} // here get the API token we have stored in indexedDb in order to place API calls

    // here we first need to check the API tokens match so we send the token we have to the API
    function btnGetApiDataClick(tableName) {
        //console.log(tableName + " btnGetApiDataClick");
        selectdTable=tableName; // we need to know the db table we will be saving to
        getApiToken();
        getApiData();
    }

    // request data from the API
    function getApiData() {
        objApiData = '<div class="spinner-border" role="status"><span class="sr-only">Checking the API, please wait...</span></div>';   // note the '@html' in the output
        // note we want to use a GET request because API authentication will take place through the API server
        fetch(strApiUrl, {
            mode: 'cors',
            headers: {
                'X-CSRF-TOKEN': storeApiTokenReadable
            }
        })
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    objApiData = '';
                    return;
                }

                // Examine the text in the response (Note: we should not allow submission of a blank field so we disable the submit button unless something is entered)
                response.json().then(function(data) {
                    objApiData = JSON.stringify(data);  // console.log(data);
                    putRawApiData(data);
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
            objApiData = '';
        });
    }

    // save raw API data 
    function putRawApiData(objData){
        // parse the objData from the server; we are mainly looking for data and a data dictionary
        var objectStore = $objAppDbConn.transaction(["RawData"], 'readwrite').objectStore("RawData");
        var request = objectStore.put(objData);

        request.onerror = function(e) {
            console.log('Error', e.target.error.name);
        };
        request.onsuccess = function(e) {
            console.log('saved API data');
            var db = $objAppDbConn.transaction([selectdTable], 'readwrite').objectStore(selectdTable);
            putApiData([objData.api.data], db, () => {});
            putApiConfig(objData.api.config);
        };
    }

    // extract data fields from API data 
    function putApiData(strData, objectStore, callback){
        var dataArray = JSON.parse(strData);
        dataArray.forEach(value => {
            console.log(value);
            var request = objectStore.put(value);
        })

        objectStore.oncomplete = function(event) {
            callback();
        }       
    }

    // extract API config from API data 
    function putApiConfig(objData){
        var objectStore = $objAppDbConn.transaction(["FormConfig"], 'readwrite').objectStore("FormConfig");
        var request = objectStore.put(objData);

        request.onerror = function(e) {
            console.log('Error', e.target.error.name);
        };
        request.onsuccess = function(e) {
            console.log('saved API config');
        };      
    }

    // pull the API address from the local db
    function getApiAddress() {
        var objectStore = $objAppDbConn.transaction(["AppSettings"], 'readwrite').objectStore("AppSettings");
        var request = objectStore.get('api_url');

        request.onerror = function(e) {
            console.log('Error', e.target.error.name);
        };
        request.onsuccess = function(e) {
            //console.log(request.result);
            if (request.result) {
                strApiUrlReadable = strApiUrl = request.result.value;
            }
            else strApiUrl= '';
        };
    }

    // here we react to changes in our offline status in order to enable or disable our API server requests (which are only performed if the network is online)
    $: {
        if (strApiUrlReadable && $objOfflineStatus.status=='online') {
            blnGetApiData = true;
            strGetApiBtnClass = 'primary';
        }
        else {
            blnGetApiData = false;
            strGetApiBtnClass = 'light';
        }
    }

    // update the API address in the local db
    function putApiAddress() {
        var apiUrlSetting = { name: "api_url", value: strApiUrl };
        var objectStore = $objAppDbConn.transaction(["AppSettings"], 'readwrite').objectStore("AppSettings");
        var request = objectStore.put(apiUrlSetting);

        request.onerror = function(e) {
            console.log('Error', e.target.error.name);
        };
        request.onsuccess = function(e) {
            getApiAddress();
        };
    }

    getApiAddress();
</script>
<div class="p-4 m-3 border border-solid">This Svelte component demonstrates the saving of application settings to indexedDb and requesting simple API test data from a Laravel server 
using the Laravel template at <a href="https://github.com/kuhlaid/laravel2020.03.31" target="_blank">https://github.com/kuhlaid/laravel2020.03.31</a>. Once you have cloned the Laravel GitHub code just mentioned and started the local Laravel server,
you should be able to copy/enter the following URL into the server API address field to pull test API data from your local Laravel server (if your local Laravel host address is not 127.0.0.1:8000 simply substitute
your host string in the following URL):<br/>
<strong>
http://127.0.0.1:8000/api/ProduceFormly<br/>
http://127.0.0.1:8000/api/FrozenFormly
</strong>
</div>
<div class="input-group input-group-sm mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="inputGroup-sizing-sm">Server API URL</span>
  </div>
  <input type="text" class="form-control" aria-label="Server API URL" aria-describedby="inputGroup-sizing-sm" bind:value={strApiUrl} placeholder="Paste/Enter the server API address here" id="apiUrlInput"/>
</div>
<button on:click={btnSaveClick_ApiUrl} class="ml-2 btn btn-primary" disabled={!strApiUrl}>Save the server API address and check for data from the API</button>
<button on:click={() => btnGetApiDataClick('Produce')} class="ml-2 btn btn-{strGetApiBtnClass}" disabled={!blnGetApiData}>Get produce items data from the server API</button>
<button on:click={() => btnGetApiDataClick('Frozen')} class="ml-2 btn btn-{strGetApiBtnClass}" disabled={!blnGetApiData}>Get frozen items data from the server API</button>
<div class="p-4 m-3 border border-solid">
<h3>Data from the server API:</h3>
{@html objApiData}
</div>
<p class="alert alert-primary mt-2">The server API address is set to: 
<strong>{strApiUrlReadable}</strong>
</p>