<!-- 
    April 13, 2020
    - switching to using plain vanilla indexedDb API connection without promises
    This component will be used to test the idb plugin to connect to an indexedDb (after tests of nanoSQL failed). 
    $dbConnection.close() does not work. Do not try to use. 
-->
<script>
    let blnShowList=1;   // we provide this value to the DFG component
    import { strStoreName_Produce,objAppDbConn } from './stores.js';
    import ProduceList from "./ProduceList.tpl.svelte";   // pulling a list of data from our indexeddb data table
    import { v1 as uuidv1 } from 'uuid';    // timestamp based ID (ideally we might want to consider using v5 with URL based so client side generated UUID does not collide with server side generated UUID, although we should be able to achieve the same thing with v1 using specific random numbers for client=0 and server=1 in the options)
    import DFG from "./DFG.svelte";

    let uuid='';
    let produceRows=[];
    
    // here we have forwarded the on:clickCell event
    function recordCellClick(event) {
        // console.log(event.detail.row);
        // console.log(event.detail.key);
        sessionStorage.setItem("recordId", event.detail.row.uuid);
        toggleForm();
    }

    // show or hide the record form
    function toggleForm() {
        blnShowList = !blnShowList;
    }

    function addRecord() {
        sessionStorage.setItem("recordId", "");
        toggleForm();
    }

    function editRecord() {
        sessionStorage.setItem("recordId", "9065e639-1dc9-4e04-a9df-52cef0def13a");
        toggleForm();
    }

    function getProduce() {
        var transaction = $objAppDbConn.transaction([strStoreName_Produce], 'readwrite');
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
<div class='m-1'>This component tests adding and editing data stored in indexedDb.</div>
<div class="p-4 m-3 border border-solid">
{#if blnShowList}
	<h3>Data from the local database:</h3>
    <button on:click={addRecord} class="btn btn-primary">Add a row to indexedDb</button>
    <ProduceList rows="{produceRows}" on:clickCell={recordCellClick}/>
{:else}
    <h3>Edit record:</h3>
    <!-- recordId={uuid}  -->
	<DFG on:submit={toggleForm}/> 
    <button on:click={toggleForm} class="btn btn-primary">Cancel</button>
{/if}
</div>