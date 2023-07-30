import { Router } from "express";
import CartManager from "../dao/manager/cart.manager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  // DONE: CREAR CARRITO CON LOS CAMPOS ID Y PRODUCTS[]
    try {
    const result = await cartManager.create();
    const status = result ? result : { status: "Error al agregar producto" };
    res.status(200).send(status);
    } catch {
    res.status(500).send({ status: "ERROR al crear un carrito" });
    }
});

router.get("/:cid", async (req, res) => {
  // DONE: LISTAR LOS PRODUCTOS QUE PERTENEZCAN AL CARRITO CID
    try {
    const cid = parseInt(req.params.cid);
    const result = await cartManager.list(cid);
    const status = result
    ? result
    : { status: `Error al listar productos del carrito ${cid}` };
    res.status(200).send(status);
    } catch {
    res.status(500).send({ status: "ERROR al lista productos del carrito" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
  // DEBERA AGREGAR EL PRODUCTO CON ID PID AL CARRITO CON ID IDC
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const result = await cartManager.addProduct(cid, pid);
        const status = result ? result : { status: "Error al agregar producto" };
        res.status(200).send(status);
    } catch {
        res.status(500).send({ status: "ERROR al agregar producto al carrito" });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  // TODO: DEBERA BORRAR EL PID DEL CID O RESTARLE -1
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const result = await cartManager.deleteProduct(cid, pid);
        const status = result ? result : { status: "Error al eliminar producto" };
        res.status(200).send(status);
    } catch {
        res.status(500).send({ status: "ERROR al lista actualizar el carrito" });
    }
});

export default router;
