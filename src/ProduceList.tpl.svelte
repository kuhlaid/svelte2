<!--
    This is simply a template for the produce data table.
-->
<script>
    import { strStoreName_Produce,objAppDbConn } from './stores.js';   // get the indexedDb connection from the Svelte store
    import SvelteTable from "svelte-table";   // used to build our data table
    export let rows = [];   // data for the table
    
    // define data column configs
    const columns = [
    {
        key: "editRecord",
        title: "Edit record",
        value: v => '<button class="btn btn-primary">Edit a row to indexedDb</button>',
        sortable: false,
        headerClass: " text-left active "
    },
    {
        key: "uuid",
        title: "Identifier",
        value: v => v.uuid,
        sortable: true,
        // filterOptions: rows => {
        // // generate groupings of 0-10, 10-20 etc...
        // let nums = {};
        // rows.forEach(row => {
        //     let num = Math.floor(row.uuid / 10);
        //     if (nums[num] === undefined)
        //     nums[num] = { name: `${num * 10} to ${(num + 1) * 10}`, value: num };
        // });
        // // fix order
        // nums = Object.entries(nums)
        //     .sort()
        //     .reduce((o, [k, v]) => ((o[k] = v), o), {});
        // return Object.values(nums);
        // },
        // filterValue: v => Math.floor(v.id / 10),
        headerClass: " text-left active "
    },
    {
        key: "name",
        title: "Produce",
        value: v => v.name,
        sortable: true,
        // filterOptions: rows => {
        // // use first letter of name to generate filter
        // let letrs = {};
        // rows.forEach(row => {
        //     let letr = row.name.charAt(0);
        //     if (letrs[letr] === undefined)
        //     letrs[letr] = {
        //         name: `${letr.toUpperCase()}`,
        //         value: letr.toLowerCase()
        //     };
        // });
        // // fix order
        // letrs = Object.entries(letrs)
        //     .sort()
        //     .reduce((o, [k, v]) => ((o[k] = v), o), {});
        // return Object.values(letrs);
        // },
        // filterValue: v => v.name.charAt(0).toLowerCase(),
        headerClass: " text-left active "
    },
    {
        key: "price",
        title: "Price",
        value: v => v.price,
        sortable: true,
        headerClass: " text-left active "
    },
    {
        key: "description",
        title: "Description",
        value: v => v.description,
        headerClass: " text-left active "
    },
    {
        key: "created",
        title: "Added date",
        value: v => v.created,
        headerClass: " text-left active "
    }
    ];
</script>
<SvelteTable columns="{columns}" rows="{rows}" classNameTable="table table-hover table-bordered" on:clickCell />