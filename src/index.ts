import { ArmorService } from './services/armor.service';
import { WeaponService } from './services/weapon.service';

async function runScraper() {

  const weaponService = new WeaponService();
  // const weaponsStats = await weaponService.getWeaponStats();
  //
  // const armorService = new ArmorService();
  // armorService.getArmor();
  //
  await weaponService.getInitialWeaponStats();
  const util = require('util');
  //console.log(util.inspect(weaponsStats, false, null, true));
}

runScraper();
