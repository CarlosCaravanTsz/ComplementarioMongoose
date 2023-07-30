// Carlos Eduardo Caravantes Reynoso
import fs from 'fs';

class FileManager {

    constructor(path) {
        this.path = path;
        this.format = 'utf-8';
    };


get = async (limit) => {

        if (fs.existsSync(this.path)) {

            let data = await fs.promises.readFile(this.path, { encoding: this.format });
            if (data) {
                data = JSON.parse(data);
                let l = data.length;
                if (l > 0) {
                    data = data.filter((p) => p.status == true);
                }

                if (limit) {
                    const elements = l > limit ? data.slice(0, limit) : data;
                    console.log(elements);
                    return elements;
                    } else {
                    console.log(data);
                    return data;
                }

            } else {
                return [];
            }
        } else {
            fs.promises.writeFile(this.path, JSON.stringify([]));
            return [];
        }
    };


    getById = async (id) => {
        const elements = await this.get();
        const element_found = elements.find(e => e.id === id);

        if (element_found) {
            console.log({ success: 'Producto encontrado' });
            return element_found;
        } else {
            let status = { error: 'Producto no encontrado' }
            console.log(status);
            return status;
        }
    };


    getNextId = async (list) => {
        return (list.length == 0) ? 1 : list[list.length - 1].id + 1;
    }


    set = async (data) => {

        try {
            const elements = await this.get();
            data.id = await this.getNextId(elements);
            elements.push(data);
            fs.promises.writeFile(this.path, JSON.stringify(elements));
            return {status: 'Producto Agregado Exitosamente'}
        } catch {
            return {status: 'ERROR al escribir el archivo'}
        }
    };



};

export default FileManager
//module.exports = ProductManager;