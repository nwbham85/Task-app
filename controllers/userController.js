import User from '../models/Users.js';  // fix: consistent name, correct filename

export function getUserByUsername() {
  return async function (req, res) {
    console.log('getUserByUsername hit, query:', req.query); 
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    try {
      console.log('about to query DB...'); 
      const user = await User.findOne({ username });  // fix: was "User" but imported as "Users"
      console.log('DB query result:', user);
      if (!user) {
        return res.json({ exists: false });
      }

      return res.json({ exists: true, user });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
}