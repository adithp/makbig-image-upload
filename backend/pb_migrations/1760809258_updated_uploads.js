/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gc9idd8e8ozs3n")

  collection.updateRule = "@request.auth.role = \"admin\" || (@request.auth.id = student_id && admin_reply = \"\")"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gc9idd8e8ozs3n")

  collection.updateRule = ""

  return dao.saveCollection(collection)
})
