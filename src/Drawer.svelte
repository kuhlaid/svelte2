<!-- 
    This component will be used to test the idb plugin to connect to an indexedDb (after tests of nanoSQL failed). 
    db.close() does not work. Do not try to use. 
    Should use a format like https://codepen.io/xon5/pen/wYMezq to handle the db code
-->
<script>
    //import { onDestroy } from 'svelte';
    import { openDB, deleteDB, wrap, unwrap } from 'idb/with-async-ittr.js';    // using this version of idb since it is needed for iterating through index queries
    
    import { dbConnection } from './stores.js';
	let dbGlobal;
	const unsubscribe = dbConnection.subscribe(value => {
		dbGlobal = value;
	});

    let objDbData='';
    let store='';
    let db='';
    let intDbVersion=1;
    const __DBNAME__ = 'Articles';
    const __STORENAME__ = 'articles';

function justClose(){
    try {
        db=null;
        store=null;
        console.log(db);
        console.log('justClose - try to close the db connection');
        intDbVersion++; // increase the version number and try connection to a new version
            if (intDbVersion < 4) tryDbOpen();
        //db.close(); // if we cannot connect to the current version of the database then we close the connection
    }
    catch(err) {
        console.log("********** not able to close the database");
    }
}


    function closeDb(){
        try {
            db=null;
            store=null;
            console.log(db);
            console.log('closeDb - try to close the db connection');
            //console.log(db.close()); // if we cannot connect to the current version of the database then we close the connection
            intDbVersion++; // increase the version number and try connection to a new version
            if (intDbVersion < 4) tryDbOpen();
        }
        catch(err) {
            console.log("********** not able to close the database");
        }
    }

    function setupStore(db){
        try {
            console.log('try to connect to the store');
            // Create a store of objects
            store = db.createObjectStore(__STORENAME__+intDbVersion, {
                // The 'id' property of the object will be the key.
                keyPath: 'id',
                // If it isn't explicitly set, create a value by auto incrementing.
                autoIncrement: true,
            });
            // Create an index on the 'date' property of the objects.
            store.createIndex('date', 'date');
        }
        catch(err) {
            console.log("*********************setupStore"+err);
           const store = db.transaction(__STORENAME__+intDbVersion).objectStore(__STORENAME__+intDbVersion);
        }
    }


    // --- simply try to open the database
    async function tryDbOpen() {
        console.log('tryDbOpen start for version ' + intDbVersion);
        console.log(db);
        if (!db) {
            console.log('db connection missing so need to establish a new conn');
            // open the database
            db = await openDB(__DBNAME__, intDbVersion, {
                upgrade(db) {
                    console.log('upgrade tryDbOpen');
                    setupStore(db);
                },
                blocked() {
                    console.log('blocked tryDbOpen');
                },
                blocking() {
                    console.log('blocking tryDbOpen');
                },
                terminated() {
                    console.log('terminated tryDbOpen');
                }
            });
        }
        console.log("db1: ");
        console.log(unwrap(db));
        console.log("store init: ");
        console.log(unwrap(store));
        // if the store does not exist then setup
        if (!store) {
            console.log("store needs to be setup again");
            closeDb();
            console.log("db should be closed: ");
            console.log(unwrap(db));
            // open new version of the database
            db = await openDB(__DBNAME__, intDbVersion, {
                upgrade(db) {
                    console.log("upgrade db again");
                    setupStore(db);
                },
                blocked() {
                    console.log('blocked store empty');
                },
                blocking() {
                    console.log('blocking store empty');
                },
                terminated() {
                    console.log('terminated store empty');
                }
            });
        }
        console.log("store v2: ");
        console.log(unwrap(store));
        return db;
    }

function btnDbConnect() {
    tryDbOpen().then((db) => {

    })
    .catch((err) => {
      console.log(err +': tryDbOpen db key not found');
    });
}
    // async function demoDbCreate() {
    //     objDbData = '<div class="spinner-border" role="status"><span class="sr-only">Checking the DB, please wait...</span></div>';
    //     const db = await openDB(__DBNAME__, 1, {
    //         upgrade(db) {
    //             // Create a store of objects
    //             const store = db.createObjectStore(__STORENAME__, {
    //                 // The 'id' property of the object will be the key.
    //                 keyPath: 'id',
    //                 // If it isn't explicitly set, create a value by auto incrementing.
    //                 autoIncrement: true,
    //             });
    //             // Create an index on the 'date' property of the objects.
    //             store.createIndex('date', 'date');
    //         }
    //     });
    //     blnDisableCreateDbBtn=1;
    //     console.log('db upgraded');
    //     objDbData = '';
    // }



// delete the local data and database
// async function demoDbDelete() {
//     objDbData = '<div class="spinner-border" role="status"><span class="sr-only">Deleting the DB, please wait...</span></div>';
//     const db = await deleteDB(__DBNAME__, {
//         blocked() {
//             blnDisableCreateDbBtn=0;
//             alert('Articles database removed');
//             objDbData = '';
//         }
//     });
//     objDbData = '';
// }



    async function getDemoDbData() {
        console.log('getDemoDbData');
        console.log(db);
        objDbData = '<div class="spinner-border" role="status"><span class="sr-only">Checking the DB, please wait...</span></div>';
        // Get all the articles in date order:
       objDbData = await db.getAllFromIndex(__STORENAME__+intDbVersion, 'date');
       // objDbData = '';
    }

    async function addDemoDbData() {   
        console.log('addDemoDbData');
        console.log(db);
        console.log(store);
        objDbData = '<div class="spinner-border" role="status"><span class="sr-only">Checking the DB, please wait...</span></div>';
        //  add test data
        await db.add(__STORENAME__+intDbVersion, {
            title: 'Article 10',
            date: new Date('2019-01-01'),
            body: '…',
        });
    
        // Add multiple articles in one transaction:
        {
            const tx = db.transaction(__STORENAME__+intDbVersion, 'readwrite');
            tx.store.add({
            title: 'Article 12',
            date: new Date('2019-01-01'),
            body: '…',
            });
            tx.store.add({
            title: 'Article 13',
            date: new Date('2020-01-02'),
            body: '…',
            });
            await tx.done;
        }
        
        // Get all the articles in date order:
        console.log(await db.getAllFromIndex(__STORENAME__+intDbVersion, 'date'));
        
        // Add 'And, happy new year!' to all articles on 2019-01-01:
        {
            const tx = db.transaction(__STORENAME__+intDbVersion, 'readwrite');
            const index = tx.store.index('date');
        
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
<button on:click={btnDbConnect} class="btn btn-primary">Connect to Db</button>
<button on:click={justClose} class="btn btn-primary">Close db only</button>
<input type="text" class="form-control" aria-label="Server API URL" aria-describedby="inputGroup-sizing-sm" bind:value={intDbVersion} placeholder="Database version" id="databaseVersionInput"/>
<div class="p-4 m-3 border border-solid">
<h3>Data from the local database:</h3>
{@html objDbData}
</div>
<div>TEST {dbGlobal}</div>