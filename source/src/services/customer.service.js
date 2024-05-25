import {Customer} from "#root/models/index.js";

export const getCustomerById = async (id) => {
  return await Customer.findById(id);
};

export const createCustomer = () => {
  
};

export const getCustomerByPhone = async (phone) => {
  return await Customer.findOne({ phone });
};

export const getCustomers = async () => {
  const customers = await Customer.find({});
  return customers;
};