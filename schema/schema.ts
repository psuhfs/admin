import {Collections} from "../utils.js";
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        item_id: { type: String, required: true },
        name: { type: String, required: true },
        unit_sz: { type: String, required: true },
    },
    { _id: false }
);

const areaSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        info: {
            type: Map,
            of: [itemSchema],
        },
    },
    { _id: false }
);

const categoriesSchema = new mongoose.Schema(
    {
        location: { type: String, required: true, unique: true },
        areas: [areaSchema],
        lastSynced: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const CATEGORIES_SCHEMA = mongoose.model(
    Collections.CATEGORIES,
    categoriesSchema
);
