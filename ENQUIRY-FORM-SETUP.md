# Satya Journeys — enquiry form setup

This bundle adds the Plan Your Journey form front-end and the Google Apps Script backend. It is designed to use free Google Sheets + Apps Script with the existing static Eleventy site. **It is not live until you complete the Google setup and paste the deployed URL into `plan-my-trip.njk`.**

## What happens after setup

1. A visitor submits their name, email, optional phone, route, dates, traveller count, budget, transport and trip details.
2. Google Apps Script appends a row to the `Journey Requests` tab in your Google Sheet, with status `New`.
3. Apps Script emails a notification to `t7in007@gmail.com`. The email's Reply-To is set to the traveller's email so you can reply directly.

## A. Create the request register

1. Sign in to Google with the account that should own the request register and send notifications. For this configuration, use the account you can access and check regularly.
2. Open https://sheets.new and create a spreadsheet named **Satya Journeys — Journey Requests**.
3. Copy the spreadsheet ID from its URL. It is the long value between `/d/` and `/edit` in a URL like `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`.
4. Keep the sheet private. Do not publish it to the web or give visitors access.

## B. Create the Apps Script endpoint

1. Open https://script.new while signed into the same Google account.
2. Replace the starter code in `Code.gs` with the complete contents of `apps-script/Code.gs` from this bundle.
3. Replace `PASTE_GOOGLE_SHEET_ID_HERE` with the spreadsheet ID copied above. Keep the quotes around the ID.
4. Save the project with a name such as **Satya Journeys Form Handler**.
5. In the editor, select `authorizeServices` and click **Run** once. Review and approve the Google permissions. Verify that you are in your own script and review the permissions before allowing them.
6. Click **Deploy → New deployment**. Click the gear/select type and choose **Web app**.
7. Set **Execute as** to **Me** (the account owning the sheet) and **Who has access** to **Anyone** / anyone, including anonymous, if that exact option is shown. This is needed so website visitors do not need to sign in. Google may show a warning or account policy may prevent anonymous access; if anonymous access is not offered, stop and tell me what options are shown rather than changing the sheet to public.
8. Click **Deploy**, complete authorization, and copy the **Web app URL** ending in `/exec`. Do not use a `/dev` test URL.

The public web-app URL is intended to receive form submissions. Keep the spreadsheet private. Do not put any Google password, OAuth token or private API key into the website.

## C. Connect the website to Apps Script

1. In the GitHub repository for Satya Journeys, open `plan-my-trip.njk`.
2. Find this line near the bottom:

   `const ENDPOINT = 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';`

3. Replace only the placeholder text with the deployed Apps Script `/exec` URL, preserving the surrounding single quotes. Example format: `const ENDPOINT = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';`
4. Commit the change to the production branch (`main` if that is the branch Cloudflare Pages is configured to build).
5. Confirm Cloudflare Pages is connected to the Git repository, with build command `bun run build` (or `npm run build`, depending on the lockfile and project settings) and output directory `_site`. This site is a Pages static site; do not deploy it with `npx wrangler deploy` as a Worker unless you deliberately configured a Worker with static assets.

## D. Test before sharing the form

1. Open the deployed site's `/plan-my-trip/` page.
2. Submit a test request using your own name/email and an obvious destination such as `TEST — Hyderabad to Goa`.
3. Check the spreadsheet's **Journey Requests** tab for a new row with status `New`.
4. Check `t7in007@gmail.com` inbox and spam folder for **New Satya Journeys request: TEST — Hyderabad to Goa**.
5. Reply to the notification and confirm the reply is addressed to the test email (because it is set as Reply-To).
6. If either the row or email is missing, open the Apps Script project → **Executions** and inspect the latest run before publishing the form widely.
7. Delete the test row after verification.

## E. Manage requests

- The Google Sheet is your request inbox. Update the `Status` column manually, e.g. `New`, `Contacted`, `Planning`, `Quote sent`, `Confirmed`, `Closed`.
- Email is an alert; the sheet is the central register.
- The website's Decap CMS dashboard is for publishing website content, not for viewing travel requests.

## Important limitations

- This uses Google Apps Script and Google Sheets, with no separate paid form or hosting service required. Google's free service quotas apply and can change. Consumer Google accounts currently have a published MailApp quota of 100 email recipients per day; see Google's quotas documentation: https://developers.google.com/apps-script/guides/services/quotas
- The form sends a cross-origin request, so the browser cannot read Apps Script's response. The page displays a submission message after the request finishes, but during initial testing you must verify both the sheet row and email. If the backend rejects the request, the browser may not be able to show the precise error.
- A public endpoint can receive spam. This starter includes a hidden honeypot and basic validation, but it is not enterprise-grade anti-spam protection. If spam becomes a problem, add stronger rate limiting/CAPTCHA or move to a managed form provider.
- Before launch, review `privacy.njk` so it accurately explains the data collected, purpose, access, retention/deletion and use of Google services. Collect only what you need and do not make the spreadsheet public.
- Do not advertise this form as operational until the live test passes.
