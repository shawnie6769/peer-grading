// api/check-submission.js
import { google } from 'googleapis';

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
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if already submitted
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Submissions!A:A',
    });

    const existingSubmissions = response.data.values?.slice(1)?.map(row => row[0]) || [];
    const alreadySubmitted = existingSubmissions.includes(name);

    res.status(200).json({ alreadySubmitted });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to check submission' });
  }
}
