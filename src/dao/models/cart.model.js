import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    id: Number,
    products: [
        {
            p_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            pid: Number,
            quantity: Number,
        },
    ],
});

//cartSchema.pre("findOne", function () {
// this.populate("products.product");
//}); // Middleware para el esquema

//cartSchema.plugin(mongoosePaginate);

const cartModel = mongoose.model(cartCollection, cartSchema);


export default cartModel;