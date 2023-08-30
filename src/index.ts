import * as weaponService from './services/weapon.service';

const URL = 'https://darksouls.fandom.com';

async function runScraper() {

  const weaponsStatss = await weaponService.getWeaponStats(URL);

  const util = require('util');
  console.log(util.inspect(weaponsStatss, false, null, true));
}

runScraper();
