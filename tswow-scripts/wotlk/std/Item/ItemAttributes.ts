/*
* This file is part of tswow (https://github.com/tswow)
*
* Copyright (C) 2020 tswow <https://github.com/tswow/>
* This program is free software: you can redistribute it and/or
* modify it under the terms of the GNU General Public License as
* published by the Free Software Foundation, version 3.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
* See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
*/
import * as fs from "fs";
import * as path from "path";
import { CellSystem } from "../../../data/cell/systems/CellSystem";
import { ItemTemplate } from "./ItemTemplate";
import { Stat } from "./ItemStats";
import { 
    armorClass, 
    weaponClass, 
    qualityCoefficients, 
    armorData, 
    weaponDPS, 
    weaponDamageMod, 
    weaponSubClass,
    itemStats,
    exponent,
    exponentInverse,
    getArmorTypeName
} from "./ItemAttributesData";

export interface ItemAttributesConfig {
    stats?: Array<[Stat, number]>;
    disenchant?: boolean;
    price?: boolean;
    armorOrDamage?: boolean;
}

export class ItemAttributes extends CellSystem<ItemTemplate> {
    private stats: Array<[Stat, number]> = [];
    private disenchant: boolean = true;
    private price: boolean = true;
    private armorOrDamage: boolean = true;
    private static debugLogPath: string = path.join(process.cwd(), "itemization debug.log");

    private static log(message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        try {
            fs.appendFileSync(this.debugLogPath, logMessage);
        } catch (err) {
            // If file write fails, try console as fallback
            console.error(`Failed to write to debug log: ${err}`);
            console.log(logMessage);
        }
    }

    constructor(owner: ItemTemplate) {
        super(owner);
        ItemAttributes.log(`=== ItemAttributes Constructor ===`);
        ItemAttributes.log(`Item ID: ${owner.ID}`);
        ItemAttributes.log(`Item Name: ${owner.Name.enGB.get()}`);
        ItemAttributes.log(`Item Class: ${owner.Class.getClass()}`);
        ItemAttributes.log(`Item Subclass: ${owner.Class.getSubclass()}`);
        ItemAttributes.log(`Inventory Type: ${owner.InventoryType.get()}`);
        ItemAttributes.log(`Quality: ${owner.Quality.get()}`);
        ItemAttributes.log(`Item Level: ${owner.ItemLevel.get()}`);
        ItemAttributes.log(`Current Armor: ${owner.Armor.get()}`);
        ItemAttributes.log(`Current Bonus Armor: ${owner.BonusArmor.get()}`);
        ItemAttributes.log(`Current Delay: ${owner.Delay.get()}`);
        const currentDamage = owner.Damage.get(0);
        ItemAttributes.log(`Current Damage: ${currentDamage ? `${currentDamage.Min.get()}-${currentDamage.Max.get()}` : 'None'}`);
        // Calculate and store item budget in constructor
        this.calculateItemBudget();
    }

    set(config: ItemAttributesConfig): ItemTemplate {
        ItemAttributes.log(`=== ItemAttributes.set() called ===`);
        ItemAttributes.log(`Config: ${JSON.stringify(config, null, 2)}`);
        
        if (config.stats !== undefined) {
            this.stats = config.stats;
            ItemAttributes.log(`Stats set: ${this.stats.length} stats configured`);
        }
        if (config.disenchant !== undefined) {
            this.disenchant = config.disenchant;
            ItemAttributes.log(`Disenchant set: ${this.disenchant}`);
        }
        if (config.price !== undefined) {
            this.price = config.price;
            ItemAttributes.log(`Price set: ${this.price}`);
        }
        if (config.armorOrDamage !== undefined) {
            this.armorOrDamage = config.armorOrDamage;
            ItemAttributes.log(`ArmorOrDamage set: ${this.armorOrDamage}`);
        }
        
        // Apply the configuration to the parent item template
        this.applyStats();
        this.applyDisenchant();
        this.applyPrice();
        this.applyArmorOrDamage();
        
        ItemAttributes.log(`=== ItemAttributes.set() completed ===\n`);
        return this.owner;
    }

