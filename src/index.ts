import axios from 'axios';
import { getWeaponsList } from './services/weapon.service';


const URL = 'https://darksouls.fandom.com/wiki/';
const CATEGORY_WEAPONS = 'Weapons_(Dark_Souls)';

getWeaponsList(URL + CATEGORY_WEAPONS);

