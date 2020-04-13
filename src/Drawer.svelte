<!-- 
    This component will be used to test the idb plugin to connect to an indexedDb (after tests of nanoSQL failed). 
    $dbConnection.close() does not work. Do not try to use. 
    Should use a format like https://codepen.io/xon5/pen/wYMezq to handle the $dbConnection code
-->
<script>
    //import { onDestroy } from 'svelte';
    import { openDB, deleteDB, wrap, unwrap } from 'idb/with-async-ittr.js';    // using this version of idb since it is needed for iterating through index queries
    import { dbConnection,storeConnection,basicDbConnection } from './stores.js';

	let intDbVersion=1;
	const __DBNAME__ = 'WpgTest';
    const __STORENAME__ = 'storeTest';

    let objDbData='';
    
    // simple $basicDbConnection connection (not using idb plugin)
    function addItem() {
        var transaction = $basicDbConnection.transaction(['store'], 'readwrite');
        var store = transaction.objectStore('store');
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
        };
    }

    async function getDemoDbData() {
        console.log('getDemoDbData');
        console.log($dbConnection);
        objDbData = '<div class="spinner-border" role="status"><span class="sr-only">Checking the DB, please wait...</span></div>';
        // Get all the articles in date order:
       objDbData = await $dbConnection.getAllFromIndex(__STORENAME__+intDbVersion, 'date');
       // objDbData = '';
    }

    async function addDemoDbData() {   
        console.log('addDemoDbData');
        console.log($dbConnection);
        console.log($storeConnection);
        objDbData = '<div class="spinner-border" role="status"><span class="sr-only">Checking the DB, please wait...</span></div>';
        //  add test data
        await $dbConnection.add(__STORENAME__+intDbVersion, {
            title: 'Article 10',
            date: new Date('2019-01-01'),
            body: 'some body',
        });
    
        // Add multiple articles in one transaction:
        {
            const tx = $dbConnection.transaction(__STORENAME__+intDbVersion, 'readwrite');
            tx.$storeConnection.add({
            title: 'Article 12',
            date: new Date('2019-01-01'),
            body: '…',
            });
            tx.$storeConnection.add({
            title: 'Article 13',
            date: new Date('2020-01-02'),
            body: '…',
            });
            await tx.done;
        }
        
        // Get all the articles in date order:
        console.log(await $dbConnection.getAllFromIndex(__STORENAME__+intDbVersion, 'date'));
        
        // Add 'And, happy new year!' to all articles on 2019-01-01:
        {
            const tx = $dbConnection.transaction(__STORENAME__+intDbVersion, 'readwrite');
            const index = tx.$storeConnection.index('date');
        
            for await (const cursor of index.iterate(new Date('2019-01-01'))) {
                const article = { ...cursor.value };
                article.body += ' And, happy new year!';
                cursor.update(article);
            }
        
            await tx.done;
        }
       
        objDbData = '';
        console.log(objDbData);
    }
</script>
<div class='m-1'>This component was added to test the idb plugin to connect to an indexedDb. 
<br/>
@todo - work on pulling data from the server and saving to local database
</div>
<!-- <button on:click={demoDbCreate} class="btn btn-primary" disabled={blnDisableCreateDbBtn}>Create demo idb database</button>
<button on:click={demoDbDelete} class="btn btn-primary" disabled={blnDisableDeleteDbBtn}>Delete demo idb database</button> -->
<button on:click={addDemoDbData} class="btn btn-primary">Add demo idb data</button>
<button on:click={getDemoDbData} class="btn btn-primary">Get demo idb data</button>
<button on:click={addItem} class="btn btn-primary">Basic indexedDb add (no idb plugin)</button>

<!-- <button on:click={btnDbConnect} class="btn btn-primary">Connect to Db</button>
<button on:click={justClose} class="btn btn-primary">Close $dbConnection only</button> -->
<input type="text" class="form-control" aria-label="Server API URL" aria-describedby="inputGroup-sizing-sm" bind:value={intDbVersion} placeholder="Database version" id="databaseVersionInput"/>
<div class="p-4 m-3 border border-solid">
<h3>Data from the local database:</h3>
{@html objDbData}
</div>
<!-- <div>TEST {dbGlobal}</div> -->