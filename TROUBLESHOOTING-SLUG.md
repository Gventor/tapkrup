# 🔧 Troubleshooting Slug Issues

## Issue: http://localhost:3000/ladynayavillas not working

### Quick Fix Steps:

#### Step 1: Check if Profile Exists
1. Go to http://localhost:3000/dashboard
2. Are you logged in? If not, log in first
3. Do you see your business information?

#### Step 2: Enter Business Name
1. In the "Business Name" field, type: **Lady Naya Villas**
2. The slug field should show: **ladynayavillas** (auto-generated)
3. Click **"Save Changes"**
4. Wait for "Saved successfully!" message

#### Step 3: Test Your Page
1. Click the **"Preview"** button
2. Or manually go to: http://localhost:3000/ladynayavillas
3. Your page should now load!

## Common Issues & Solutions

### Issue 1: "Page Not Found" (404)
**Cause**: Slug not saved in database

**Solution**:
1. Go to dashboard
2. Enter business name
3. Click "Save Changes"
4. Try the URL again

### Issue 2: Slug Field is Empty
**Cause**: Business name not entered yet

**Solution**:
1. Type your business name in the "Business Name" field
2. Slug auto-generates as you type
3. Click "Save Changes"

### Issue 3: Old Data Without Slug
**Cause**: Profile created before slug feature was added

**Solution A - Via Dashboard** (Easiest):
1. Go to dashboard
2. Re-enter your business name
3. Click "Save Changes"
4. Slug will be generated and saved

**Solution B - Via SQL**:
1. Open Supabase SQL Editor
2. Run this query to see your data:
```sql
SELECT id, business_name, slug FROM profiles;
```
3. If slug is NULL, run:
```sql
UPDATE profiles 
SET slug = 'ladynayavillas'
WHERE business_name = 'Lady Naya Villas';
```
4. Refresh dashboard

### Issue 4: Wrong Slug Generated
**Example**: "Lady Naya Villa" generates "ladynayavilla" but you want "lady-naya-villa"

**Solution**:
The slug is now read-only and auto-generated. If you need a custom slug, you can update it via SQL:
```sql
UPDATE profiles 
SET slug = 'lady-naya-villa'
WHERE business_name = 'Lady Naya Villa';
```

## How Auto-Slug Works Now

### Old Way (Manual):
```
1. Enter business name
2. Manually type slug
3. Save
```

### New Way (Automatic):
```
1. Enter business name: "Lady Naya Villas"
2. Slug auto-generates: "ladynayavillas"
3. Save (slug is saved automatically)
4. Done!
```

## Testing Checklist

- [ ] Go to http://localhost:3000/dashboard
- [ ] Log in (if not already)
- [ ] Enter business name: "Lady Naya Villas"
- [ ] See slug auto-generate: "ladynayavillas"
- [ ] Click "Save Changes"
- [ ] See "Saved successfully!" message
- [ ] Click "Preview" button
- [ ] Page loads at /ladynayavillas
- [ ] See your business info displayed

## Slug Generation Rules

```
Input:              Output:
"Lady Naya Villas"  → "ladynayavillas"
"Bangkok Coffee"    → "bangkokcoffee"
"Joe's Pizza #1"    → "joespizza1"
"24/7 Shop"         → "247shop"
```

**Rules**:
- All lowercase
- No spaces
- No special characters
- Numbers allowed
- Dashes allowed (if in original name)

## Quick Test

### Test 1: New Profile
```bash
1. Go to: http://localhost:3000/dashboard
2. Enter: "Test Business"
3. Save
4. Visit: http://localhost:3000/testbusiness
5. Should work! ✅
```

### Test 2: Lady Naya Villas
```bash
1. Go to: http://localhost:3000/dashboard
2. Enter: "Lady Naya Villas"
3. Save
4. Visit: http://localhost:3000/ladynayavillas
5. Should work! ✅
```

## Still Not Working?

### Check Database:
```sql
-- See all profiles and their slugs
SELECT 
  business_name,
  slug,
  created_at
FROM profiles
ORDER BY created_at DESC;
```

### Check if slug exists:
```sql
-- Check for specific slug
SELECT * FROM profiles WHERE slug = 'ladynayavillas';
```

### Manually fix:
```sql
-- Update slug for your profile
UPDATE profiles 
SET slug = 'ladynayavillas'
WHERE business_name LIKE '%Lady Naya%';
```

## Need More Help?

1. **Check browser console** (F12) for errors
2. **Check server logs** in terminal
3. **Verify you're logged in**
4. **Try a different business name** to test
5. **Clear browser cache** and try again

## Summary

The slug feature now:
- ✅ Auto-generates from business name
- ✅ Saves automatically when you save
- ✅ Read-only (can't manually edit in UI)
- ✅ Clean URLs (no spaces or special chars)
- ✅ Works immediately after saving

Just enter your business name and save - that's it! 🚀
