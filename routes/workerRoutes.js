import express from 'express';
import { getWorkers, updateWorker, deleteWorker } from '../controllers/workerController.js';

const router = express.Router();

router.get('/', getWorkers);
router.route('/:workerId')
  .put(updateWorker)
  .delete(deleteWorker);

export default router;