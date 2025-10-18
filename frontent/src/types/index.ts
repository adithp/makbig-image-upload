// TypeScript interfaces for Firestore collections

export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  domain?: string;
  createdAt: Date;
}

export interface Domain {
  domainId: string;
  name: string;
  createdAt: Date;
}

export interface Upload {
  uploadId: string;
  studentId: string;
  imageUrl: string;
  week: number;
  domain: string;
  adminReply?: string;
  uploadedAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  domain: string;
}