    private calculateItemBudget(): number {
        ItemAttributes.log(`--- calculateItemBudget() called ---`);
        const itemClass = this.owner.Class.getClass();
        const inventoryType = this.owner.InventoryType.get();
        const quality = this.owner.Quality.get();
        const itemLevel = this.owner.ItemLevel.get();

        ItemAttributes.log(`Inputs: itemClass=${itemClass}, inventoryType=${inventoryType}, quality=${quality}, itemLevel=${itemLevel}`);

        const array = itemClass === 4 ? armorClass : weaponClass;
        ItemAttributes.log(`Using ${itemClass === 4 ? 'armorClass' : 'weaponClass'} array`);
        
        const invType = array[inventoryType];
        if (!invType) {
            ItemAttributes.log(`ERROR: No inventory type found for inventoryType=${inventoryType}`);
            this.owner.ItemBudget = 0;
            return 0;
        }

        ItemAttributes.log(`Found inventory type: ${invType.name || 'unnamed'}`);

        const slotMod = invType.slotMod;
        const slotModFunction = typeof slotMod === "function";
        ItemAttributes.log(`slotMod is ${slotModFunction ? 'function' : 'number'}: ${slotModFunction ? 'function' : slotMod}`);
        
        const effectiveSlotMod = slotModFunction ? slotMod(quality, itemLevel) : slotMod;
        ItemAttributes.log(`effectiveSlotMod: ${effectiveSlotMod}`);
        
        if (!effectiveSlotMod) {
            ItemAttributes.log(`ERROR: effectiveSlotMod is null/undefined/0`);
            this.owner.ItemBudget = 0;
            return 0;
        }

        const qualityEntry = qualityCoefficients[quality];
        if (!qualityEntry) {
            ItemAttributes.log(`ERROR: No quality coefficient found for quality=${quality}`);
            this.owner.ItemBudget = 0;
            return 0;
        }

        ItemAttributes.log(`Found quality entry: ${qualityEntry.name || 'unnamed'}`);

        const qualityMod = qualityEntry.calc(itemLevel);
        ItemAttributes.log(`qualityMod: ${qualityMod}`);
        
        if (qualityMod) {
            const budget = Math.pow(qualityMod * effectiveSlotMod, exponent) / effectiveSlotMod;
            ItemAttributes.log(`Calculated budget: ${budget}`);
            this.owner.ItemBudget = budget;
            ItemAttributes.log(`Stored budget on item: ${this.owner.ItemBudget}`);
            return budget;
        }

        ItemAttributes.log(`ERROR: qualityMod is 0 or falsy`);
        this.owner.ItemBudget = 0;
        return 0;
    }

