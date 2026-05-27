// api/check-user.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const teamMembers = [
      'ANTONIO, SHAWN ANDREW D.',
      'BARTOLOME, NICOLAS LEIGH C.',
      'CABONILAS, JOSH BRANDON J.',
      'DELA CRUZ, KEN DARYLL JIM'
    ];

    res.status(200).json({ teamMembers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to load team members' });
  }
}
