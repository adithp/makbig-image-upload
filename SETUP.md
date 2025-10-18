# Quick Setup Guide for Makbig Academy

## 🚀 Getting Started

### 1. Firebase Setup (Required)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Services**
   - **Authentication**: Go to Authentication > Sign-in method > Enable Email/Password
   - **Firestore**: Go to Firestore Database > Create database > Start in test mode
   - **Storage**: Go to Storage > Get started > Start in test mode

3. **Get Configuration**
   - Go to Project Settings > General > Your apps
   - Click "Add app" > Web app
   - Copy the config object
   - Update `src/firebase/config.ts` with your config

### 2. Initialize Database

Run this in your browser console after starting the app:

```javascript
// Initialize domains
import { initializeDatabase } from './src/utils/databaseInit';
await initializeDatabase();
```

### 3. Create Admin User

1. Go to Firebase Console > Authentication
2. Click "Add user" manually
3. Create user with email/password
4. Run this in browser console:

```javascript
import { createAdminUser } from './src/utils/databaseInit';
await createAdminUser('your-user-id', 'admin@example.com', 'Admin User');
```

### 4. Start Development

```bash
npm start
```

## 🔧 Configuration Files

### Firebase Config (`src/firebase/config.ts`)
```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /domains/{domainId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /uploads/{uploadId} {
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /students/{studentId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == studentId;
      allow read: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🎯 Testing the App

1. **Student Registration**
   - Go to `/auth`
   - Click "Register"
   - Create a student account
   - Select a domain

2. **Admin Login**
   - Use the admin credentials you created
   - Access admin dashboard
   - Add domains, view uploads

3. **Student Upload**
   - Login as student
   - Upload images (max 2 per week)
   - View admin replies

## 🚨 Troubleshooting

### Common Issues

1. **"Firebase config not found"**
   - Update `src/firebase/config.ts` with your Firebase config

2. **"Permission denied"**
   - Check Firestore security rules
   - Ensure user roles are set correctly

3. **"Upload failed"**
   - Check Storage security rules
   - Verify file size limits

4. **"Module not found"**
   - Run `npm install` to install dependencies
   - Check import paths

### Getting Help

- Check the main README.md for detailed documentation
- Review Firebase console for error logs
- Ensure all services are enabled in Firebase

## 🎉 You're Ready!

Your Makbig Academy is now set up and ready to use!
