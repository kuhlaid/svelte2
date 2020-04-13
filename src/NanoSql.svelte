<!-- 
    This component will be used to test nanoSQL to connect to an indexedDb.
    https://nanosql.io/databases.html#selecting-a-database-or-table

    After some tests the component does not look to be setup to load/connect to existing databases without recreating them each time you load
    your app. since the database connections are only created when a database is added, so a reload of your app drops all database connections
    even though the database still exist. Also the indexedDb.open() needs to know the IDs of the tables so nanoSQL would need to keep track of 
    these in localStorage most likely.
-->
<script>
    import { nSQL } from "@nano-sql/core";
    let objDbData = '';

function listDbs() {
    objDbData = '<div class="spinner-border" role="status"><span class="sr-only">Checking the DB, please wait...</span></div>';
    nSQL().connect({id: "test1_0",mode: "PERM"}); // checking indexedDbs
    objDbData = nSQL().listDatabases();
}

function btnCreateDb() {
    // create an indexedDb database and insert with some test data
nSQL().createDatabase({
    id: "test1_0",
    mode: "PERM",
    tables: [
        {
            name: "users1_0",
            model: {
                "id:uuid": {pk: true},
                "name:string": {},
                "age:int": {},
                "meta:obj": {
                    model: {
                        "color:string": {}
                    }
                },
                "tags:string[]": {default: []}
            },
            indexes: {
                "tags:string[]": {},
                "meta.color:string": {},
                "age:int": {}
            }
        }
    ],
    version: 1, // current schema/database version
    }).then(() => {
        return nSQL("users1_0").query("upsert", {name: "Jeb1", age: 20, meta: {color: "blue"}, tags: ["some1", "tags1", "here1"]}).exec();
    }).then(() => {
        return nSQL("users1_0").query("select").exec();
    }).then((rows) => {
        console.log(rows);
        /*
        [
            {
                "id": "64c611b8-0b1e-42f6-af52-5b8289834bba",
                "name": "Billy",
                "age": 21,
                "meta": {
                    "color": "blue"
                },
                "tags": [
                    "some",
                    "tags",
                    "here"
                ]
            }
        ]
        */
    });
}

function btnGetDbRows() {
    nSQL().useDatabase("test1_0");
    nSQL("users1_0").query("select").exec({
    }).then((rows) => {
        console.log(rows);
        /*
        [
            {
                "id": "64c611b8-0b1e-42f6-af52-5b8289834bba",
                "name": "Billy",
                "age": 21,
                "meta": {
                    "color": "blue"
                },
                "tags": [
                    "some",
                    "tags",
                    "here"
                ]
            }
        ]
        */
    });
}

    const DATABASE_NAME = 'blannano';
    const NANO_SQL_MODE = 'PERM';
    const TABLE_NAME_AUTH = 'authorization';
    const NANO_SQL_VERSION = 3;

function createTestDb() {
    nSQL().createDatabase({ id: DATABASE_NAME, mode: NANO_SQL_MODE, tables: [ { name: TABLE_NAME_AUTH, model: { "id:uuid": {pk: true}, "key:string": {}, "value:string": {} } } ], version: NANO_SQL_VERSION }).then(() => { console.log('created'); }).catch((exception) => { console.log('no good'); });
}

function dropTestDb() {
    nSQL().dropDatabase(DATABASE_NAME).then(() => { console.log('done'); }).catch((exception) => { console.log('no good'); });
}
</script>
<button on:click={createTestDb} class="btn btn-primary">Create test database</button>
<button on:click={dropTestDb} class="btn btn-primary">Drop test database</button>
<div class="p-4 m-3 border border-solid">Testing nanoSQL.
<button on:click={btnCreateDb} class="btn btn-primary">Create database</button>


<button on:click={btnGetDbRows} class="btn btn-primary">Get rows from users table</button>

<button on:click={listDbs} class="btn btn-primary">List databases</button>

</div>


<div class="p-4 m-3 border border-solid">
<h3>Data from the local database:</h3>
{@html objDbData}
</div>