import { Router } from "express";
import CartManager from "../dao/manager/cart.manager.js";
import cartModel from "../dao/models/cart.model.js"
import productModel from "../dao/models/product.model.js"

const router = Router();
const cartManager = new CartManager();

function add_id(array) {
  return array.length ? array.length + 1 : 1;
}

router.post("/", async (req, res) => {
  // DONE: CREAR CARRITO CON LOS CAMPOS ID Y PRODUCTS[] done in mongo
  try {

    const new_cart = {};

    new_cart.products = [];

    new_cart.id = add_id(await cartModel.find().lean());

    console.log("cart to create: ", new_cart);

    await cartModel.create(new_cart);

    const carts = await cartModel.find().lean();

    const status = carts ? carts : { status: "Error al agregar producto" };
    res.status(200).send(status);
    } catch {
    res.status(500).send({ status: "ERROR al crear un carrito" });
    }
});

router.get("/:cid", async (req, res) => {
  // DONE: LISTAR LOS PRODUCTOS QUE PERTENEZCAN AL CARRITO CID  \ done in mongo

  const cid = parseInt(req.params.cid);
  const result = await cartModel.findOne({ id: cid }).populate("products.p_id").lean();

  res.render("cart", result);
});


router.post("/:cid/product/:pid", async (req, res) => {
  // DEBERA AGREGAR EL PRODUCTO CON ID PID AL CARRITO CON ID IDC done in mongo
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const cart = await cartModel.findOne({ id: cid });
    const product = await productModel.findOne({ id: pid });

    const idx = cart.products.findIndex(p => p.pid == pid);
    console.log(idx);
    if (cart.products.length == 0 || idx == -1) {
      const new_product = { p_id: product._id, pid, quantity: 1 };
      await cartModel.updateOne({ id: cid }, { $push: { products: new_product } });
      res.status(200).send({ status: `Producto ${pid} agregado exitosamente al Carrito ${cid}` });
    } else {
      await cartModel.updateOne({ "products.pid": pid }, { $inc: { "products.$.quantity": 1 } });
      res.status(200).send({ status: `Producto ${pid} actualizado exitosamente al Carrito ${cid}` });
    }
  } catch {
    res.status(500).send({ status: "ERROR al agregar producto al carrito" });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => { // ELIMINA O DECREMENTA EN 1 LA CANTIDAD DEL PID EN EL CID done in Mongodb
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const cart = await cartModel.findOne({ id: cid });
    const product = await productModel.findOne({ id: pid });

    const idx = cart.products.findIndex(p => p.pid == pid);

    if (idx >= 0 && cart.products[idx].quantity == 1) {
      await cartModel.updateOne({ id: cid }, { $pull: { products: { pid: pid } } });
      res.status(200).send({ status: `Producto ${pid} eliminado exitosamente del Carrito ${cid}` });
      console.log('SOY 1 Y ERA 1')
    } else {
      await cartModel.updateOne({ "products.pid": pid }, { $inc: { "products.$.quantity": -1 } });
      res.status(200).send({ status: `Se ha decrementado en 1 la cantidad del producto ${pid} en el Carrito ${cid}` });
    }
  } catch {
    res.status(500).send({ status: "ERROR al agregar eliminar poducto del carrito" });
  }

});

router.get("/populate/:cid/product/:pid", async (req, res) => {
  // PROBANDO POPULATE
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  //const product = await cartModel.findOne({ id: cid }).populate("products.p_id").lean();
  const products = await cartModel.find().populate("products.p_id").lean();

  console.log(JSON.stringify(products, null, "\t"));
});



export default router;
