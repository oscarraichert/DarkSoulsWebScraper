import axios from "axios";
import * as CHEERIO from 'cheerio';
import { WeaponReference } from "../models/weapon-reference.model";
import util from 'util';

const AXIOS = axios.create();

export function getWeaponsList(url: string): any[] {

    const weaponsList: WeaponReference[] = [];

    AXIOS.get(url).then(
        response => {
            const html = response.data;
            const $ = CHEERIO.load(html);
            const weaponsTable = $('table li > a');

            weaponsTable.each(((i, elem) => {
                const weaponAttribs = $(elem).attr();
                let wr = new WeaponReference(weaponAttribs.title, weaponAttribs.href)
                weaponsList.push(wr);
                console.log(util.inspect(weaponsList, { maxArrayLength: null }));
            }));
        })
        .catch(console.error);

    return weaponsList;
}