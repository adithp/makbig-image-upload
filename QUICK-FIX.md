# 🔧 Quick Fix for Image Loading Issue

## The Problem
Error: `400 Bad Request` when fetching uploads with `expand=student_id`

## The Solution

The `student_id` field in your uploads collection needs to be properly configured as a relation field.

### Fix in PocketBase Admin:

1. **Go to PocketBase Admin:**
   ```
   https://makbig-image-upload.onrender.com/_/
   ```

2. **Click on "uploads" collection**

3. **Check the "student_id" field:**
   - Click on the field to edit it
   - Make sure it's set as **"Relation"** type
   - **Relation collection:** should be `users`
   - **Display fields:** `name, email`
   - Save

4. **If student_id field doesn't exist or is wrong type:**
   - Delete the field
   - Create new field:
     - **Name:** `student_id`
     - **Type:** Relation
     - **Collection:** users
     - **Max select:** 1
     - **Display fields:** name, email
   - Save

### Alternative: Remove Expand from Code

If you don't need to expand student data, we can remove the expand parameter.

The uploads will still load, but without student names (you'll just see IDs).

---

## Quick Test

After fixing the relation field, refresh your React app and check if images load!
