import {getCustomerById, getCustomerByPhone, getCustomers} from "#root/services/customer.service.js";
import {Customer, Transaction} from "#root/models/index.js";


export const getListCustomerView = async (req, res) => {
  const customers = await getCustomers();
  return res.render('pages/customer-list', {
    customers,
    isAdmin: req?.cookies?.account === 'admin',
  });
}

export const getDetailCustomerView = async (req, res) => {
  const customer = await getCustomerById(req.params.id);
  const transactions = await Transaction.find({ customer: customer?.phone });

  return res.render('pages/customer.detail.ejs', {
    customer,
    transactions: transactions?.map(e => ({
      ...e,
      customer,
    })),
    isAdmin: req?.cookies?.account === 'admin',
  });
}

export const getCustomerByPhoneApi = async (req, res) => {
  const customer = await getCustomerByPhone(req.params.phone);

  if (!customer) return res.json({ status: false });

  return res.json({
    customer: customer
  });
}

export const createCustomerApi = (req, res) => {
  return res.json({ success: true });
}
