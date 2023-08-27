import axios from 'axios';
import * as weaponService from './services/weapon.service';
import { ItemReference } from './models/item-reference.model';


const URL = 'https://darksouls.fandom.com';
const CATEGORY_WEAPONS = '/wiki/Weapons_(Dark_Souls)';

weaponService.getWeaponsList(URL + CATEGORY_WEAPONS);

let daggerRef = new ItemReference('Dagger', '/wiki/Dagger')

weaponService.getWeaponStats(URL, daggerRef);