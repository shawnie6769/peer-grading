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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Submissions!A:A',
    });

    const submittedMembers = response.data.values?.slice(1)?.map(row => row[0]) || [];

    res.status(200).json({ teamMembers: TEAM_MEMBERS, submittedMembers });
  } catch (error) {
    console.error('Error:', error);
    res.status(200).json({ teamMembers: TEAM_MEMBERS, submittedMembers: [] });
  }
}