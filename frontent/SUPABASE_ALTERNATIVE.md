# Makbig Academy - Supabase Version

## 🚀 Free Alternative to Firebase

This version uses **Supabase** instead of Firebase, which offers:
- ✅ **Free tier**: 50,000 MAU, 500MB database, 1GB storage
- ✅ **PostgreSQL database** with real-time subscriptions
- ✅ **Built-in authentication** with email/password
- ✅ **File storage** for images
- ✅ **Row Level Security** (RLS) for data protection
- ✅ **Real-time updates** for admin replies

## 📦 Installation

1. **Install Supabase client**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get your project URL and anon key

3. **Replace Firebase config**
   - Update `src/supabase/config.ts` with your Supabase credentials

## 🔧 Configuration

### Supabase Setup (`src/supabase/config.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your-project-url'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Database Schema (SQL)
```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('student', 'admin')) DEFAULT 'student',
  domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domains table
CREATE TABLE domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploads table
CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) NOT NULL,
  image_url TEXT NOT NULL,
  week INTEGER NOT NULL,
  domain TEXT NOT NULL,
  admin_reply TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('student-images', 'student-images', true);

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view domains" ON domains FOR SELECT USING (true);
CREATE POLICY "Admins can manage domains" ON domains FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Students can create uploads" ON uploads FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'student')
);
CREATE POLICY "Admins can manage uploads" ON uploads FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

## 🎯 Migration Benefits

- **Cost**: Completely free for small-medium applications
- **Performance**: PostgreSQL is faster than Firestore for complex queries
- **Features**: More SQL features, better data relationships
- **Real-time**: Built-in real-time subscriptions
- **Storage**: Integrated file storage with CDN

Would you like me to create the complete Supabase version of your Makbig Academy application?


