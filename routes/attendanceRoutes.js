import express from 'express';
import { recordAttendance, getAttendanceRecords } from '../controllers/attendanceController.js';

const router = express.Router();

router.route('/')
  .post(recordAttendance)
  .get(getAttendanceRecords);

export default router;