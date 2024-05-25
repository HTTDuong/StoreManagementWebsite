import express from 'express';

import {
  createAccountApi,
  getAccountFormView,
  getListAccountView,
  sendActivationAccountEmailApi, updateAccountApi,
  updateAccountLockApi
} from "#root/controllers/account.controller.js";
import {checkAdmin} from "#root/middlewares/autho.middleware.js";

const router = express.Router();

router.get('/resend-email/:id', checkAdmin, sendActivationAccountEmailApi);
router.post('/lock/:id', checkAdmin, updateAccountLockApi);

router.get('/:id', checkAdmin, getAccountFormView);
router.get('/:id', checkAdmin, getAccountFormView);
router.put('/:id', checkAdmin, updateAccountApi);
router.get('/', checkAdmin, getListAccountView);
router.post('/', checkAdmin, createAccountApi);

export {router}