    private applyStats(): void {
        ItemAttributes.log(`--- applyStats() called ---`);
        
        if (!this.stats || this.stats.length === 0) {
            ItemAttributes.log(`No stats configured, skipping`);
            return;
        }

        ItemAttributes.log(`Stats to apply: ${this.stats.length}`);
        this.stats.forEach(([stat, percent]) => {
            ItemAttributes.log(`  - Stat ${stat}: ${percent}%`);
        });

        const itemBudget = this.owner.ItemBudget;
        ItemAttributes.log(`Item budget: ${itemBudget}`);
        
        if (!itemBudget || itemBudget <= 0) {
            ItemAttributes.log(`ERROR: Invalid item budget (${itemBudget}), skipping stats`);
            return;
        }

        const itemClass = this.owner.Class.getClass();
        const inventoryType = this.owner.InventoryType.get();
        const quality = this.owner.Quality.get();
        const itemLevel = this.owner.ItemLevel.get();

        ItemAttributes.log(`Item properties: class=${itemClass}, inventoryType=${inventoryType}, quality=${quality}, itemLevel=${itemLevel}`);

        const array = itemClass === 4 ? armorClass : weaponClass;
        const invType = array[inventoryType];
        if (!invType) {
            ItemAttributes.log(`ERROR: No inventory type found`);
            return;
        }

        const slotMod = invType.slotMod;
        const slotModFunction = typeof slotMod === "function";
        const effectiveSlotMod = slotModFunction ? slotMod(quality, itemLevel) : slotMod;
        ItemAttributes.log(`effectiveSlotMod: ${effectiveSlotMod}`);

        if (!effectiveSlotMod) {
            ItemAttributes.log(`ERROR: effectiveSlotMod is invalid`);
            return;
        }

        // Clear existing stats
        ItemAttributes.log(`Clearing existing stats`);
        this.owner.Stats.clearAll();

        // Apply each stat based on percentage
        ItemAttributes.log(`Applying stats...`);
        for (const [statType, percent] of this.stats) {
            const statBudget = itemBudget * (percent / 100);
            ItemAttributes.log(`  Stat ${statType} (${percent}%): statBudget=${statBudget}`);
            
            // Get stat mod from itemStats
            const statEntry = itemStats[statType];
            if (!statEntry) {
                ItemAttributes.log(`  ERROR: No stat entry found for statType=${statType}, skipping`);
                continue;
            }
            
            ItemAttributes.log(`  Found stat entry: ${statEntry.name || 'unnamed'}`);
            
            const statMod = statEntry.statMod;
            const statModFunction = typeof statMod === "function";
            ItemAttributes.log(`  statMod is ${statModFunction ? 'function' : 'number'}: ${statModFunction ? 'function' : statMod}`);
            
            const effectiveStatMod = statModFunction ? statMod(inventoryType, quality, itemLevel) : statMod;
            ItemAttributes.log(`  effectiveStatMod: ${effectiveStatMod}`);
            
            if (!effectiveStatMod) {
                ItemAttributes.log(`  ERROR: effectiveStatMod is null/undefined/0, skipping stat`);
                continue;
            }
            
            // Calculate stat value using the formula from loothaven: Math.pow(statBudget / effectiveStatMod, exponentInverse)
            const statValue = Math.ceil(Math.pow(statBudget / effectiveStatMod, exponentInverse));
            ItemAttributes.log(`  Calculated statValue: ${statValue} (formula: Math.pow(${statBudget} / ${effectiveStatMod}, ${exponentInverse}))`);
            
            this.owner.Stats.add(statType, statValue);
            ItemAttributes.log(`  Added stat ${statType} with value ${statValue} to item`);
        }
        
        ItemAttributes.log(`Final stats on item:`);
        for (let i = 0; i < 10; i++) {
            const stat = this.owner.Stats.get(i);
            if (!stat.isClear()) {
                ItemAttributes.log(`  Stat[${i}]: Type=${stat.Type.get()}, Value=${stat.Value.get()}`);
            }
        }
    }

    private applyDisenchant(): void {
        ItemAttributes.log(`--- applyDisenchant() called ---`);
        ItemAttributes.log(`disenchant flag: ${this.disenchant}`);
        // Stub: Will be implemented later to set disenchant loot
        if (!this.disenchant) {
            ItemAttributes.log(`Setting disenchant to 0`);
            this.owner.Disenchant.set(0);
        } else {
            ItemAttributes.log(`Keeping existing disenchant value: ${this.owner.Disenchant.get()}`);
        }
    }

    private applyPrice(): void {
        ItemAttributes.log(`--- applyPrice() called ---`);
        
        if (!this.price) {
            ItemAttributes.log(`Price calculation disabled, skipping`);
            return;
        }

        const itemClass = this.owner.Class.getClass();
        const inventoryType = this.owner.InventoryType.get();
        const quality = this.owner.Quality.get();
        const itemLevel = this.owner.ItemLevel.get();

        ItemAttributes.log(`Inputs: itemClass=${itemClass}, inventoryType=${inventoryType}, quality=${quality}, itemLevel=${itemLevel}`);

        const array = itemClass === 4 ? armorClass : weaponClass;
        const invType = array[inventoryType];
        if (!invType) {
            ItemAttributes.log(`ERROR: No inventory type found`);
            return;
        }

        const sellMod = invType.sellMod;
        ItemAttributes.log(`sellMod: ${sellMod}`);
        
        const qualityEntry = qualityCoefficients[quality];
        if (!qualityEntry) {
            ItemAttributes.log(`ERROR: No quality coefficient found for quality=${quality}`);
            return;
        }

        const baseSellValue = qualityEntry.sellValue(itemLevel);
        ItemAttributes.log(`baseSellValue: ${baseSellValue}`);
        
        const sellPriceInCopper = Math.ceil(baseSellValue * sellMod);
        ItemAttributes.log(`sellPriceInCopper: ${sellPriceInCopper}`);
        
        const buyPriceInCopper = sellPriceInCopper * 5;
        ItemAttributes.log(`buyPriceInCopper: ${buyPriceInCopper}`);

        // Set sell price (buy price is typically 5x sell price)
        this.owner.Price.setAsCopper(sellPriceInCopper, buyPriceInCopper, 1);
        ItemAttributes.log(`Price set: Sell=${sellPriceInCopper} copper, Buy=${buyPriceInCopper} copper`);
        
        // Verify what was actually set
        ItemAttributes.log(`Verification - Current sell price: ${this.owner.Price.PlayerSellPrice.get()}, Buy price: ${this.owner.Price.PlayerBuyPrice.get()}`);
    }

