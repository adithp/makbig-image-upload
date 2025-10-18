/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gc9idd8e8ozs3n")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "orjs1t1f",
    "name": "admin_reply",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gc9idd8e8ozs3n")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "orjs1t1f",
    "name": "admin_replay",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
