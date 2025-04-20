import mongoose from "mongoose";
import {Collections, StockOnCategories, Zone} from "../utils.js";

const crewMemberSchema = new mongoose.Schema({
    uname: {type: String, required: true, unique: true},
    pw: {type: String, required: true},
    referer: {type: String},
    email: {type: String},
    zonalAccess: {type: [String], required: true, enum: Object.values(Zone),},
    stockOnAccess: {type: [String], required: true, enum: Object.values(StockOnCategories)},
}, {timestamps: true});

export const CREW_MEMBER = mongoose.model(Collections.CREW_MEMBERS, crewMemberSchema);
