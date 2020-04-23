import { readable, writable } from 'svelte/store';
export const strAppDbName = 'AppDb';   // name for our indexedDb database
export const strStoreName_Produce = 'Produce';  // name of the data 'table' in our indexedDb database
export const strFormConfig_Produce = 'ProduceFormConfig';  // name of the produce data configuration 'table' in our indexedDb database
export const strStoreAppSettings = 'AppSettings';  // name of the app configuration 'table' in our indexedDb database
export const objAppDbConn = writable();    // stores our indexedDb database connection
export const objOfflineStatus = writable();    // keeps track of our online status
/**
 * NOTE: You cannot place indexedDb transactions within this script but indexedDb connections should be stored here.
 * If you try to create your indexedDb connection within a sub-component then you will lose the connection when you switch between
 * components.*****
 *  */ 