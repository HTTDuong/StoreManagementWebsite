import {model as Product} from "#root/models/product.model.js";

export const getProducts = async () => {
    const products = await Product.find({});
    return products;
};

export const getProduct = async (id) => {
    const product = await Product.findById(id);
    return product;
};

export const createProduct = async (data) => {
    let productNew = new Product();
    productNew.barcode = data.barcode;
    productNew.name = data.name;
    productNew.importPrice = data.importPrice;
    productNew.retailPrice = data.retailPrice;
    productNew.category = data.category;
    // await Product.collection.insertOne(productNew);
    await productNew.save();
    return productNew;
};

export const updateProduct = async (data) => {
    const id = data.barcode;
    await Product.updateOne(
        {barcode: id},
        {
            $set: {
                barcode: data.barcode,
                name: data.name,
                importPrice: data.importPrice,
                retailPrice: data.retailPrice,
                category: data.category
            }
        }
    )
};

export const deleteProduct = async (id) => {
    await Product.findByIdAndRemove(id);
};