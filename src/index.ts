import axios from 'axios';
import * as weaponService from './services/weapon.service';
import { ItemReference } from './models/item-reference.model';


const URL = 'https://darksouls.fandom.com';
const CATEGORY_WEAPONS = '/wiki/Weapons_(Dark_Souls)';

async function runScraper() {

    const weaponList = await weaponService.getWeaponsReferenceList(URL + CATEGORY_WEAPONS);

    const weaponsStatss = await weaponService.getWeaponStats(URL, weaponList);

    const util = require('util');
    console.log(util.inspect(weaponsStatss, false, null, true));
}

runScraper();
