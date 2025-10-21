Reflective Alignment API v2 (JS-only)
====================================

This package is ready for GitHub + Vercel. No TypeScript, no build step.

Files
-----
api/reflect.js     -> serverless API endpoint (POST only)
package.json       -> minimal metadata (optional, safe to keep)
README.txt         -> this guide

Deploy steps (GitHub + Vercel)
------------------------------
1) Create a new GitHub repo (e.g., reflectivealignment-api-v2)
2) Upload these three files keeping the same folder structure:
   /api/reflect.js
   /package.json
   /README.txt
3) On Vercel: Add New -> Project -> Import from GitHub -> select the repo -> Deploy
4) In Vercel Project Settings -> Environment Variables, add:
   Name: OPENAI_API_KEY
   Value: your secret key from https://platform.openai.com/account/api-keys
   Environment: Production + Preview
   Save, then Redeploy.

Test
----
Send a POST to:
  https://<your-project>.vercel.app/api/reflect
Body:
  { "prompt": "What is inner reflection?" }

Expected JSON result:
  {
    "reflection": "...",
    "response": "..."
  }

Wire up from your site
----------------------
Use fetch from your GoDaddy page:
  fetch("https://<your-project>.vercel.app/api/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Hello" })
  }).then(r => r.json()).then(console.log)

Security (later)
----------------
- Replace CORS '*' in reflect.js with your domain:
    res.setHeader("Access-Control-Allow-Origin", "https://reflectivealignment.ai");
- Store OPENAI_API_KEY only in Vercel Environment Variables.
