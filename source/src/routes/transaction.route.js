import express from 'express';
import {
  createTransactionApi,
  getTransactionCurrentView,
  getTransactionDetail
} from "#root/controllers/transaction.controller.js";

const router = express.Router();

router.get('/current', getTransactionCurrentView);
router.post('/', createTransactionApi);

router.get('/:id', getTransactionDetail);

export { router }