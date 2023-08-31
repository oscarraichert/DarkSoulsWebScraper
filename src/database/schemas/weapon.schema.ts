import { Model, Schema, model } from "mongoose";
import { Weapon } from "../../models/weapon.model";
import { Stat } from "../../models/stat.model";

const weaponSchema = new Schema<Weapon, Model<Stat>>(
  {
    name: String,
    stats: [{ name: String, value: String }]
  },
  {
    versionKey: false
  });

export const WeaponModel = model<Weapon>('WeaponModel', weaponSchema, 'Weapon'); 