    private applyArmorOrDamage(): void {
        ItemAttributes.log(`--- applyArmorOrDamage() called ---`);
        
        if (!this.armorOrDamage) {
            ItemAttributes.log(`Armor/Damage calculation disabled, skipping`);
            return;
        }

        const itemClass = this.owner.Class.getClass();
        ItemAttributes.log(`Item class: ${itemClass}`);
        
        if (itemClass === 4) {
            // Armor item - calculate armor
            ItemAttributes.log(`Detected armor item, calling calculateArmor()`);
            this.calculateArmor();
        } else if (itemClass === 2) {
            // Weapon item - calculate damage
            ItemAttributes.log(`Detected weapon item, calling calculateDamage()`);
            this.calculateDamage();
        } else {
            ItemAttributes.log(`Item class ${itemClass} is not armor (4) or weapon (2), skipping`);
        }
    }

    private calculateArmor(): void {
        ItemAttributes.log(`--- calculateArmor() called ---`);
        
        const inventoryType = this.owner.InventoryType.get();
        const subclass = this.owner.Class.getSubclass();
        const itemLevel = this.owner.ItemLevel.get();
        const quality = this.owner.Quality.get();
        const bonusArmor = this.owner.BonusArmor.get();

        ItemAttributes.log(`Inputs: inventoryType=${inventoryType}, subclass=${subclass}, itemLevel=${itemLevel}, quality=${quality}, bonusArmor=${bonusArmor}`);

        const slotData = armorClass[inventoryType];
        if (!slotData || slotData.armorMod <= 0) {
            ItemAttributes.log(`ERROR: No slot data found or armorMod <= 0. slotData=${slotData ? 'exists' : 'null'}, armorMod=${slotData?.armorMod}`);
            return;
        }

        ItemAttributes.log(`Found slot data: ${slotData.name || 'unnamed'}, armorMod=${slotData.armorMod}`);

        const slotMod = slotData.armorMod;
        const qualityArmor = armorData[quality];
        if (!qualityArmor) {
            ItemAttributes.log(`ERROR: No armor data found for quality=${quality}`);
            return;
        }

        ItemAttributes.log(`Found quality armor data for quality ${quality}`);

        const armorTypeName = getArmorTypeName(subclass);
        ItemAttributes.log(`Armor type name: ${armorTypeName}`);
        
        const baseFn = qualityArmor[armorTypeName];
        if (!baseFn) {
            ItemAttributes.log(`ERROR: No base function found for armorTypeName=${armorTypeName}`);
            return;
        }

        const baseValue = baseFn(itemLevel);
        ItemAttributes.log(`baseValue: ${baseValue}`);
        
        if (baseValue === undefined || baseValue === null) {
            ItemAttributes.log(`ERROR: baseValue is undefined or null`);
            return;
        }

        const totalArmor = Math.max(Math.ceil(baseValue * slotMod), 0) + bonusArmor;
        ItemAttributes.log(`Calculated totalArmor: ${totalArmor} (baseValue=${baseValue} * slotMod=${slotMod} = ${baseValue * slotMod}, + bonusArmor=${bonusArmor})`);
        
        const oldArmor = this.owner.Armor.get();
        this.owner.Armor.set(totalArmor);
        ItemAttributes.log(`Armor changed from ${oldArmor} to ${this.owner.Armor.get()}`);
    }

