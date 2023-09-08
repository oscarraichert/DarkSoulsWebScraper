import axios from "axios";
import * as CHEERIO from 'cheerio';
import { Stat } from "../models/stat.model";
import { connect } from "mongoose";
import { Weapon } from "../models/weapon.model";
import { WeaponModel } from "../database/schemas/weapon.schema";
import { ItemReference } from "../models/item-reference.model";

const AXIOS = axios.create();
const URL = 'https://darksouls.fandom.com';
const CATEGORY = '/wiki/Weapons_(Dark_Souls)'

export class WeaponService {

  constructor() {
    connect('mongodb://localhost:27017');
  }

  async getWeaponStats() {

    const weaponList: ItemReference[] = await this.getWeaponsReferenceList();
    const weapons: Weapon[] = [];

    for (const item of weaponList) {

      const weapon = await AXIOS.get(URL + item.href).then(response => {
        const html = response.data;
        const $ = CHEERIO.load(html);

        let weapon = new WeaponModel({ name: item.title });

        weapon.stats.push(...this.getCoreStats($));

        weapon.stats.push(...this.getOtherStats($));

        weapon.save();
        return weapon;
      });

      weapons.push(weapon);
    }

    return weapons;
  }

  async getWikiDotWeapons() {

    const weapons: Weapon[] = [];

    const url = 'http://darksouls.wikidot.com/reinforcement-formulas';

    await AXIOS.get(url).then(response => {

      const html = response.data;
      const $ = CHEERIO.load(html);
      const weaponsTable = $('div[id="wiki-tabview-9d043cf45a4532fb2d0f4320c39e5909"] tr');

      weaponsTable.each(((_, elem) => {

        const values = $(elem).children().contents().toArray();
        console.log(values);
      }));
    });
  }

  private async getWeaponsReferenceList(): Promise<ItemReference[]> {

    const weaponsList: ItemReference[] = [];

    await AXIOS.get(URL + CATEGORY).then(
      response => {
        const html = response.data;
        const $ = CHEERIO.load(html);
        const weaponsTable = $('table li > a');

        weaponsTable.each(((_, elem) => {
          const weaponAttribs = $(elem).attr();
          let wr = new ItemReference(weaponAttribs.title, weaponAttribs.href)
          weaponsList.push(wr);
        }));
      })
      .catch(console.error);

    return weaponsList;
  }

  private getOtherStats($: CHEERIO.CheerioAPI): Stat[] {

    const weaponOtherStats = $('aside[role=region] > div');
    let stats: Stat[] = [];

    weaponOtherStats.each(((_, elem) => {
      let statName = $(elem).attr('data-source');
      let statValue = $(elem).find('div').contents().text();

      if (statName != 'found' && statName != 'notes') {
        let stat = new Stat(statName, statValue);
        stats.push(stat);
      }
    }));

    return stats;
  }

  private getCoreStats($: CHEERIO.CheerioAPI): Stat[] {

    const weaponCoreStats = $('aside > section > table > tbody td');
    let stats: Stat[] = [];

    weaponCoreStats.each(((_, elem) => {
      let statName = $(elem).attr('data-source');
      let statValue = $(elem).contents().text();
      let stat = new Stat(statName, statValue);

      stats.push(stat);
    }));

    return stats;
  }
}
