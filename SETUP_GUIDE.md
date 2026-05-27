# Peer Grading System - Complete Setup Guide

## Overview
This is a full-stack peer grading application with:
- Frontend: Login + Grading UI (single HTML file)
- Backend: Vercel serverless functions
- Database: Google Sheets (stores all submissions and calculates averages)

---

## STEP 1: Set Up Google Sheets

### 1.1 Create a new Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: "Capstone 1 Peer Grading"
4. Note the Sheet ID (in the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`)

### 1.2 Set up the sheets structure
Create 3 sheets with these headers:

**Sheet 1: "Submissions"**
- Column A: Evaluator Name
- Column B: Timestamp
- Column C: Score for ANTONIO, SHAWN ANDREW D.
- Column D: Score for BARTOLOME, NICOLAS LEIGH C.
- Column E: Score for CABONILAS, JOSH BRANDON J.
- Column F: Score for DELA CRUZ, KEN DARYLL JIM

**Sheet 2: "Summary"**
- Column A: Evaluator Name
- Column B-E: Final Average Scores for each member

---

## STEP 2: Set Up Google Cloud Project

### 2.1 Create a Google Cloud project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown at the top
3. Click "New Project"
4. Name: "Capstone Peer Grading"
5. Click Create

### 2.2 Enable the Sheets API
1. In the search bar, type "Sheets API"
2. Click on it and click "Enable"

### 2.3 Create a Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click "Create Service Account"
3. Name: "peer-grading-service"
4. Click "Create and Continue"
5. Skip the optional steps, click "Done"

### 2.4 Create and download credentials
1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Click "Create" - a JSON file will download
6. **Keep this file safe** - you'll need it for Vercel

### 2.5 Share your Google Sheet with the service account
1. Open the JSON file you downloaded
2. Copy the `client_email` value (looks like `service-account@...iam.gserviceaccount.com`)
3. Go back to your Google Sheet
4. Click "Share" (top right)
5. Paste the email and give it "Editor" access
6. Click Share

---

## STEP 3: Deploy to Vercel

### 3.1 Prepare your project
1. Create a new folder on your computer: `peer-grading`
2. Inside, create a folder: `api`
3. Copy the three API files into the `api` folder:
   - `api/check-user.js`
   - `api/check-submission.js`
   - `api/submit-grades.js`
4. Copy `index.html` to the root folder

Your folder structure should look like:
```
peer-grading/
├── index.html
├── api/
│   ├── check-user.js
│   ├── check-submission.js
│   └── submit-grades.js
└── vercel.json
```

### 3.2 Create vercel.json
In the root folder, create a file called `vercel.json`:

```json
{
  "buildCommand": "npm install",
  "outputDirectory": "."
}
```

### 3.3 Create package.json
In the root folder, create `package.json`:

```json
{
  "name": "peer-grading",
  "version": "1.0.0",
  "description": "Capstone peer grading system",
  "dependencies": {
    "googleapis": "^118.0.0"
  }
}
```

### 3.4 Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub (or email)
3. Click "New Project"
4. Click "Import Git Repository" or upload your folder
5. Select the `peer-grading` folder
6. Click "Deploy"

### 3.5 Add Environment Variables to Vercel
1. After deployment, go to your project settings
2. Go to **Settings** → **Environment Variables**
3. Add these two variables:

**SHEET_ID**
- Value: Your Google Sheet ID from Step 1.1

**GOOGLE_CREDENTIALS**
- Value: Paste the entire contents of the JSON file you downloaded in Step 2.4

4. Click Save/Deploy

---

## STEP 4: Update the Frontend

### 4.1 Get your Vercel URL
1. After deployment is complete, Vercel shows your URL (like `https://peer-grading-xyz.vercel.app`)
2. Copy this URL

### 4.2 Update index.html
Open `index.html` and find this line (around line 285):
```javascript
const API_URL = 'https://your-vercel-url.vercel.app/api';
```

Replace `your-vercel-url.vercel.app` with your actual Vercel URL from Step 4.1

### 4.3 Re-deploy
1. Commit and push your changes to GitHub (if using GitHub), or
2. Upload the updated files to Vercel

---

## STEP 5: Test the System

1. Open your Vercel URL in a browser
2. Test login with one of the team member names
3. Enter scores (remember: no duplicates, 1-10 only)
4. Submit and verify it appears in your Google Sheet
5. Try logging in again with the same name - you should see "already submitted" error

---

## TROUBLESHOOTING

### "Failed to load team members"
- Check that your Vercel environment variables are set correctly
- Check that the SHEET_ID is correct

### "Connection error" during submission
- Check that GOOGLE_CREDENTIALS JSON is properly pasted in Vercel
- Check that the Google Sheet is shared with the service account email
- Check Vercel logs: Settings → Deployments → Select latest → View Logs

### Scores not appearing in Google Sheet
- Check that the Sheet tabs are named exactly: "Submissions" and "Summary"
- Check that the headers are in the correct columns

---

## VIEWING RESULTS

Your Google Sheet will automatically populate with:
- **Submissions tab**: Each evaluator's scores as they submit
- **Summary tab**: Automatic average calculation (rounded to nearest whole number)

You can view and download results anytime from your Google Sheet!

---

## SECURITY NOTES

✅ Each person can only submit once
✅ Names must match the team member list
✅ No duplicate scores allowed per evaluator
✅ All data stored securely in Google Sheets
✅ API keys never exposed in frontend code

---

## NEXT STEPS

1. Follow Steps 1-5 above carefully
2. Share the Vercel URL with your teammates
3. Each teammate logs in, rates everyone, submits
4. View results in your Google Sheet
5. Download/share the summary as needed

Good luck! 🎓
