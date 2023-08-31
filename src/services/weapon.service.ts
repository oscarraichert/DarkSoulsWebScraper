import axios from "axios";
import * as CHEERIO from 'cheerio';
import { ItemReference } from "../models/item-reference.model";
import { Stat } from "../models/stat.model";
import { connect } from "mongoose";
import { ItemReferenceModel } from "../database/schemas/item-reference.schema";
import { Weapon } from "../models/weapon.model";
import { WeaponModel } from "../database/schemas/weapon.schema";

const AXIOS = axios.create();
const URL = 'https://darksouls.fandom.com';
const CATEGORY = '/wiki/Weapons_(Dark_Souls)'

export class WeaponService {

  constructor() {
    connect('mongodb://localhost:27017');
  }

  async getWeaponStats(): Promise<Weapon[]> {

    const weaponList = await this.getWeaponsReferenceList();
    const weapons: Weapon[] = [];

    for (const item of weaponList) {

      const weapon = await AXIOS.get(URL + item.href).then(response => {
        const html = response.data;
        const $ = CHEERIO.load(html);
        const weaponName = $('aside > h2').contents().text();

        let weapon = new WeaponModel({ name: weaponName });

        weapon.stats.push(...this.getCoreStats($));

        weapon.stats.push(...this.getOtherStats($));

        weapon.save();
        return weapon;
      });

      weapons.push(weapon);
    }

    return weapons;
  }

  async getWeaponsReferenceList(): Promise<ItemReference[]> {

    const weaponsList: ItemReference[] = [];

    await AXIOS.get(URL + CATEGORY).then(
      response => {
        const html = response.data;
        const $ = CHEERIO.load(html);
        const weaponsTable = $('table li > a');

        weaponsTable.each(((_, elem) => {
          const weaponAttribs = $(elem).attr();
          let wr = new ItemReferenceModel({ title: weaponAttribs.title, href: weaponAttribs.href })
          weaponsList.push(wr);
          wr.save();
        }));
      })
      .catch(console.error);

    return weaponsList;
  }

  getOtherStats($: CHEERIO.CheerioAPI): Stat[] {

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

  getCoreStats($: CHEERIO.CheerioAPI): Stat[] {

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
