# NoteCraft (Notes app)

NoteCraft is a lightweight note-taking web app built with React and Firebase. It lets users sign in with Google, create notes with multiple sections, add text/code/bullet content blocks, style titles and sections, and persist notes to Cloud Firestore.

## Features

- Google sign-in using Firebase Authentication
- Create, update and delete notes
- Notes have multiple sections; each section can include text, code, or bullet blocks
- Code blocks support language selection and copy/delete actions
- Per-note background (solid color or gradient) and title/section styling
- Real-time sync with Firestore for the signed-in user

## Tech Stack

- React (Create React App)
- Firebase Authentication
- Cloud Firestore
- Vanilla CSS for styling 

## Quick Start

Prerequisites:
- Node.js (>= 14) and npm

Install and run locally:

```powershell
cd notes-app
npm install
npm start
```

Open `http://localhost:3000` (or the port shown) in your browser.

## Firebase Configuration

This app expects environment variables to be set in a `.env` file placed in the `notes-app/` directory. Create a `.env` with the following keys (replace values with your Firebase project's values):

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Important:
- After creating/updating `.env`, restart the dev server (`npm start`) so CRA picks up the changes.
- In Firebase Console enable **Authentication -> Sign-in method -> Google** and **Firestore** (in test or appropriate rules for development).

## File Overview

- `src/firebase.js` — initializes Firebase using `process.env.REACT_APP_*` variables
- `src/App.js` — app root: auth state, notes listing, CRUD operations, and passes handlers to `NoteWorkspace`
- `src/components/NoteWorkspace.js` — main editor: sections, content blocks, styling UI
- `src/components/Sidebar.js` — sections list and navigation
- `src/components/Login.js` — Google sign-in UI

## Deploying to GitHub Pages

This project can be published to GitHub Pages using the `gh-pages` package. The repository owner is `gourav-sharma1857` and the repo is `NotesCraft`, so the app will be available at:

```
https://gourav-sharma1857.github.io/NotesCraft
```

Steps to publish:

1. Ensure the `homepage` field in `notes-app/package.json` is set to the URL above (already configured).
2. Install the deploy tool (local dev dependency):

```powershell
cd notes-app
npm install --save-dev gh-pages
```

3. Build and deploy:

```powershell
cd notes-app
npm run deploy
```

Notes:
- The `deploy` script runs `npm run build` and then publishes the `build` folder to a `gh-pages` branch.
- If you host from a custom domain or username page, adjust the `homepage` field accordingly.






