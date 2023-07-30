import fs from 'fs';
import FileManager from './file.manager.js';

export default class ProductManager extends FileManager {

    constructor() {
        super("./src/db/products.json");
    }

    addProduct = async (data) => {

        if (data.title && data.description && data.code && data.price && data.stock && data.category && data.thumbnail) {
            data.status = true;
            const products = await this.get();

            if (products.find(p => p.code === data.code)) {
                let status = { status: "ERROR: Codigo de producto ya existente" };
                console.log(status);
                return status;
            }
            const result = await this.set(data)
            return result;

        } else {
            let status = { status: "ERROR: Falta datos para agregar producto" };
            console.log(status);
            return status;
        }

    };

    deleteProduct = async (id) => {

        let products = await this.get();
        const idx = products.findIndex(p => p.id === id);

        if (idx >= 0) {
            //elements.splice(idx, 1)
            products[idx].status = false;
        }
        else {
            return { status: 'Error: no existen elementos con ese ID' }
        }
        fs.promises.writeFile(this.path, JSON.stringify(products));
        let status = { status: 'Producto eliminado exitosamente' }
        console.log(status);
        return status;
    };

    updateProduct = async (id, obj) => {

        let products = await this.get();

        const idx = products.findIndex(p => p.id === id);

        if (idx < 0) {
            console.log({ error: 'Error: No existen elementos con ese ID' });
            return { status: 'Error: no existen elementos con ese ID' }
        }

        // Validacion de si los campos del objeto enviado coinciden con los campos de los Productos
        if (! Object.keys(obj).every((key) => Object.keys(products[0]).includes(key))) {
            console.log({ error: 'Los campos a modificar no coinciden con el esquema' });
            return { status: 'Los campos a modificar no coinciden con el esquema' }
        }

        // Actualizacion de los campos
        for (const key of Object.keys(obj)) {
            if(key == "id" || key == "code") continue
            products[idx][key] = obj[key]
            console.log('PRODUCTO: ', products[idx][key], '\nOBJ NUEVO: ', obj[key])
        }

        // Persistencia y Log
        fs.promises.writeFile(this.path, JSON.stringify(products));
        let status = { status: 'Producto actualizado exitosamente' }
        console.log(status);
        return status;
    };


}