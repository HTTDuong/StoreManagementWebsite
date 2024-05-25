import express from 'express';
import {createCustomerApi, getCustomerByPhoneApi, getDetailCustomerView, getListCustomerView} from "#root/controllers/customer.controller.js";

const router = express.Router();



router.get('/:phone/api', getCustomerByPhoneApi);
router.get('/:id', getDetailCustomerView);

router.get('/', getListCustomerView)
router.post('/', createCustomerApi);

export { router }