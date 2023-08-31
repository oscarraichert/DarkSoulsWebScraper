import { Stat } from "./stat.model";

export class Weapon {
  name: string;
  stats: Stat[];

  constructor(name: string) {
    this.name = name;
    this.stats = [];
  }
}
