import { readable, writable } from 'svelte/store';
export const objAppDbConn = writable();    // stores our indexedDb database connection
export const objOfflineStatus = writable();    // keeps track of our online status
/**
 * NOTE: You cannot place indexedDb transactions within this script but indexedDb connections should be stored here.
 * If you try to create your indexedDb connection within a sub-component then you will lose the connection when you switch between
 * components.*****
 *  */ 