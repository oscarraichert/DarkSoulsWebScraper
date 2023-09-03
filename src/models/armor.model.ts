import { Stat } from "./stat.model";

export class Armor {
  name: string;
  stats: Stat[];

  constructor(name: string) {
    this.name = name;
  }
}
