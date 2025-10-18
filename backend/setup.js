// Firebase Database Setup Script
// Run this script to initialize your Firebase database with sample data

import { initializeDatabase, createAdminUser } from './src/utils/databaseInit';

console.log('🚀 Initializing Makbig Academy Database...');

// Initialize domains
await initializeDatabase();

console.log('✅ Database initialization complete!');
console.log('');
console.log('📋 Next Steps:');
console.log('1. Go to Firebase Console > Authentication');
console.log('2. Create an admin user manually');
console.log('3. Run createAdminUser(userId, email, name) with the admin credentials');
console.log('4. Start the application with: npm start');
console.log('');
console.log('🎉 Your Makbig Academy is ready to use!');


