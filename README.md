# Makbig Academy - Full Stack Web Application

A comprehensive academy management system built with React, Firebase, and TailwindCSS. The application provides separate dashboards for students and administrators with image upload functionality, domain management, and admin feedback system.

## 🚀 Features

### Authentication
- Firebase Authentication for secure login/registration
- Role-based access (Student/Admin)
- Student registration with domain selection
- Admin login with predefined credentials

### Student Dashboard
- Upload up to 2 images per week
- View upload history with admin replies
- Weekly progress tracking
- Domain-specific content organization

### Admin Dashboard
- Manage students and domains
- View all student uploads with filtering
- Reply to student submissions
- Add/remove domains
- Export and analytics capabilities

### Database Structure (Firestore)
- **users**: User profiles with roles and domains
- **domains**: Available course domains
- **uploads**: Student image submissions with admin replies

### Storage (Firebase Storage)
- Organized image storage by student and week
- Automatic URL generation and Firestore integration

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd makbig-academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore Database, and Storage
   - Get your Firebase configuration
   - Update `src/firebase/config.ts` with your Firebase config

4. **Initialize Database**
   ```bash
   # Run the app and initialize domains
   npm start
   ```

5. **Create Admin User**
   - Go to Firebase Console > Authentication
   - Add a user manually with admin credentials
   - Use the `createAdminUser` function in `src/utils/databaseInit.ts`

## 🔧 Configuration

### Firebase Configuration
Update `src/firebase/config.ts`:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read domains
    match /domains/{domainId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Uploads: students can create, admins can read/write
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

## 🏃‍♂️ Running the Application

```bash
# Development
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthPage.tsx
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/
│   │   ├── AdminDashboard.tsx
│   │   └── StudentDashboard.tsx
│   └── routing/
│       ├── AppRouter.tsx
│       └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── firebase/
│   └── config.ts
├── types/
│   └── index.ts
├── utils/
│   ├── databaseInit.ts
│   └── storage.ts
├── App.tsx
└── index.tsx
```

## 🔐 User Roles

### Student
- Register with name, email, password, and domain
- Upload up to 2 images per week
- View upload history and admin replies
- Access student-specific dashboard

### Admin
- Login with predefined credentials
- Manage students and domains
- View all student uploads
- Reply to student submissions
- Add/remove domains
- Access admin dashboard

## 📊 Database Collections

### Users Collection
```typescript
{
  userId: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  domain?: string; // Only for students
  createdAt: Date;
}
```

### Domains Collection
```typescript
{
  domainId: string;
  name: string;
  createdAt: Date;
}
```

### Uploads Collection
```typescript
{
  uploadId: string;
  studentId: string;
  imageUrl: string;
  week: number;
  domain: string;
  adminReply?: string;
  uploadedAt: Date;
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Modern Interface**: Clean, professional design
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: Comprehensive error messages and validation
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Vercel/Netlify
- Connect your GitHub repository
- Set build command: `npm run build`
- Set output directory: `build`
- Deploy!

## 🔧 Customization

### Adding New Domains
- Use the admin dashboard to add domains
- Or manually add to Firestore `domains` collection

### Modifying Upload Limits
- Update the weekly limit in `StudentDashboard.tsx`
- Consider implementing Firebase Functions for server-side validation

### Styling
- Modify TailwindCSS classes throughout components
- Update `tailwind.config.js` for custom themes
- Add custom CSS in `src/index.css`

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   - Ensure Firebase config is correctly set
   - Check Firebase project settings

2. **Authentication Issues**
   - Verify Firebase Auth is enabled
   - Check Firestore security rules

3. **Storage Upload Failures**
   - Verify Storage security rules
   - Check file size limits

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ for Makbig Academy**