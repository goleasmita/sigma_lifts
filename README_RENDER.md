Fixed project prepared for Render deployment.

Changes made:
- Updated package.json scripts: added 'build' and changed 'start' to build frontend then run backend.
- Removed node_modules and .git for clean archive.
- Added .env.sample with placeholder environment variables.
- Confirmed backend routes are relative paths and CORS allows localhost by default.

How to run locally:
1. Copy .env.sample -> .env and fill values (MONGO_URL, JWT_SECRET).
2. Install deps: npm install
3. For dev: npm run dev
4. To build & run production: npm run build && node index.js

Note: I didn't modify application source code other than package.json. If you still get the path-to-regexp error on Render, ensure you have no environment variables in Render named like VITE_* that are being read by the server.
