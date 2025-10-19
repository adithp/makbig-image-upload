/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3877s5dvnxtco4w",
    "created": "2025-10-18 17:23:55.064Z",
    "updated": "2025-10-18 17:23:55.064Z",
    "name": "domains",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "2pztb4jx",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_FGTsv7v` ON `domains` (`name`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return new Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3877s5dvnxtco4w");

  return dao.deleteCollection(collection);
})
