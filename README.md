<div align="center">
  <h1>Google Tasks Chrome Extension<br/>SolidJS + Vite + SUID + Chrome Extension</h1>
</div>

## Intro <a name="intro"></a>
Chrome extension for Google Tasks

## Features <a name="features"></a>
- View Google Tasks list
- Show tasks due today
- Alert user for due tasks
- Create task, subtask, list, etc

## Stack <a name="stack"></a>
- [SolidJS](https://www.solidjs.com/)
- [SUID](https://suid.io/)
- [Chrome Extension](https://developer.chrome.com/docs/extensions)
- [Google Tasks API](https://developers.google.com/tasks/reference/rest/v1/tasklists/list)

#### Notes
- [Google oAuth2 Example](https://medium.com/geekculture/googles-oauth2-authorization-with-chrome-extensions-2d50578fc64f)

## Usage <a name="usage"></a>
  1. Install dependency packages for frontend and backend

         pnpm i

  2. Run dev

         pnpm dev
  3. Go to extensions path - [Extensioons](chrome://extensions/)
  4. Click on Load unpacked
  5. Set it to dist folder created from running dev