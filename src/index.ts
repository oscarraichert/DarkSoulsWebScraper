import { WeaponService } from './services/weapon.service';

async function runScraper() {

  const weaponService = new WeaponService();
  const weaponsStatss = await weaponService.getWeaponStats();

  const util = require('util');
  console.log(util.inspect(weaponsStatss, false, null, true));
}

runScraper();
