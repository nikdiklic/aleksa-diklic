# Aleksa Diklic Portfolio

This is a static HTML site hosted with Firebase Hosting. The site files are in `public/`; shared navigation is maintained in `templates/navigation.html` and synchronized into each page by the build script.

## Prerequisites

- Node.js
- Firebase CLI, logged in to the Firebase project

## Build

After changing the shared navigation, run this from the repository root:

```sh
npm run build
```

The build has no npm dependencies and keeps the navigation rendered in each HTML page for static hosting.

## Preview Locally

```sh
firebase emulators:start --only hosting
```

Open <http://localhost:5002>.

## Deploy

```sh
npm run build
firebase deploy --only hosting
```
