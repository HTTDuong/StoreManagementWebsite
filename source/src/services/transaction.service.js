import {Transaction} from "#root/models/index.js";

export const getReports = () => {
  
}

export const getTransaction = async (id) => {
    const trans = await Transaction.findById(id);
    return trans;
}