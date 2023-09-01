import axios from "axios";
import * as CHEERIO from "cheerio";
import { ItemReference } from "../models/item-reference.model";

const AXIOS = axios.create();
const URL = 'https://darksouls.fandom.com';
const CATEGORY = '/wiki/Armor_(Dark_Souls)#Pieces'

export class ArmorService {

  constructor() {

  }

  async getUniqueArmorReference() {

    const armorReferenceList: ItemReference[] = [];

    await AXIOS.get(URL + CATEGORY).then(
      response => {
        const html = response.data;
        const $ = CHEERIO.load(html);
        const uniqueArmorTable = $('div[class="wds-tab__content"] li > a');

        uniqueArmorTable.each(((_, elem) => {
          const uniqueArmorRef = $(elem).attr();
          const armorReference = new ItemReference(uniqueArmorRef.title, uniqueArmorRef.href);

          armorReferenceList.push(armorReference);
          console.log(uniqueArmorRef, _);
        }));
      })
  }
}
