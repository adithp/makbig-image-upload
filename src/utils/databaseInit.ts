import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Initialize Firebase database with sample data
export const initializeDatabase = async () => {
  try {
    // Add sample domains
    const domains = [
      'Python Programming',
      'Full Stack Development',
      'Data Analytics',
      'Machine Learning',
      'Web Design',
      'Mobile Development'
    ];

    for (const domainName of domains) {
      await addDoc(collection(db, 'domains'), {
        name: domainName,
        createdAt: Timestamp.now()
      });
    }

    console.log('Database initialized with sample domains');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Create admin user (call this after creating admin user in Firebase Auth)
export const createAdminUser = async (userId: string, email: string, name: string) => {
  try {
    await addDoc(collection(db, 'users'), {
      userId,
      name,
      email,
      role: 'admin',
      createdAt: Timestamp.now()
    });
    console.log('Admin user created in Firestore');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
