import axios from 'axios';
import * as weaponService from './services/weapon.service';
import { WeaponReference } from './models/weapon-reference.model';


const URL = 'https://darksouls.fandom.com';
const CATEGORY_WEAPONS = '/wiki/Weapons_(Dark_Souls)';

weaponService.getWeaponsList(URL + CATEGORY_WEAPONS);

let daggerRef = new WeaponReference('Dagger', '/wiki/Dagger')

weaponService.getWeaponStats(URL, daggerRef);