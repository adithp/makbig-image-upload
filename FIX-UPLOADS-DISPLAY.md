# 🔧 Fix for Uploads Not Displaying

## The Problem
Images are in database but not showing in React frontend due to expand query failing.

## Solution: Remove Expand Parameter

The issue is in `frontent/src/pocketbase/config.ts` in the `getAllUploads()` function.

### Current Code (Causing Error):
```typescript
async getAllUploads() {
  try {
    const uploads = await pb.collection('uploads').getFullList({
      sort: '-uploaded_at',
      expand: 'student_id'  // ← This is causing the 400 error
    });
    return uploads;
  } catch (error) {
    console.error('Error fetching all uploads:', error);
    throw error;
  }
}
```

### Fixed Code:
```typescript
async getAllUploads() {
  try {
    const uploads = await pb.collection('uploads').getFullList({
      sort: '-created'  // Use 'created' instead of 'uploaded_at'
    });
    return uploads;
  } catch (error) {
    console.error('Error fetching all uploads:', error);
    throw error;
  }
}
```

## Steps to Fix:

1. **Open:** `frontent/src/pocketbase/config.ts`

2. **Find the `getAllUploads()` function** (around line 119-130)

3. **Remove the `expand: 'student_id'` line**

4. **Change `sort: '-uploaded_at'` to `sort: '-created'`**

5. **Save the file**

6. **Commit and push:**
   ```bash
   git add frontent/src/pocketbase/config.ts
   git commit -m "fix uploads display"
   git push origin main
   ```

7. **Wait for Vercel to redeploy** (2-3 minutes)

8. **Refresh your app** - images should now load!

## Why This Works

- Removes the problematic expand parameter
- Uses the correct sort field ('created' exists in your schema)
- Images will load without student names (you'll see student IDs instead)
- You can add student names back later after fixing the relation properly

## Alternative: Fetch Student Data Separately

If you need student names, fetch them separately:

```typescript
async getAllUploads() {
  try {
    const uploads = await pb.collection('uploads').getFullList({
      sort: '-created'
    });
    
    // Fetch student data for each upload
    for (const upload of uploads) {
      if (upload.student_id) {
        try {
          const student = await pb.collection('users').getOne(upload.student_id);
          upload.expand = { student_id: student };
        } catch (e) {
          console.error('Error fetching student:', e);
        }
      }
    }
    
    return uploads;
  } catch (error) {
    console.error('Error fetching all uploads:', error);
    throw error;
  }
}
```

## Quick Test

After making the change, test by:
1. Going to admin dashboard
2. Clicking "Student Uploads" tab
3. Images should now display!

---

**Make this change and your images will load!** 🚀
