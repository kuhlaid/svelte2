import { writable } from 'svelte/store';
export const strDbName_ProductStore = 'ProductStore';   // name for an indexedDb database
export const strStoreName_Produce = 'Produce';  // name of the 'table' in our indexedDb database
export const objProductStoreDbConn = writable();    // stores our indexedDb database connection

/**
 * NOTE: You cannot place indexedDb transactions within this script but indexedDb connections should be stored here.
 * If you try to create your indexedDb connection within a sub-component then you will lose the connection when you switch between
 * components.*****
 *  */ 