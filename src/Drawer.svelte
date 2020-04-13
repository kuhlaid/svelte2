<!-- 
    April 13, 2020
    - switching to using plain vanilla indexedDb API connection without promises
    This component will be used to test the idb plugin to connect to an indexedDb (after tests of nanoSQL failed). 
    $dbConnection.close() does not work. Do not try to use. 
    Should use a format like https://codepen.io/xon5/pen/wYMezq to handle the $dbConnection code
-->
<script>
    import { strStoreName_Produce,objProductStoreDbConn } from './stores.js';
    import ProduceList from "./ProduceList.tpl.svelte";   // pulling a list of data from our indexeddb data table
    
    let produceRows=[];

    // simple $objProductStoreDbConn connection (not using idb plugin)
    function addItem() {
        var transaction = $objProductStoreDbConn.transaction([strStoreName_Produce], 'readwrite');
        var store = transaction.objectStore(strStoreName_Produce);
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
            getProduce();// would like to update the ProduceList now
        };
    }

    function getProduce() {
        var transaction = $objProductStoreDbConn.transaction([strStoreName_Produce], 'readwrite');
        var store = transaction.objectStore(strStoreName_Produce);
        var request = store.getAll();

        request.onerror = function(e) {
            console.log('Error', e.target.error.name);
        };
        request.onsuccess = function(e) {
            //console.log(JSON.stringify(request.result));
            produceRows = request.result;
            //rows.forEach(lisItem);
        };
    }
    getProduce();
</script>
<div class='m-1'>This component tests adding data to indexedDb. 
<br/>
@todo - work on pulling data from the server and saving to local database
</div>
<button on:click={addItem} class="btn btn-primary">Add a row to indexedDb</button>
<div class="p-4 m-3 border border-solid">
<h3>Data from the local database:</h3>
<ProduceList rows="{produceRows}"/>
</div>