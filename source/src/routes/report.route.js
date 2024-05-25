import express from 'express';
import {getReportApi, getReportView} from "#root/controllers/report.controller.js";

const router = express.Router();

router.get('/', getReportView);
router.get('/data', getReportApi);

export { router }