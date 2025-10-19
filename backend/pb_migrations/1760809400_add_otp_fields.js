/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // Add OTP code field
  collection.schema.addField(new SchemaField({
      "system": false,
      "id": "otp_code",
      "name": "otp_code",
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

  // Add OTP expiry field
  collection.schema.addField(new SchemaField({
      "system": false,
      "id": "otp_expires_at",
      "name": "otp_expires_at",
      "type": "date",
      "required": false,
      "presentable": false,
      "options": {}
  }))

  // Add email verified field
  collection.schema.addField(new SchemaField({
      "system": false,
      "id": "email_verified",
      "name": "email_verified",
      "type": "bool",
      "required": false,
      "presentable": false,
      "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.schema.removeField("otp_code")
  collection.schema.removeField("otp_expires_at")
  collection.schema.removeField("email_verified")

  return dao.saveCollection(collection)
})