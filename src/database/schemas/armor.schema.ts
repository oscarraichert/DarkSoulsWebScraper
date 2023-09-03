import { Model, Schema, model } from "mongoose";
import { Armor } from "../../models/armor.model";
import { Stat } from "../../models/stat.model";

const armorSchema = new Schema<Armor, Model<Stat>>(
  {
    name: String,
    stats: [{ name: String, value: String }]
  },
  {
    versionKey: false
  });

export const ArmorModel = model<Armor>('ArmorModel', armorSchema, 'Armor');
