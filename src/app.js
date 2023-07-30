// Libraries and external sources
import express, { urlencoded } from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import cartRouter from "./router/cart.router.js";
import chatRouter from "./router/chat.router.js";
import viewsRouter from "./router/views.router.js";

import __dirname from "./utils.js";


import ProductManager from "./dao/manager/product.manager.js";


const PORT = process.env.PORT || 8080;
const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use('/static', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/chat", chatRouter);


const httpServer = app.listen(PORT, () =>
    console.log(`Listening on port ${PORT}...`)
);

const URL = "mongodb+srv://carloscara28:DnERG59KflAo9jen@carlosbackenddb.44mn6xw.mongodb.net/?retryWrites=true&w=majority";

mongoose
    .connect(URL, { dbName: "ecommerce" })
    .then(() => console.log("Connected to e-commerce DB..."))
    .then(() => {

        const io = new Server(httpServer);

        io.on("connection", (socket) => {
            socket.on("operation", async (data) => {

            const productManager = new ProductManager();
            const { operation } = data;
            delete data.operation;
            //console.log("PRODUCTO RECIBIDO TESTING: ", data);

            if (operation == "add") {
                await productManager.addProduct(data);
                const products = await productManager.get();
                socket.emit("reload-table", products);
            } else if (operation == "update") {
                await productManager.updateProduct(data.id, data);
                const products = await productManager.get();
                socket.emit("reload-table", products);
            } else if (operation == "delete") {
                await productManager.deleteProduct(data.id);
                const products = await productManager.get();
                socket.emit("reload-table", products);
            } else {
                console.log({ status: "ERROR: Operacion no encontrada" });
            }
            });
        });

    });