    private calculateDamage(): void {
        ItemAttributes.log(`--- calculateDamage() called ---`);
        
        const inventoryType = this.owner.InventoryType.get();
        const subclass = this.owner.Class.getSubclass();
        const itemLevel = this.owner.ItemLevel.get();
        const quality = this.owner.Quality.get();
        const delay = this.owner.Delay.get();

        ItemAttributes.log(`Inputs: inventoryType=${inventoryType}, subclass=${subclass}, itemLevel=${itemLevel}, quality=${quality}, delay=${delay}`);

        const oldDamage = this.owner.Damage.get(0);
        ItemAttributes.log(`Current damage before calculation: ${oldDamage ? `${oldDamage.Min.get()}-${oldDamage.Max.get()}` : 'None'}`);

        const baseDps = (() => {
            ItemAttributes.log(`Looking up baseDps in weaponDPS[${quality}][${inventoryType}]`);
            const array = weaponDPS[quality];
            if (!array) {
                ItemAttributes.log(`ERROR: No weaponDPS array found for quality=${quality}`);
                return null;
            }
            if (!array[inventoryType]) {
                ItemAttributes.log(`ERROR: No weaponDPS data found for inventoryType=${inventoryType} in quality ${quality}`);
                return null;
            }
            const data = array[inventoryType];
            ItemAttributes.log(`Found ${data.length} entries for this inventory type`);
            
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                ItemAttributes.log(`  Checking row ${i}: sub=${JSON.stringify(row.sub)}, min=${row.min}, max=${row.max}, type=${row.type || 'null'}`);
                
                // Match loothaven logic: row.sub === null || (Array.isArray(row.sub) && row.sub.some((s) => s >= 0 && s === sub || s < 0 && s !== -sub)) || row.sub === sub
                // However, the third condition doesn't handle negative values correctly, so we need to fix it
                let subMatch = false;
                if (row.sub === null) {
                    subMatch = true;
                    ItemAttributes.log(`    subMatch: true (sub is null, matches all)`);
                } else if (Array.isArray(row.sub)) {
                    subMatch = row.sub.some((s: number) => {
                        const match = (s >= 0 && s === subclass) || (s < 0 && s !== -subclass);
                        ItemAttributes.log(`      Array element ${s}: (${s >= 0 && s === subclass} || ${s < 0 && s !== -subclass}) = ${match}`);
                        return match;
                    });
                    ItemAttributes.log(`    subMatch: ${subMatch} (sub is array)`);
                } else {
                    // For non-array, non-null values
                    if (row.sub < 0) {
                        // Negative value means "match all EXCEPT this subclass"
                        // So -10 means "match all except subclass 10"
                        // For subclass 5: -10 !== -5 is true, so it matches
                        subMatch = row.sub !== -subclass;
                        ItemAttributes.log(`    subMatch: ${subMatch} (negative value ${row.sub}: matches all except ${-row.sub}, subclass ${subclass} is ${row.sub === -subclass ? 'excluded' : 'included'})`);
                    } else {
                        // Positive value means exact match
                        subMatch = row.sub === subclass;
                        ItemAttributes.log(`    subMatch: ${subMatch} (exact match: ${row.sub} === ${subclass})`);
                    }
                }
                
                const levelMatch = itemLevel >= row.min && itemLevel < row.max;
                ItemAttributes.log(`    levelMatch: ${levelMatch} (${itemLevel} >= ${row.min} && ${itemLevel} < ${row.max})`);
                
                if (subMatch && levelMatch) {
                    const dps = row.mod(itemLevel);
                    ItemAttributes.log(`    MATCH! Calculated baseDps: ${dps}`);
                    return dps;
                }
            }
            ItemAttributes.log(`ERROR: No matching row found for baseDps calculation`);
            return null;
        })();

        if (baseDps === null) {
            ItemAttributes.log(`ERROR: baseDps is null, cannot calculate damage`);
            return;
        }

