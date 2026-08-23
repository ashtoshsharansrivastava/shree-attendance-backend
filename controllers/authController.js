import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { workerId, fullName, password, role } = req.body;

    if (!workerId || !password || !fullName) {
      return res.status(400).json({ error: 'Worker ID, Full Name, and Password are required.' });
    }

    const cleanWorkerId = workerId.trim().toLowerCase();
    const existingUser = await User.findOne({ workerId: cleanWorkerId });

    if (existingUser) {
      return res.status(400).json({ error: 'Worker ID is already registered.' });
    }

    const newUser = new User({
      workerId: cleanWorkerId,
      fullName: fullName.trim(),
      password,
      role: role || 'worker',
    });

    await newUser.save();

    res.status(201).json({
      message: 'Account created successfully!',
      user: { workerId: newUser.workerId, fullName: newUser.fullName, role: newUser.role },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Failed to create user in database.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { workerId, password } = req.body;

    if (!workerId || !password) {
      return res.status(400).json({ error: 'Worker ID and Password are required.' });
    }

    const cleanWorkerId = workerId.trim().toLowerCase();
    const user = await User.findOne({ workerId: cleanWorkerId });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid Worker ID or Password.' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { workerId: user.workerId, fullName: user.fullName, role: user.role, profileImage: user.profileImage },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};