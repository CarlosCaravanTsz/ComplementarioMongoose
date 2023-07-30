import { Router} from "express";
import ProductManager from "../dao/manager/product.manager.js";
import productModel from "../dao/models/product.model.js"

const router = Router();
const productManager = new ProductManager();


// Landing Page OK
router.get('/', (req, res) => {
    res.render('index', {});
});

// Products Catalog OK
router.get('/products', async (req, res) => {
    
    const products = await productManager.get();
    res.render('products_catalog', { products })
});


// Edit Product Catalog OK
router.get('/edit-products', async (req, res) => {
    const products = await productManager.get();
    res.render('edit_products', { products })
});

// ADD PRODUCT
router.post('/form-products', async (req, res) => {
    const data = req.body;
    const result = await productManager.addProduct(data);
    console.log(result);

    res.redirect('/products');
});


export default router
