import { Schema, model } from "mongoose";
import { ItemReference } from "../../models/item-reference.model";

const itemRefSchema = new Schema<ItemReference>(
    {
        title: String,
        href: String
    },
    {
        versionKey: false
    });

export const ItemReferenceModel = model<ItemReference>('ItemReferenceModel', itemRefSchema, 'ItemReference');