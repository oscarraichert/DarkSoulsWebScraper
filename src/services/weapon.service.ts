import axios from "axios";
import * as CHEERIO from 'cheerio';
import { Stat } from "../models/stat.model";
import { connect } from "mongoose";
import { Weapon } from "../models/weapon.model";
import { WeaponModel } from "../database/schemas/weapon.schema";
import { ItemReference } from "../models/item-reference.model";

const AXIOS = axios.create();
const URL = 'http://darksouls.wikidot.com/reinforcement-formulas';
const CATEGORY = '/wiki/Weapons_(Dark_Souls)'

export class WeaponService {

  constructor() {
    connect('mongodb://localhost:27017');
  }

  async getInitialWeaponStats() {
    AXIOS.get(URL).then(response => {
      const html = response.data;
      const $ = CHEERIO.load(html);
      const initialStatsRow = $('[id="wiki-tabview-9d043cf45a4532fb2d0f4320c39e5909"] [id="wiki-tab-0-0"] tr');
      const weapons: Weapon[] = [];

      let statsName = [];
      let statsHeader = initialStatsRow.find('th').contents();
      statsHeader.each((_, statName) => {
        statsName.push($(statName).text());
      });

      initialStatsRow.each((_, tableRow) => {
        let statsValue = $(tableRow).children();

        let stats: Stat[] = [];
        statsValue.each((i, stat) => {
          let statValue = $(stat).contents().text();
          stats.push(new Stat(statsName[i], statValue));
          //console.log(stats);
        })

        let weapon = new Weapon(stats[0].value);
        weapon.stats.push(...stats);

        if (weapon.name != 'Name') {
          weapons.push(weapon);
        }

        console.log(weapon);
      })

    });
  }
}
