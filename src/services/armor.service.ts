import axios from "axios";
import * as CHEERIO from "cheerio";
import { ItemReference } from "../models/item-reference.model";
import { Armor } from "../models/armor.model";
import { ArmorModel } from "../database/schemas/armor.schema";
import { connect } from "mongoose";
import { Stat } from "../models/stat.model";

const AXIOS = axios.create();
const URL = 'https://darksouls.fandom.com';
const CATEGORY = '/wiki/Armor_(Dark_Souls)#Pieces'

export class ArmorService {

  constructor() {
    connect('mongodb://localhost:27017');
  }

  private async getUniqueArmorReference() {

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
        }));
      });

    return armorReferenceList;
  }

  async getArmor() {

    const armorList: ItemReference[] = await this.getUniqueArmorReference();
    const armors: Armor[] = [];

    for (const item of armorList) {

      const armor = await AXIOS.get(URL + item.href).then(response => {
        const html = response.data;
        const $ = CHEERIO.load(html);

        return this.armorValuesFromPage(item, $);
      });

      armors.push(armor);
    }

    return armors;
  }

  private armorValuesFromPage(item: ItemReference, $: CHEERIO.CheerioAPI) {

    let armor = new ArmorModel({ name: item.title });
    let statsName: string[] = [];
    let statsValue: string[] = [];

    let statNameTable = $('table.infobox2 td > a');

    statNameTable.each(((_, elem) => {

      let statName = $(elem).attr('title');

      if (!statName?.includes('Category:') && statName != undefined) {
        statsName.push(statName);
      }
    }));

    let otherStatsNameTable = $('table.infobox2 th[colspan="2"]');

    otherStatsNameTable.each(((_, elem) => {

      let statName = $(elem).contents().text().trim();

      statsName.push(statName);
    }));

    let statValueTable = $('table.infobox2 td');

    statValueTable.each(((_, elem) => {

      let stat = $(elem).contents().text().trim();

      if (stat && !stat.includes('Male') && !stat.includes('Vanquisher')) {
        statsValue.push(stat);
      }
    }));

    for (let i = 0; i < statsValue.length; i++) {
      armor.stats.push(new Stat(statsName[i], statsValue[i]));
    }

    armor.save();
    return armor;
  }
}
