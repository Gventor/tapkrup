# TapKrup Setup Instructions

## Project Overview
TapKrup is a mobile-friendly NFC business card platform built with Next.js, Supabase, and Tailwind CSS.

## What's Already Done
✅ Next.js 14 with App Router
✅ TypeScript configuration
✅ Tailwind CSS styling
✅ shadcn/ui components
✅ Supabase client setup
✅ All pages created (login, signup, dashboard, public page, NFC redirect, admin)
✅ Date formatting set to dd/mm/yyyy
✅ Environment variables configured (.env.local)
✅ Netlify deployment configuration
✅ Dependencies installed

## Next Steps

### 1. Set Up Supabase Database
1. Go to your Supabase project: https://peorumavyucumxvrzcme.supabase.co
2. Navigate to SQL Editor
3. Open the file `supabase-setup.sql` in this project
4. Copy and paste the entire SQL script into the Supabase SQL Editor
5. Click "Run" to create the tables and policies

### 2. Test Locally
```bash
npm run dev
```
Visit http://localhost:3000

### 3. Test the App
1. Sign up for a new account
2. Go to dashboard and fill in your business information
3. Create a slug (e.g., "my-shop")
4. Save your changes
5. Visit http://localhost:3000/your-slug to see your public page

### 4. Create NFC Links (Optional)
To create NFC redirect links, you need to add entries to the `nfc_links` table in Supabase:

1. Go to Supabase → Table Editor → nfc_links
2. Insert a new row:
   - code: "bike123" (or any code you want)
   - profile_id: (your user ID from the profiles table)
3. Now visiting `/b/bike123` will redirect to your business page

### 5. Deploy to Netlify
1. Push your code to GitHub (make sure .env.local is NOT pushed)
2. Go to Netlify and create a new site
3. Connect your GitHub repository
4. Add environment variables in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL` = https://peorumavyucumxvrzcme.supabase.co
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` = sb_publishable_1gDItxOiX1FuMROwkqhgLA_TvojX8gu
5. Deploy!

## Project Structure
```
tapkrup/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── dashboard/            # User dashboard
│   │   ├── admin/                # Admin panel
│   │   ├── [slug]/               # Public business page
│   │   └── b/[code]/             # NFC redirect
│   ├── components/ui/            # shadcn/ui components
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   └── utils.ts              # Utility functions (includes dd/mm/yyyy formatter)
│   └── types/
│       └── database.types.ts     # TypeScript types
├── .env.local                    # Environment variables (NOT in git)
├── netlify.toml                  # Netlify config
└── supabase-setup.sql            # Database setup script

```

## Features
- ✅ User authentication (signup/login)
- ✅ Dashboard to manage business info
- ✅ Public mobile-friendly business page
- ✅ NFC redirect functionality (/b/[code])
- ✅ Admin panel to view all businesses
- ✅ Date formatting: dd/mm/yyyy
- ✅ Mobile-first design
- ✅ Secure environment variables

## Security Notes
- `.env.local` is gitignored and will NOT be pushed to GitHub
- Supabase keys are public keys (safe for client-side use)
- Row Level Security (RLS) protects your database
- Users can only edit their own profiles

## Support
If you need to add more features or have questions, just ask!
