import {createProduct, deleteProduct, getProducts, updateProduct} from "#root/services/product.service.js";
import {model as Product} from "#root/models/product.model.js";
import {model as Account} from "#root/models/account.model.js";

export const getListProductView = async (req, res) => {
    const username = req.cookies['account'];
    const account = await Account.findOne({username});
    const products = await getProducts();
    if (account.permissions.includes('ADMIN_PERMISSION')) {
        return res.render('pages/product-for-admin-list', {
            products,
            isAdmin: req?.cookies?.account === 'admin',
        });
    } else {
        return res.render('pages/product-for-employee-list', {
            products,
            isAdmin: req?.cookies?.account === 'admin',
        });
    }
}

export const getProductFormView = async (req, res) => {
    if (req.params.id === 'new') {
        return res.render('pages/product-form', {
            product: {}, buttonText: 'Thêm', formAction: '/product', inputBOrder: 'border-none',
            isAdmin: req?.cookies?.account === 'admin',
        });
    }

    const product = await Product.findById(req.params.id);

    return res.render('pages/product-form', {
        product,
        buttonText: 'Sửa',
        formAction: `/product/${req.params.id}?_method=PUT`,
        inputBorder: '',
        isAdmin: req?.cookies?.account === 'admin',
    });
}

export const createProductApi = async (req, res) => {
    await createProduct(req.body);

    return res.redirect('/product');
}

export const updateProductApi = async (req, res) => {
    const product = await updateProduct(req.body);
    return res.json({success: true});
}

export const deleteProductApi = async (req, res) => {
    await deleteProduct(req.params.id);

    return res.redirect('/product');
}