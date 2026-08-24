// Add to controllers/workerController.js
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
    res.status(201).json({ message: 'Worker created successfully!', user: newUser });
  } catch (error) {
    console.error('Create Worker Error:', error);
    res.status(500).json({ error: 'Failed to create worker.' });
  }
};