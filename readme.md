
steps:

- npm i
- npm run build
- cordova build
- open workspace in xcode and check provisioning profile and file->workspace setting->Build system:legacy
- deploy from xcode

- dev server: npm start (separate config in: stencil.config.dev.json)


Ionic:
- npm i "@ionic/core": "^4.0.0",
OR
- index.html:
  <link href="https://unpkg.com/@ionic/core@4.0.0/css/ionic.bundle.css" rel="stylesheet">
  <script src="https://unpkg.com/@ionic/core@4.0.0/dist/ionic.js"></script>