        ItemAttributes.log(`baseDps: ${baseDps}`);

        const coefficient = (() => {
            ItemAttributes.log(`Looking up coefficient in weaponDamageMod`);
            ItemAttributes.log(`Searching for: type=${inventoryType}, sub=${subclass}, quality=${quality}, level=${itemLevel}`);
            
            const matchingEntry = weaponDamageMod.find(
                (entry: any) => {
                    const typeMatch = Array.isArray(entry.type) ? entry.type.includes(inventoryType) : entry.type === inventoryType;
                    const subMatch = entry.sub === null || (Array.isArray(entry.sub) ? entry.sub.includes(subclass) : entry.sub === subclass);
                    const qualityMatch = Array.isArray(entry.quality) ? entry.quality.includes(quality) : entry.quality === quality;
                    const levelMatch = itemLevel >= entry.min && itemLevel <= entry.max;
                    
                    ItemAttributes.log(`  Entry: typeMatch=${typeMatch} (entry.type=${JSON.stringify(entry.type)}), subMatch=${subMatch} (entry.sub=${JSON.stringify(entry.sub)}), qualityMatch=${qualityMatch} (entry.quality=${JSON.stringify(entry.quality)}), levelMatch=${levelMatch} (${entry.min}-${entry.max})`);
                    
                    return typeMatch && subMatch && qualityMatch && levelMatch;
                }
            );
            
            if (matchingEntry) {
                ItemAttributes.log(`Found matching coefficient: ${matchingEntry.mod}`);
                return matchingEntry.mod;
            } else {
                ItemAttributes.log(`ERROR: No matching coefficient found`);
                return null;
            }
        })();

        if (coefficient === null) {
            ItemAttributes.log(`ERROR: coefficient is null, cannot calculate damage`);
            return;
        }

        ItemAttributes.log(`coefficient: ${coefficient}`);

        const attackSpeed = delay ? delay : (weaponSubClass[subclass] ? weaponSubClass[subclass].delay(inventoryType) : 2000);
        ItemAttributes.log(`attackSpeed: ${attackSpeed} (delay=${delay}, weaponSubClass[${subclass}]=${weaponSubClass[subclass] ? 'exists' : 'null'})`);

        // For now, assume not a caster weapon (could be enhanced later)
        const effectiveDps = baseDps;
        ItemAttributes.log(`effectiveDps: ${effectiveDps}`);

        const minDamage = effectiveDps * (attackSpeed / 1000) * (1 - coefficient / 2);
        const maxDamage = effectiveDps * (attackSpeed / 1000) * (1 + coefficient / 2);
        ItemAttributes.log(`Calculated damage: min=${minDamage}, max=${maxDamage}`);
        ItemAttributes.log(`  Formula: min = ${effectiveDps} * (${attackSpeed} / 1000) * (1 - ${coefficient} / 2) = ${minDamage}`);
        ItemAttributes.log(`  Formula: max = ${effectiveDps} * (${attackSpeed} / 1000) * (1 + ${coefficient} / 2) = ${maxDamage}`);

        const minDamageRounded = Math.ceil(minDamage);
        const maxDamageRounded = Math.ceil(maxDamage);
        ItemAttributes.log(`Rounded damage: min=${minDamageRounded}, max=${maxDamageRounded}`);

        // Clear existing damage and add new damage
        ItemAttributes.log(`Clearing existing damage`);
        this.owner.Damage.clearAll();
        
        ItemAttributes.log(`Adding new damage: ${minDamageRounded}-${maxDamageRounded}`);
        this.owner.Damage.addPhysical(minDamageRounded, maxDamageRounded);
        
        // Verify what was actually set
        const newDamage = this.owner.Damage.get(0);
        ItemAttributes.log(`Verification - Damage after setting: ${newDamage ? `${newDamage.Min.get()}-${newDamage.Max.get()}` : 'None'}`);
        if (newDamage) {
            ItemAttributes.log(`  Min: ${newDamage.Min.get()}, Max: ${newDamage.Max.get()}, School: ${newDamage.School.get()}`);
        }
    }
}
