import { writable } from 'svelte/store';
export const dbConnection = writable();
export const storeConnection = writable();
export const basicDbConnection = writable();    // used for plain vanilla Db connection that does not use promise library 
// export const right = writable(0);
// export const elevation = writable(0);
// export const persistent = writable(0);
// export const showNav = writable(0);