import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    },
    quantity: Number
});

//cartSchema.plugin(mongoosePaginate);

export default mongoose.model(cartCollection, cartSchema);