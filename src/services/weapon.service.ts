import axios from "axios";
import * as CHEERIO from 'cheerio';
import { ItemReference } from "../models/item-reference.model";
import util from 'util';
import { Stat } from "../models/stat.model";
import { ItemStats } from "../models/item-stats.model";

const AXIOS = axios.create();

export function getWeaponsList(url: string): any[] {

    const weaponsList: ItemReference[] = [];

    AXIOS.get(url).then(
        response => {
            const html = response.data;
            const $ = CHEERIO.load(html);
            const weaponsTable = $('table li > a');

            weaponsTable.each(((i, elem) => {
                const weaponAttribs = $(elem).attr();
                let wr = new ItemReference(weaponAttribs.title, weaponAttribs.href)
                weaponsList.push(wr);
                //console.log(util.inspect(weaponsList, { maxArrayLength: null }));
            }));
        })
        .catch(console.error);

    return weaponsList;
}

export function getWeaponStats(url: string, weaponList: ItemReference) {

    AXIOS.get(url + weaponList.href).then(response => {
        const html = response.data;
        const $ = CHEERIO.load(html);
        const weaponName = $('aside > h2').contents().text();
        const weaponStats = $('aside > section > table > tbody td');

        let weapon = new ItemStats(weaponName);

        weaponStats.each(((i, elem) => {
            let statName = $(elem).attr('data-source');
            let statValue = $(elem).contents().text();
            let stat = new Stat(statName, statValue);

            weapon.stats.push(stat);
            //console.log(stat);
        }));
        //weaponStats.contents();

        console.log(weapon);
    })
    .catch(console.error);
}