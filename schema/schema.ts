import {Collections} from "../utils.js";
import mongoose from "mongoose";

const categoryItemSchema = new mongoose.Schema(
    {
        location: { type: String, required: true, index: true },
        area: { type: String, required: true },
        category: { type: String, required: true },
        item_id: { type: String, default: "" },
        name: { type: String, default: "" },
        unit_sz: { type: String, default: "" },
    },
    { timestamps: true }
);

categoryItemSchema.index({ location: 1, area: 1, category: 1 });

export const CATEGORY_ITEMS = mongoose.model(
    Collections.CATEGORY_ITEMS,
    categoryItemSchema
);

const categoriesMetaSchema = new mongoose.Schema(
    {
        location: { type: String, required: true, unique: true },
        lastSynced: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const CATEGORIES_META = mongoose.model(
    Collections.CATEGORIES_META,
    categoriesMetaSchema
);
