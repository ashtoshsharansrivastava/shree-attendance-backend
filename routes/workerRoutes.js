import express from 'express';
import { getWorkers, createWorker, updateWorker, deleteWorker } from '../controllers/workerController.js';

const router = express.Router();

router.route('/')
  .get(getWorkers)
  .post(createWorker); // <-- Add POST handler here

router.route('/:workerId')
  .put(updateWorker)
  .delete(deleteWorker);

export default router;