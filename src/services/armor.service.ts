import axios from "axios";
import * as CHEERIO from "cheerio";
import { Armor } from "../models/armor.model";
import { ArmorModel } from "../database/schemas/armor.schema";
import { connect } from "mongoose";
import { Stat } from "../models/stat.model";

const AXIOS = axios.create();
const URL = 'https://darksouls.fandom.com';
const CATEGORY = '/wiki/Armor_(Dark_Souls)#Pieces'

export class ArmorService {

  constructor() {
    connect('mongodb://localhost:27017/DarkSouls');
  }
}
