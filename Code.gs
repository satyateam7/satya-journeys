const NOTIFICATION_EMAIL = 't7in007@gmail.com';
// Paste the ID from the Google Sheet URL between /d/ and /edit.
const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Journey Requests';

const HEADERS = [
  'Submitted At', 'Status', 'Name', 'Email', 'Phone / WhatsApp',
  'Destination / Route', 'Travel Dates', 'Travellers', 'Budget',
  'Transport', 'Trip Details', 'Page URL'
];

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // Basic spam trap. Quietly discard submissions from bots that fill hidden fields.
    if (String(p.website || '').trim()) {
      return json_({ ok: true });
    }
    if (!p.name || !p.email || !p.destination || !p.privacyConsent) {
      return json_({ ok: false, error: 'Missing required fields' });
    }
    if (SPREADSHEET_ID === 'PASTE_GOOGLE_SHEET_ID_HERE') {
      throw new Error('Set SPREADSHEET_ID in Code.gs before deploying.');
    }

    const name = clean_(p.name, 100);
    const email = clean_(p.email, 200);
    const phone = clean_(p.phone, 40);
    const destination = clean_(p.destination, 200);
    const dates = clean_(p.travelDates, 100);
    const travellers = clean_(p.travellers, 3);
    const budget = clean_(p.budget, 100);
    const transport = clean_(p.transport, 100);
    const details = clean_(p.details, 4000);
    const pageUrl = clean_(p.pageUrl, 500);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return json_({ ok: false, error: 'Invalid email address' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([
        new Date(), 'New', name, email, phone, destination, dates,
        travellers, budget, transport, details, pageUrl
      ]);
    } finally {
      lock.releaseLock();
    }

    const subject = 'New Satya Journeys request: ' + destination;
    const body = [
      'A new journey request was submitted on Satya Journeys.', '',
      'Name: ' + name,
      'Email: ' + email,
      'Phone / WhatsApp: ' + (phone || 'Not provided'),
      'Destination / route: ' + destination,
      'Travel dates: ' + (dates || 'Not provided'),
      'Travellers: ' + (travellers || 'Not provided'),
      'Budget: ' + (budget || 'Not provided'),
      'Preferred transport: ' + (transport || 'Not provided'), '',
      'Trip details:', details || 'Not provided', '',
      'Website page: ' + (pageUrl || 'Not provided'), '',
      'Open the linked Google Sheet to update the request status.'
    ].join('\n');

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: body,
      replyTo: email,
      name: 'Satya Journeys Website'
    });

    return json_({ ok: true });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: 'Submission could not be processed' });
  }
}

function authorizeServices() {
  // Run this once from the editor to trigger Google permission prompts.
  if (SPREADSHEET_ID === 'PASTE_GOOGLE_SHEET_ID_HERE') {
    throw new Error('Set SPREADSHEET_ID in Code.gs before authorizing.');
  }
  SpreadsheetApp.openById(SPREADSHEET_ID).getName();
  MailApp.getRemainingDailyQuota();
}

function doGet() {
  return ContentService.createTextOutput(
    'Satya Journeys enquiry endpoint is online. Submit requests through the website form.'
  ).setMimeType(ContentService.MimeType.TEXT);
}

function clean_(value, maxLength) {
  return String(value || '').trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, maxLength);
}

function json_(object) {
  return ContentService.createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
