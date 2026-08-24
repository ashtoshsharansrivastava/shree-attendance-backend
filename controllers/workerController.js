import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// Fetch all worker accounts
export const getWorkers = async (req, res) => {
  try {
    const workers = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ total: workers.length, workers });
  } catch (error) {
    console.error('Fetch Workers Error:', error);
    res.status(500).json({ error: 'Failed to fetch workers.' });
  }
};

// Create a new worker account
export const createWorker = async (req, res) => {
  try {
    const { workerId, fullName, password, role, profileImage } = req.body;

    if (!workerId || !fullName || !password) {
      return res.status(400).json({ error: 'Worker ID, Full Name, and Password are required.' });
    }

    const cleanWorkerId = workerId.trim().toLowerCase();
    const existingUser = await User.findOne({ workerId: cleanWorkerId });

    if (existingUser) {
      return res.status(400).json({ error: 'Worker ID is already registered.' });
    }

    let uploadedImageUrl = '';
    if (profileImage && profileImage.startsWith('data:image')) {
      const uploadResult = await cloudinary.uploader.upload(profileImage, {
        folder: 'shree_workers',
        public_id: `${cleanWorkerId}_profile_${Date.now()}`,
        resource_type: 'image',
      });
      uploadedImageUrl = uploadResult.secure_url;
    }

    const newUser = new User({
      workerId: cleanWorkerId,
      fullName: fullName.trim(),
      password,
      role: role || 'worker',
      profileImage: uploadedImageUrl,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Worker created successfully!',
      user: {
        workerId: newUser.workerId,
        fullName: newUser.fullName,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.error('Create Worker Error:', error);
    res.status(500).json({ error: 'Failed to create worker.' });
  }
};

// Update worker details or photo
export const updateWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { fullName, role, profileImage, removePhoto } = req.body;
    const cleanWorkerId = workerId.trim().toLowerCase();

    const user = await User.findOne({ workerId: cleanWorkerId });
    if (!user) {
      return res.status(404).json({ error: 'Worker not found.' });
    }

    if (fullName) user.fullName = fullName.trim();
    if (role) user.role = role;

    if (removePhoto) {
      user.profileImage = '';
    } else if (profileImage && profileImage.startsWith('data:image')) {
      const uploadResult = await cloudinary.uploader.upload(profileImage, {
        folder: 'shree_workers',
        public_id: `${cleanWorkerId}_profile_${Date.now()}`,
        resource_type: 'image',
      });
      user.profileImage = uploadResult.secure_url;
    } else if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.status(200).json({
      message: 'Worker details updated successfully!',
      user: {
        workerId: user.workerId,
        fullName: user.fullName,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Update Worker Error:', error);
    res.status(500).json({ error: 'Failed to update worker details.' });
  }
};

// Delete worker account
export const deleteWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const cleanWorkerId = workerId.trim().toLowerCase();

    const deletedUser = await User.findOneAndDelete({ workerId: cleanWorkerId });
    if (!deletedUser) {
      return res.status(404).json({ error: 'Worker not found.' });
    }

    res.status(200).json({ message: 'Worker account deleted successfully.' });
  } catch (error) {
    console.error('Delete Worker Error:', error);
    res.status(500).json({ error: 'Failed to delete worker account.' });
  }
};