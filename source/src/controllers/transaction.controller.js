import ejs from "ejs";
import pdf from "html-pdf";

import {getProducts} from "#root/services/product.service.js";
import {Customer, Product, Transaction} from "#root/models/index.js";
import {getTransaction} from "#root/services/transaction.service.js";
import {ROOT_PATH} from "#root/index.js";

export const getTransactionCurrentView = async (req, res) => {
  const products = await getProducts();

  return res.render('pages/transaction.form.ejs', {
    products,
    isAdmin: req?.cookies?.account === 'admin',
  });
};

export const createTransactionApi = async (req, res) => {
  try {
    const {
      customer,
      products,
      receive,
    } = req.body;

    const productTmp = [];
    for (const product of products) {
      const productDb = await Product.findOne({ barcode: product.barcode });
      await Product.findOneAndUpdate({
        barcode: product.barcode
      }, {
        amount: productDb.amount - product.amount,
      });
      productTmp.push({
        barcode: product.barcode,
        name: productDb.name,
        amount: product.amount,
        unitPrice: productDb.retailPrice,
      });
    }

    const priceDb = productTmp.reduce((result, curr) => {
      return result + (curr.amount * curr.unitPrice);
    }, 0);

    await Customer.findOneAndUpdate({
      phone: customer.phone
    }, customer, {
      upsert: true
    });

    const transaction = {
      customer: customer.phone,
      employee: req.cookies.account,
      products: productTmp.map(e => ({
        barcode: e.barcode,
        amount: e.amount,
        unitPrice: e.retailPrice,
      })),
      price: priceDb,
      receive: receive,
      remain: receive - priceDb,
    };

    await (new Transaction(transaction)).save();

    ejs.renderFile(`${ROOT_PATH}/views/templates/transaction.template.ejs`, {
      customer,
      products: productTmp,
      price: priceDb,
      receive,
      remain: transaction.remain,
    }, (err, result) => {
      if (err) {
        return res.json({
          success: false,
        });
      }

      pdf.create(result).toBuffer((err, buffer) => {
        if (err) return res.json({
          success: false,
          message: err?.message,
        });
        res.type('pdf');
        return res.end(buffer, 'binary');
      });
    });
  }
  catch (err) {
    return res.json({
      status: false,
    });
  }
};

export const getTransactionDetail = async (req, res) => {
  const trans = await getTransaction(req.params.id);

  return res.render('pages/transaction-detail.ejs', {
    trans,
    isAdmin: req?.cookies?.account === 'admin',
  });
};