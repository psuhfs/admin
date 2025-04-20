import mongoose from "mongoose";
import {Collections} from "../utils.js";


const orderSchema = new mongoose.Schema({
    uname: {type: String, required: true},
    email_recipients: {type: String, required: true},
    order_date: {type: String, required: true},
    order_details: [{
        location: {type: String, required: true},
        area: {type: String, required: true},
        category: {type: String, required: true},
        item_id: {type: String, required: true},
        name: {type: String, required: true},
        unit_sz: {type: String, required: true},
        quantity: {type: Number, required: true},
    }]
}, {timestamps: true});


export const ORDER = mongoose.model(Collections.ORDERS, orderSchema);
