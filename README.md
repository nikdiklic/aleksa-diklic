# Aleksa Diklic Portfolio

This is a static HTML site hosted with Firebase Hosting. The site files are in `public/`; shared navigation is maintained in `templates/navigation.html` and synchronized into each page by the build script.

## Prerequisites

- Node.js
- Firebase CLI, logged in to the Firebase project

## Build

Run this from the repository root to synchronize the shared navigation and check the pages:

```sh
npm run build
```

The build has no npm dependencies and keeps the navigation rendered in each HTML page for static hosting. It checks navigation markers, Firebase initialization, duplicate IDs, and local image links.

## Preview Locally

```sh
npm start
```

Open <http://localhost:5002>.

## Deploy

```sh
npm run deploy
```
