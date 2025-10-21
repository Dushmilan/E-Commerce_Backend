const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({ 
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    photo: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
