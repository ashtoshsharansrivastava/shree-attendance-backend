import Attendance from '../models/Attendance.js';
import cloudinary from '../config/cloudinary.js';

export const recordAttendance = async (req, res) => {
  try {
    const { workerId, photo, location } = req.body;

    if (!workerId || !photo || !location) {
      return res.status(400).json({ error: 'Missing required attendance data.' });
    }

    const cleanWorkerId = workerId.trim().toLowerCase();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const fileTimeStr = timeStr.replace(/:/g, '-');
    const safeLocation = location.replace(/[,/]/g, ' - ');

    const watermarkText = `ID: ${cleanWorkerId.toUpperCase()} %0A Time: ${dateStr} ${timeStr} %0A Loc: ${safeLocation}`;

    const uploadResult = await cloudinary.uploader.upload(photo, {
      folder: 'shree_attendance',
      public_id: `${cleanWorkerId}_${dateStr}_${fileTimeStr}`,
      resource_type: 'image',
      tags: ['attendance', cleanWorkerId, dateStr],
      transformation: [
        { width: 800, crop: 'scale' },
        {
          overlay: {
            font_family: 'Arial',
            font_size: 24,
            font_weight: 'bold',
            text: watermarkText,
          },
          color: '#FFFFFF',
          background: '#00000099',
          gravity: 'south',
          y: 20,
        },
      ],
    });

    const newRecord = new Attendance({
      workerId: cleanWorkerId,
      photo: uploadResult.secure_url,
      location,
    });

    await newRecord.save();

    res.status(201).json({
      message: 'Attendance recorded successfully!',
      record: newRecord,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error('Attendance Upload Error:', error);
    res.status(500).json({ error: 'Failed to process and watermark attendance record.' });
  }
};

export const getAttendanceRecords = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });
    res.status(200).json({ total: records.length, records });
  } catch (error) {
    console.error('Fetch Attendance Error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records.' });
  }
};