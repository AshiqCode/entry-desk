# ClassTrack - Classroom Management System

A modern, production-ready React application for managing classroom entries with real-time updates using Firebase Firestore.

## Features

- 📚 **Public Home Page**: View all classroom entries in a responsive grid
- 🔍 **Search & Filter**: Search by class name or date, sort by newest/oldest/alphabetical
- 🔐 **Admin Authentication**: Secure admin access with Firebase Authentication
- ✏️ **CRUD Operations**: Add, edit, and delete classroom entries
- ⚡ **Real-time Updates**: Automatic updates across all users using Firestore
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Beautiful UI**: Modern, accessible interface with smooth animations

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Firebase 9+** (Firestore + Authentication)
- **React Router** for navigation
- **Shadcn/ui** components
- **Sonner** for toast notifications

## Prerequisites

- Node.js 18+ (recommended: use nvm)
- A Firebase project with Firestore and Authentication enabled
- npm or yarn package manager

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Firestore Database**:
   - Go to Firestore Database → Create Database
   - Start in **test mode** for now (we'll add security rules later)
4. Enable **Authentication**:
   - Go to Authentication → Get Started
   - Enable **Email/Password** sign-in method

### 3. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" → Click the web icon (`</>`)
3. Register your app and copy the Firebase config object
4. You'll need these values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 4. Configure Firebase in the App

**Option A: Direct configuration (for testing)**

Edit `src/lib/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Option B: Environment variables (recommended for production)**

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Set Up Firestore Security Rules

In Firebase Console → Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /classes/{docId} {
      // Anyone can read
      allow read: if true;
      
      // Only authenticated users can write
      allow write: if request.auth != null;
    }
  }
}
```

**Optional: Restrict to specific admin user**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /classes/{docId} {
      allow read: if true;
      // Replace with your admin user's UID
      allow write: if request.auth != null && request.auth.uid == "YOUR_ADMIN_UID";
    }
  }
}
```

### 6. Create an Admin User

**Option A: Firebase Console**
1. Go to Authentication → Users → Add User
2. Enter email and password
3. Note the User UID if you want to use UID-based security rules

**Option B: Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
firebase projects:list
firebase auth:export users.json --project YOUR_PROJECT_ID
```

### 7. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:8080`

## Data Structure

### Firestore Collection: `classes`

```typescript
{
  id: string (auto-generated),
  date: string (ISO 8601, e.g., "2025-10-01"),
  name: string (max 200 characters),
  keyPoints: string[] (array of strings, max 200 chars each),
  createdAt: Timestamp (Firestore server timestamp),
  updatedAt: Timestamp (Firestore server timestamp)
}
```

### Example Document

```json
{
  "date": "2025-10-01",
  "name": "Calculus — Limits",
  "keyPoints": [
    "Definition of limit",
    "One-sided limits",
    "Limit laws",
    "Continuity"
  ],
  "createdAt": "2025-10-01T10:30:00Z",
  "updatedAt": "2025-10-01T10:30:00Z"
}
```

## Seeding Sample Data

To add sample classroom entries for testing:

1. Log in to the admin panel (`/login`)
2. Use the "Add New Class" button to create entries
3. Or use the Firebase Console → Firestore Database → Add Document manually

Sample entries:
```
- Date: 2025-10-01, Name: "Calculus — Limits", KeyPoints: ["Definition of limit", "One-sided limits", "Limit laws"]
- Date: 2025-10-02, Name: "Physics — Newton's Laws", KeyPoints: ["First law: Inertia", "Second law: F=ma", "Third law: Action-reaction"]
- Date: 2025-10-03, Name: "Chemistry — Atomic Structure", KeyPoints: ["Protons, neutrons, electrons", "Atomic number", "Isotopes"]
```

## User Flows

### 1. Public Home Page
- Navigate to `/`
- View all classroom entries in a responsive grid
- Use search bar to filter by name or date
- Use sort dropdown to order entries
- Real-time updates as new classes are added

### 2. Admin Login
- Navigate to `/login`
- Enter admin email and password
- Redirected to `/admin` on success
- Error handling for invalid credentials

### 3. Admin Dashboard
- Add new class entries with form validation
- Edit existing entries (prefilled form)
- Delete entries with confirmation dialog
- View timestamps for created/updated dates
- Real-time synchronization

## Form Validation

- **Date**: Required, must be valid date
- **Class Name**: Required, max 200 characters
- **Key Points**: At least one required, max 200 characters each
- Client-side validation with helpful error messages
- Server-side validation via Firestore rules

## Security Notes

⚠️ **IMPORTANT**: The provided Firebase database URL in your config uses Realtime Database, but this app uses Firestore. Make sure to:

1. Enable **Firestore** (not Realtime Database) in Firebase Console
2. Update security rules as shown above
3. Never commit Firebase config with real credentials to public repos
4. Use environment variables for production deployments

## Deployment

### Deploy to Vercel/Netlify
```bash
npm run build
# Upload the 'dist' folder or connect your Git repo
```

### Environment Variables
Set these in your deployment platform:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check your API key is correct in `firebase.ts`
- Ensure Firebase project is properly configured

### "Missing or insufficient permissions"
- Check Firestore security rules are published
- Verify user is authenticated for write operations

### Classes not updating in real-time
- Ensure Firestore rules allow read access
- Check browser console for errors
- Verify internet connection

### Admin can't login
- Verify user exists in Firebase Authentication
- Check email and password are correct
- Look for error messages in toast notifications

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── ClassCard.tsx    # Class entry card display
│   ├── ClassForm.tsx    # Add/Edit form
│   ├── Navigation.tsx   # App navigation
│   └── SearchFilters.tsx # Search and sort controls
├── contexts/
│   └── AuthContext.tsx  # Authentication state management
├── lib/
│   ├── firebase.ts      # Firebase config and helpers
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Home.tsx         # Public home page
│   ├── Login.tsx        # Admin login page
│   ├── Admin.tsx        # Admin dashboard
│   └── NotFound.tsx     # 404 page
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions:
1. Check this README thoroughly
2. Review Firebase Console for configuration issues
3. Check browser console for error messages
4. Verify Firestore rules are correctly set
