import express from 'express';
import {
  createProductApi,
  deleteProductApi,
  getListProductView,
  getProductFormView,
  updateProductApi
} from "#root/controllers/product.controller.js";

const router = express.Router();

router.get('/:id', getProductFormView);
router.put('/:id', updateProductApi);
router.delete('/:id', deleteProductApi);
router.get('/', getListProductView);
router.post('/', createProductApi);

export { router }