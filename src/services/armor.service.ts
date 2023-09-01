import axios from "axios";
import * as CHEERIO from "cheerio";
import { ItemReference } from "../models/item-reference.model";

const AXIOS = axios.create();
const URL = 'https://darksouls.fandom.com';
const CATEGORY = '/wiki/Armor_(Dark_Souls)#Lists'

export class ArmorService {

  constructor() {

  }

  // async getArmorSetReference() {
  //
  //   const armorSetReferenceList: ItemReference[] = [];
  //
  //   await AXIOS.get(URL + CATEGORY).then(
  //     response => {
  //       const html = response.data;
  //       const $ = CHEERIO.load(html);
  //       const armorSetTable = $('table[style="width:100%;"] li > a');
  //
  //
  //       armorSetTable.each(((_, elem) => {
  //         const armorSetAttribs = $(elem).attr();
  //         const armorSetReference = new ItemReference(armorSetAttribs.title, armorSetAttribs.href);
  //
  //         armorSetReferenceList.push(armorSetReference);
  //         //console.log(armorSetReferenceList);
  //       }));
  //     })
  // }

  async getUniqueArmorReference() {

    const armorReferenceList: ItemReference[] = [];

    await AXIOS.get(URL + CATEGORY).then(
      response => {
        const html = response.data;
        const $ = CHEERIO.load(html);
        const uniqueArmorTable = $('div[class="wds-tab__content wds-is-current"] li > a');

        uniqueArmorTable.each(((_, elem) => {
          const uniqueArmorRef = $(elem).attr();
          const armorReference = new ItemReference(uniqueArmorRef.title, uniqueArmorRef.href);

          armorReferenceList.push(armorReference);
          console.log(uniqueArmorRef);
        }));
      })
  }
}
