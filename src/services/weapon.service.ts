import axios from "axios";
import * as CHEERIO from 'cheerio';
import { Stat } from "../models/stat.model";
import { connect } from "mongoose";
import { Weapon } from "../models/weapon.model";
import { WeaponModel } from "../database/schemas/weapon.schema";

const AXIOS = axios.create();
const INITIAL_STATS_URL = 'http://darksouls.wikidot.com/reinforcement-formulas';
const MAIN_URL = 'http://darksouls.wikidot.com/';

export class WeaponService {

  constructor() {
    connect('mongodb://localhost:27017/DarkSouls');
  }

  normalize = [
    ["Gr.", "Great"],
    ["Ltng.", "Lightning"],
    ["Crys.", "Crystal"],
    ["Ench.", "Enchanted"],
    ["Occ.", "Occult"],
    ["Div.", "Divine"],
    ["Ptg.", "Painting"],
    ["Man-srp.", "Man-serpent"],
    ["Silv.", "Silver"],
    ["Str.", "Straight"]
  ];

  requirements = [
    'str_req',
    'dex_req',
    'int_req',
    'fai_req'
  ];

  ascended = [
    'Crystal ',
    'Lightning ',
    'Raw ',
    'Magic ',
    'Enchanted ',
    'Divine ',
    'Occult ',
    'Fire ',
    'Chaos '
  ];

  async getInitialWeaponStats() {

    let response = await AXIOS.get(INITIAL_STATS_URL);

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
      })

      let weapon = new Weapon(stats[0].value);
      weapon.stats.push(...stats);

      if (weapon.name != 'Name' && weapon.name != 'Fists') {
        weapons.push(weapon);
      }
    });

    weapons.map(w => {
      this.normalize.forEach(abbrev => {
        if (w.name.includes(abbrev[0])) {
          w.name = w.name.replace(abbrev[0], abbrev[1]);
        }
      })
    })

    await this.getOtherWeaponStats(weapons);
  }

  async getOtherWeaponStats(weapons: Weapon[]) {

    for (let weapon of weapons) {

      let weaponName = weapon.name;

      if (weapon.name == 'Darksword') {
        weaponName = 'Dark Sword';
      }

      if (weapon.name == 'Iaito') {
        weaponName = 'Iaito Sword';
      }

      if (!this.ascended.some(x => weapon.name.includes(x))) {

        const response = await AXIOS.get(MAIN_URL + weaponName);

        if (response.status != 404) {

          const html = response.data;
          const $ = CHEERIO.load(html);

          const statsTable = $('[id="page-content"]').find('[class="wiki-content-table"]').first();

          let statNames: string[] = [];
          statsTable.find('th').map((_, sn) => {
            let statName = $(sn).contents().text();
            statNames.push(statName);
          });

          let statValues: string[] = [];
          statsTable.find('td').map((_, sv) => {
            let statValue = $(sv).contents().text();
            statValues.push(statValue);
          })

          for (let i = 0; i < statNames.length - 1; i++) {
            if (statNames[i] == 'Weight') {
              let stat = new Stat(statNames[i], statValues[i]);
              weapon.stats.push(stat);
            }

            if (statNames[i] == 'Durability') {
              let stat = new Stat(statNames[i], statValues[i]);
              weapon.stats.push(stat);
            }

            if (statNames[i].includes('Stats Needed')) {
              let statsReqVal = statValues[i].split('\n');
              let statsNeededValues = statsReqVal[0].split('/');

              for (let i = 0; i < statsNeededValues.length; i++) {

                if (i == 0) {
                  let footnote = statsNeededValues[i].length - 1;
                  statsNeededValues[i] = statsNeededValues[i].substring(0, footnote);
                }

                let stat = new Stat(this.requirements[i], statsNeededValues[i]);
                weapon.stats.push(stat);
              }
            }
          }
        }

        let wm = new WeaponModel({ name: weapon.name, stats: weapon.stats });
        console.log(wm);
        await wm.save();
      }
    }
  }
}
