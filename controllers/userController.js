import User from '../models/User.js';

export function getUserByUsername() {
  return async function (req, res) {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.json({ exists: false });
      }

      return res.json({
        exists: true,
        user
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
}