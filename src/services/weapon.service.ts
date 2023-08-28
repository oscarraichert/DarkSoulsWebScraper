import axios from "axios";
import * as CHEERIO from 'cheerio';
import { ItemReference } from "../models/item-reference.model";
import util from 'util';
import { Stat } from "../models/stat.model";
import { ItemStats } from "../models/item-stats.model";

const AXIOS = axios.create();

export async function getWeaponsReferenceList(url: string): Promise<ItemReference[]> {

    const weaponsList: ItemReference[] = [];

    await AXIOS.get(url).then(
        response => {
            const html = response.data;
            const $ = CHEERIO.load(html);
            const weaponsTable = $('table li > a');

            weaponsTable.each(((i, elem) => {
                const weaponAttribs = $(elem).attr();
                let wr = new ItemReference(weaponAttribs.title, weaponAttribs.href)
                weaponsList.push(wr);
            }));
        })
        .catch(console.error);

    return weaponsList;
}

export async function getWeaponStats(url: string, weaponList: ItemReference[]): Promise<ItemStats[]> {

    const weapons: ItemStats[] = [];

    for (let i = 0; i < weaponList.length; i++) {

        weapons.push(await AXIOS.get(url + weaponList[i].href).then(response => {
                const html = response.data;
                const $ = CHEERIO.load(html);
                const weaponName = $('aside > h2').contents().text();

                let weapon = new ItemStats(weaponName);

                let coreStats = getCoreStats($);
                weapon.stats.push(...coreStats);

                let otherStats = getOtherStats($);
                weapon.stats.push(...otherStats);

                return weapon;
            }));
    }

    return weapons;
}

function getOtherStats($: CHEERIO.CheerioAPI): Stat[] {

    const weaponOtherStats = $('aside[role=region] > div');
    let stats: Stat[] = [];

    weaponOtherStats.each(((i, elem) => {
        let statName = $(elem).attr('data-source');
        let statValue = $(elem).find('div').contents().text();

        if (statName != 'found' && statName != 'notes') {
            let stat = new Stat(statName, statValue);
            stats.push(stat);
        }
    }));

    return stats;
}

function getCoreStats($: CHEERIO.CheerioAPI): Stat[] {

    const weaponCoreStats = $('aside > section > table > tbody td');
    let stats: Stat[] = [];

    weaponCoreStats.each(((i, elem) => {
        let statName = $(elem).attr('data-source');
        let statValue = $(elem).contents().text();
        let stat = new Stat(statName, statValue);

        stats.push(stat);
    }));

    return stats;
}
