import express from 'express';
import {
  activationAccountApi,
  changePasswordApi, changePasswordView,
  createPasswordApi,
  createPasswordView,
  getCurrentAccountView,
  signInApi,
  signInView,
  signOutView,
  updateCurrentAccountApi
} from "#root/controllers/user.controller.js";

const router = express.Router();


router.get('/activation/:code', activationAccountApi);
router.get('/sign-in', signInView);
router.post('/sign-in', signInApi);
router.get('/sign-out', signOutView);

router.get('/password-create', createPasswordView);
router.post('/password-create', createPasswordApi);
router.get('/change-password', changePasswordView);
router.post('/change-password', changePasswordApi);

router.get('/', getCurrentAccountView);
router.post('/', updateCurrentAccountApi);

export {router}