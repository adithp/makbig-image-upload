/// <reference path="../pb_data/types.d.ts" />
migrate(async (db) => {
    const dao = new Dao(db);
    const collection = await dao.findCollectionByNameOrId('users');

    // Add password reset OTP code field
    collection.schema.addField(new SchemaField({
        system: false,
        id: 'password_reset_otp',
        name: 'password_reset_otp',
        type: 'text',
        required: false,
        presentable: false,
        unique: false,
        options: {
            min: null,
            max: null,
            pattern: ''
        }
    }));

    // Add password reset OTP expiry field
    collection.schema.addField(new SchemaField({
        system: false,
        id: 'password_reset_otp_expires_at',
        name: 'password_reset_otp_expires_at',
        type: 'date',
        required: false,
        presentable: false,
        options: {}
    }));

    return await dao.saveCollection(collection);
}, (db) => {
    // This function runs when the migration is rolled back
    const dao = new Dao(db);
    const collection = await dao.findCollectionByNameOrId('users');

    collection.schema.removeField('password_reset_otp');
    collection.schema.removeField('password_reset_otp_expires_at');

    return await dao.saveCollection(collection);
});