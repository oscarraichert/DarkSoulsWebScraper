import { Stat } from "./stat.model";

export class ItemStats {
    name: string;
    stats: Stat[];

    constructor(name: string) {
        this.name = name;
        this.stats = [];
    }
}