/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    // Simple migration to test if Dao works
    console.log("Debug migration running...");
    return null;
}, (db) => {
    // Rollback - do nothing
    console.log("Debug migration rollback...");
    return null;
});