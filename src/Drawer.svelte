<!-- 
    April 13, 2020
    - switching to using plain vanilla indexedDb API connection without promises
    This component will be used to test the idb plugin to connect to an indexedDb (after tests of nanoSQL failed). 
    $dbConnection.close() does not work. Do not try to use. 
-->
<script>
    let blnShowList=1;   // we provide this value to the DFG component
    import { objAppDbConn } from './stores.js';
    import ProduceList from "./ProduceList.tpl.svelte";   // pulling a list of data from our indexeddb data table
    import { v1 as uuidv1 } from 'uuid';    // timestamp based ID (ideally we might want to consider using v5 with URL based so client side generated UUID does not collide with server side generated UUID, although we should be able to achieve the same thing with v1 using specific random numbers for client=0 and server=1 in the options)
    import DFG from "./DFG.svelte";

    let selection;
    let tableArray=[];
    let selectedTable;
    let uuid='';
    let produceRows=[];
    
    // pull the list of tables we have assigned in our db
    function getTables() {
        var transaction = $objAppDbConn.transaction(['FormConfig'], 'readonly');
        var store = transaction.objectStore('FormConfig');
        var request = store.getAll();

        request.onerror = function(e) {
            console.log('Error', e.target.error.name);
        };
        request.onsuccess = function(e) {
            //console.log(request.result);
            tableArray = request.result;
        };
    }
    getTables();

    function changeTable() {
        console.log(selectedTable.name);
        if (selectedTable.name) {
            getTableData();
            selection = selectedTable.name;
        }
        else {
            produceRows = [];
            selection = '';
        }
    }

    // here we have forwarded the on:clickCell event
    function recordCellClick(event) {
        console.log(event.detail.row);
        // console.log(event.detail.key);
        sessionStorage.setItem("objRecord", JSON.stringify(event.detail.row));
        //sessionStorage.setItem("recordId", event.detail.row.uuid);
        toggleForm();
    }

    // show or hide the record form
    function toggleForm() {
        blnShowList = !blnShowList;
    }

    function addRecord() {
        //sessionStorage.setItem("recordId", "");
        if (selectedTable.id !== undefined) {
            sessionStorage.setItem("objRecord", JSON.stringify({"recordId":"","apiid": selectedTable.id}));
            toggleForm();
        }
    }

    function getTableData() {
        var transaction = $objAppDbConn.transaction([selectedTable.name], 'readwrite');
        var store = transaction.objectStore(selectedTable.name);
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
</script>
<div class='m-1'>This component tests adding and editing data stored in indexedDb.</div>
<div class="p-4 m-3 border border-solid">
{#if blnShowList}
	<h3>Data from the local database:</h3>
    <div class="p-2">
        <select bind:value={selectedTable} on:change="{changeTable}">
            <option value="null">-- select a db table --</option>
            {#each tableArray as table}
                <option value={table}>
                    {table.name}
                </option>
            {/each}
        </select>
        <button on:click={addRecord} class="btn btn-primary" disabled={!selection}>Add a row to indexedDb</button>
    </div>
    <ProduceList rows="{produceRows}" on:clickCell={recordCellClick}/>
{:else}
    <h3>Edit record:</h3>
    <!-- recordId={uuid}  -->
	<DFG on:submit={toggleForm}/> 
    <button on:click={toggleForm} class="btn btn-primary">Cancel</button>
{/if}
</div>