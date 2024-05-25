import express from 'express';

import { router as accountRouter } from './account.route.js';
import { router as customerRouter } from './customer.route.js';
import { router as productRouter } from './product.route.js';
import { router as reportRouter } from './report.route.js';
import { router as transactionRouter } from './transaction.route.js';
import { router as userRouter } from './user.route.js';
import { router as testRouter } from './test.route.js';

const router = express.Router();

router.use('/account', accountRouter);
router.use('/customer', customerRouter);
router.use('/product', productRouter);
router.use('/report', reportRouter);
router.use('/transaction', transactionRouter);
router.use('/user', userRouter);
router.use('/test', testRouter);

export { router };