import { google } from 'googleapis';

const TEAM_MEMBERS = [
  'ANTONIO, SHAWN ANDREW D.',
  'BARTOLOME, NICOLAS LEIGH C.',
  'CABONILAS, JOSH BRANDON J.',
  'DELA CRUZ, KEN DARYLL JIM'
];

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { evaluator, scores, members } = req.body;

    if (!evaluator || !scores || !Array.isArray(scores)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    if (!members.includes(evaluator)) {
      return res.status(400).json({ error: 'Invalid evaluator name' });
    }

    if (scores.length !== members.length) {
      return res.status(400).json({ error: 'Score count mismatch' });
    }

    if (new Set(scores).size !== scores.length) {
      return res.status(400).json({ error: 'Duplicate scores not allowed' });
    }

    const checkResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Submissions!A:A',
    });

    const existingSubmissions = checkResponse.data.values?.map(row => row[0]) || [];
    if (existingSubmissions.includes(evaluator)) {
      return res.status(400).json({ error: 'You have already submitted' });
    }

    const values = [[evaluator, new Date().toISOString(), ...scores]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Submissions!A1',
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    await updateAverages();

    res.status(200).json({ success: true, message: 'Grades submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit grades' });
  }
}

async function updateAverages() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Submissions!A2:Z100',
  });

  const rows = response.data.values || [];
  const memberAverages = {};

  TEAM_MEMBERS.forEach((member) => {
    memberAverages[member] = [];
  });

  rows.forEach(row => {
    if (row.length > 2) {
      for (let i = 0; i < TEAM_MEMBERS.length; i++) {
        const score = parseInt(row[2 + i]);
        if (!isNaN(score)) {
          memberAverages[TEAM_MEMBERS[i]].push(score);
        }
      }
    }
  });

  const summaryRows = [['Member Name', 'Average Grade']];
  
  TEAM_MEMBERS.forEach((member) => {
    const scores = memberAverages[member];
    const avg = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    summaryRows.push([member, avg]);
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Summary!A1',
    valueInputOption: 'USER_ENTERED',
    resource: { values: summaryRows },
  });
}