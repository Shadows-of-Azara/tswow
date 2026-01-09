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

interface DataFilterEntry {
    quality: number;
    min: number;
    mod: number;
}

function dataFilter(quality: number, lvl: number, data: DataFilterEntry[]): number | null {
    for (const set of data) {
        if (quality === set.quality && set.min <= lvl) {
            return set.mod;
        }
    }
    return null;
}

function qC(lvl: number, mult: number, base: number): number {
    return lvl * mult + base;
}

export const exponent: number = Math.log(2) / Math.log(1.5);
export const exponentInverse: number = 1 / exponent;

export const armorClass: { [key: number]: any } = {
    1: {
        name: "Head",
        sellMod: 12 / 16,
        armorMod: 13 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 16 / 16 },
                { quality: 3, min: 1, mod: 16 / 16 },
                { quality: 2, min: 1, mod: 16 / 16 },
            ]),
    },
    2: {
        name: "Neck",
        sellMod: 8 / 16,
        armorMod: 0,
        itemClass: 4,
        subClass: [0],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 4 / 16 },
                { quality: 3, min: 1, mod: 4 / 16 },
                { quality: 2, min: 1, mod: 4 / 16 },
            ]),
    },
    3: {
        name: "Shoulder",
        sellMod: 12 / 16,
        armorMod: 12 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 8 / 16 },
                { quality: 3, min: 1, mod: 8 / 16 },
                { quality: 2, min: 1, mod: 8 / 16 },
            ]),
    },
    4: {
        name: "Shirt",
        sellMod: 4 / 16,
        armorMod: 0,
        itemClass: 4,
        subClass: [1],
        slotMod: 1 / 32,
    },
    5: {
        name: "Chest",
        sellMod: 16 / 16,
        armorMod: 16 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: 16 / 16,
    },
    6: {
        name: "Waist",
        sellMod: 8 / 16,
        armorMod: 9 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 8 / 16 },
                { quality: 3, min: 1, mod: 8 / 16 },
                { quality: 2, min: 1, mod: 8 / 16 },
            ]),
    },
    7: {
        name: "Legs",
        sellMod: 16 / 16,
        armorMod: 14 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: 16 / 16,
    },
    8: {
        name: "Feet",
        sellMod: 12 / 16,
        armorMod: 11 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 8 / 16 },
                { quality: 3, min: 1, mod: 8 / 16 },
                { quality: 2, min: 1, mod: 8 / 16 },
            ]),
    },
    9: {
        name: "Wrists",
        sellMod: 8 / 16,
        armorMod: 7 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 4 / 16 },
                { quality: 3, min: 1, mod: 4 / 16 },
                { quality: 2, min: 1, mod: 4 / 16 },
            ]),
    },
    10: {
        name: "Hands",
        sellMod: 8 / 16,
        armorMod: 10 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 8 / 16 },
                { quality: 3, min: 1, mod: 8 / 16 },
                { quality: 2, min: 1, mod: 8 / 16 },
            ]),
    },
    11: {
        name: "Finger",
        sellMod: 8 / 16,
        armorMod: 0,
        itemClass: 4,
        subClass: [0],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 4 / 16 },
                { quality: 3, min: 1, mod: 4 / 16 },
                { quality: 2, min: 1, mod: 4 / 16 },
            ]),
    },
    12: {
        name: "Trinket",
        sellMod: 28 / 16,
        armorMod: 0,
        itemClass: 4,
        subClass: [0],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 8 / 16 },
                { quality: 3, min: 1, mod: 8 / 16 },
                { quality: 2, min: 1, mod: 8 / 16 },
            ]),
    },
    14: {
        name: "Shield",
        sellMod: 15 / 16,
        armorMod: 16 / 16,
        itemClass: 4,
        subClass: [6],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 4 / 16 },
                { quality: 3, min: 1, mod: 4 / 16 },
                { quality: 2, min: 1, mod: 4 / 16 },
            ]),
    },
    16: {
        name: "Back",
        sellMod: 12 / 16,
        armorMod: 8 / 16,
        itemClass: 4,
        subClass: [1],
        slotMod: (quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 4 / 16 },
                { quality: 3, min: 1, mod: 4 / 16 },
                { quality: 2, min: 80, mod: 4 / 16 },
                { quality: 2, min: 1, mod: 3 / 16 },
            ]),
    },
    19: {
        name: "Tabard",
        sellMod: 4 / 16,
        armorMod: 0,
        itemClass: 4,
        subClass: [0],
        slotMod: 1 / 32,
    },
    20: {
        name: "Chest (Robe)",
        sellMod: 16 / 16,
        armorMod: 16 / 16,
        itemClass: 4,
        subClass: [1, 2, 3, 4],
        slotMod: 16 / 16,
    },
    23: {
        name: "Held Off-hand",
        sellMod: 8 / 16,
        armorMod: 0,
        itemClass: 4,
        subClass: [0],
        slotMod: 3 / 16,
    },
    28: {
        name: "Relic",
        sellMod: 4 / 16,
        armorMod: 0,
        itemClass: 4,
        subClass: [7, 8, 9, 10],
        slotMod: 1 / 32,
    },
};

export const weaponClass: { [key: number]: any } = {
    13: {
        name: "One-Hand",
        sellMod: 7 / 16,
        slotMod: 2 / 16,
        armorMod: 0,
        itemClass: 2,
        subClass: [0, 4, 7, 15, 13],
    },
    15: {
        name: "Bow",
        sellMod: 16 / 16,
        slotMod: 16 / 16,
        armorMod: 0,
        itemClass: 2,
        subClass: [2],
    },
    17: {
        name: "Two-Hand",
        sellMod: 16 / 16,
        slotMod: 16 / 16,
        armorMod: 0,
        itemClass: 2,
        subClass: [1, 5, 8, 6, 10],
    },
    21: {
        name: "Main-Hand",
        sellMod: 7 / 16,
        slotMod: 2 / 16,
        armorMod: 0,
        itemClass: 2,
        subClass: [0, 4, 7, 15, 13],
    },
    22: {
        name: "Off-Hand",
        sellMod: 7 / 16,
        slotMod: 2 / 16,
        armorMod: 0,
        itemClass: 2,
        subClass: [0, 4, 7, 15, 13],
    },
    25: {
        name: "Thrown",
        sellMod: 5 / 16,
        slotMod: 5 / 16,
        armorMod: 0,
        itemClass: 2,
        subClass: [16],
    },
    26: {
        name: "Ranged",
        sellMod: 5 / 16,
        slotMod: 5 / 16,
        armorMod: 0,
        itemClass: 2,
        subClass: [3, 18, 19],
    },
};

export const qualityCoefficients: { [key: number]: any } = {
    4: {
        name: "epic",
        sellValue: (lvl: number) => 10000 + 600 * lvl + Math.pow(0.16 * lvl, 2),
        calc: (lvl: number) => {
            if (lvl >= 1) return qC(lvl, 0.689, 1);
            return 0;
        },
    },
    3: {
        name: "rare",
        sellValue: (lvl: number) => 500 + 525 * lvl,
        calc: (lvl: number) => {
            if (lvl >= 1) return qC(lvl, 0.641, -4);
            return 0;
        },
    },
    2: {
        name: "uncommon",
        sellValue: (lvl: number) => 439 * lvl,
        calc: (lvl: number) => {
            if (lvl >= 1) return qC(lvl, 0.495, -2.85);
            return 0;
        },
    },
};

const weaponDelays: { [key: number]: { [key: number]: number } } = {
    0: { 21: 2400, 13: 2300, 22: 2000, 17: 3400 },
    4: { 21: 2000, 13: 2300, 22: 1500, 17: 3300 },
    7: { 21: 1900, 13: 2200, 22: 1500, 17: 3300 },
    15: { 21: 1700, 13: 1700, 22: 1600 },
    13: { 21: 2600, 13: 2000, 22: 2000 },
    6: { 17: 3200 },
    10: { 17: 2700 },
    2: { 15: 2700 },
    16: { 25: 1900 },
    3: { 26: 2700 },
    18: { 26: 2900 },
    19: { 26: 1700 },
};

export const weaponSubClass: { [key: number]: any } = {
    0: { name: "Axe", delay: (type: number) => weaponDelays[0][type] || 2400, tooltip: 1 },
    1: { name: "Axe", delay: (type: number) => weaponDelays[0][type] || 2400, tooltip: 1 },
    2: { name: "Bow", delay: (type: number) => weaponDelays[2][type] || 2700, tooltip: 0 },
    3: { name: "Gun", delay: (type: number) => weaponDelays[3][type] || 2700, tooltip: 1 },
    4: { name: "Mace", delay: (type: number) => weaponDelays[4][type] || 2000, tooltip: 1 },
    5: { name: "Mace", delay: (type: number) => weaponDelays[4][type] || 2000, tooltip: 1 },
    6: { name: "Polearm", delay: (type: number) => weaponDelays[6][type] || 3200, tooltip: 1 },
    7: { name: "Sword", delay: (type: number) => weaponDelays[7][type] || 1900, tooltip: 1 },
    8: { name: "Sword", delay: (type: number) => weaponDelays[7][type] || 1900, tooltip: 1 },
    10: { name: "Staff", delay: (type: number) => weaponDelays[10][type] || 2700, tooltip: 1 },
    13: { name: "Fist", delay: (type: number) => weaponDelays[13][type] || 2000, tooltip: 1 },
    15: { name: "Dagger", delay: (type: number) => weaponDelays[15][type] || 1700, tooltip: 1 },
    16: { name: "Thrown", delay: (type: number) => weaponDelays[16][type] || 1900, tooltip: 1 },
    18: { name: "Crossbow", delay: (type: number) => weaponDelays[18][type] || 2900, tooltip: 1 },
    19: { name: "Wand", delay: (type: number) => weaponDelays[19][type] || 1700, tooltip: 1 },
};

export const weaponDamageMod: any[] = [
    { type: [13, 15, 22, 25, 26], sub: null, quality: [2, 3, 4], min: 1, max: 140, mod: 0.54 },
    { type: 17, sub: [1, 5, 6, 8, 10], quality: [2, 3, 4], min: 1, max: 140, mod: 0.65 },
    { type: 17, sub: 10, quality: [2, 3, 4], min: 1, max: 140, mod: 0.54 },
    { type: 21, sub: null, quality: [2, 3, 4], min: 1, max: 140, mod: 0.54 },
    { type: 13, sub: 15, quality: 4, min: 1, max: 140, mod: 0.54 },
    { type: 15, sub: 2, quality: 4, min: 1, max: 140, mod: 0.54 },
    { type: 21, sub: 13, quality: [2, 3], min: 1, max: 140, mod: 0.54 },
    { type: 21, sub: 0, quality: 4, min: 1, max: 140, mod: 0.54 },
    { type: 25, sub: 16, quality: [3, 4], min: 1, max: 140, mod: 0.65 },
    { type: 26, sub: 18, quality: [3, 4], min: 1, max: 140, mod: 0.65 },
];

// Simplified weaponDPS - only including the most common entries
export const weaponDPS: any = {
    4: {
        13: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => -0.46373319610341757 + 1.948435650742608 * lvl - 0.05134655549435444 * Math.pow(lvl, 2) + 0.0006882333623959314 * Math.pow(lvl, 3) - 0.000002864536021471839 * Math.pow(lvl, 4),
        }],
        15: [{
            min: 1, max: 140, sub: 2,
            mod: (lvl: number) => -1.8160185143165526 + 0.8176011515936384 * lvl + 0.00004631966853788777 * Math.pow(lvl, 2) - 0.00002190693147532568 * Math.pow(lvl, 3) + 9.05587408850838e-8 * Math.pow(lvl, 4),
        }],
        17: [{
            type: null, min: 1, max: 140, sub: -10,
            mod: (lvl: number) => -0.7405045351583416 + 2.5291730790997162 * lvl - 0.06696995004352309 * Math.pow(lvl, 2) + 0.0009043795705405915 * Math.pow(lvl, 3) - 0.000003796542201089664 * Math.pow(lvl, 4),
        }],
        21: [{
            type: null, min: 1, max: 140, sub: null,
            mod: (lvl: number) => -0.5178790028826743 + 0.4607974744638549 * lvl + 0.0061377306628395585 * Math.pow(lvl, 2) - 0.00006505628736448377 * Math.pow(lvl, 3) + 2.70678156265153e-7 * Math.pow(lvl, 4) - 3.427754270710267e-10 * Math.pow(lvl, 5),
        }],
        22: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => -0.8154206101027381 + 0.8306900043436485 * lvl - 0.00029042355648253686 * Math.pow(lvl, 2) - 0.000009668965907691205 * Math.pow(lvl, 3) + 4.243652454960742e-8 * Math.pow(lvl, 4),
        }],
        25: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => -0.12483151990909214 + 1.605551235747681 * lvl - 0.008135377299559524 * Math.pow(lvl, 2) + 0.000023833062012799013 * Math.pow(lvl, 3),
        }],
        26: [{
            min: 1, max: 140, sub: [3, 18],
            mod: (lvl: number) => -2.9838107517317654 + 1.044765562039762 * lvl - 0.003913212784379925 * Math.pow(lvl, 2) + 6.090860438060731e-7 * Math.pow(lvl, 3) + 5.016590029076527e-8 * Math.pow(lvl, 4),
        }],
    },
    3: {
        13: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => -0.20849222965398617 + 0.5638012041071734 * lvl + 0.006185098993217638 * Math.pow(lvl, 2) - 0.00010529221983632224 * Math.pow(lvl, 3) + 4.856933421922349e-7 * Math.pow(lvl, 4),
        }],
        15: [{
            min: 1, max: 140, sub: 2,
            mod: (lvl: number) => -0.743084783011632 + 0.7736504766853647 * lvl - 0.002608641911723087 * Math.pow(lvl, 2) + 0.000008555961584640232 * Math.pow(lvl, 3),
        }],
        17: [{
            type: null, min: 1, max: 140, sub: -10,
            mod: (lvl: number) => -1.4407940637747765 + 0.9868570871805012 * lvl - 0.0023989071048527186 * Math.pow(lvl, 2) + 0.00000872913868341514 * Math.pow(lvl, 3),
        }],
        21: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => 0.7081542428231806 + 0.6667863115619928 * lvl - 0.0007860876748404416 * Math.pow(lvl, 2) + 0.000003503709149771536 * Math.pow(lvl, 3),
        }],
        22: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => 0.31862967197133674 + 0.6822091250858717 * lvl - 0.0007913172544140505 * Math.pow(lvl, 2) + 0.000003122564997039902 * Math.pow(lvl, 3),
        }],
        25: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => 0.625697055774282 + 0.8215995459019617 * lvl - 0.0005425910100895496 * Math.pow(lvl, 2) + 0.0000032710921570688796 * Math.pow(lvl, 3),
        }],
        26: [{
            min: 1, max: 140, sub: [3, 18],
            mod: (lvl: number) => -0.2913340491058385 + 0.7574162727175957 * lvl - 0.0024457905894126005 * Math.pow(lvl, 2) + 0.000008067767939268019 * Math.pow(lvl, 3),
        }],
    },
    2: {
        13: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => 0.4042050606136029 + 0.49734508151683776 * lvl + 0.0007876333296000732 * Math.pow(lvl, 2) - 0.0000013811950352316454 * Math.pow(lvl, 3),
        }],
        15: [{
            min: 1, max: 140, sub: 2,
            mod: (lvl: number) => 0.22444917005698017 + 0.5822163577210446 * lvl - 0.0006990769934425673 * Math.pow(lvl, 2) + 0.0000024109481894875313 * Math.pow(lvl, 3),
        }],
        17: [{
            type: null, min: 1, max: 140, sub: null,
            mod: (lvl: number) => -1.2469017714620838 + 0.7595359183093786 * lvl - 0.00052 * Math.pow(lvl, 2) + 0.0000031790771502211193 * Math.pow(lvl, 3),
        }],
        21: [{
            type: null, min: 1, max: 140, sub: null,
            mod: (lvl: number) => 0.1888986564358558 + 0.514467630955437 * lvl + 0.0001449871791498711 * Math.pow(lvl, 2) + 0.0000022300382306673762 * Math.pow(lvl, 3),
        }],
        22: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => 0.9718419506869891 + 0.41682208197155196 * lvl + 0.001587412068902008 * Math.pow(lvl, 2) - 0.0000030964817997803457 * Math.pow(lvl, 3),
        }],
        25: [{
            min: 1, max: 140, sub: null,
            mod: (lvl: number) => 2.766343576702119 + 0.46057309703714083 * lvl + 0.0031338924726831943 * Math.pow(lvl, 2) - 0.000008297133052168907 * Math.pow(lvl, 3),
        }],
        26: [{
            min: 1, max: 140, sub: [3, 18],
            mod: (lvl: number) => 1.4129016032445012 + 0.4961550555995297 * lvl + 0.00032039463941715415 * Math.pow(lvl, 2) - 8.224505599804983e-7 * Math.pow(lvl, 3),
        }],
    },
};

export const armorData: any = {
    4: {
        Cloth: (lvl: number) => 2.5281010518232847 + 1.331747228269099 * lvl + 0.00944593034412355 * Math.pow(lvl, 2) - 0.00006849549050619422 * Math.pow(lvl, 3) + 1.2354987243172888e-7 * Math.pow(lvl, 4),
        Leather: (lvl: number) => 1.5555029361141006 + 3.0358551084632817 * lvl + 0.010441421831956765 * Math.pow(lvl, 2) - 0.00009593877599476476 * Math.pow(lvl, 3) + 1.8476622137336274e-7 * Math.pow(lvl, 4),
        Mail: (lvl: number) => -7.5320987581173 + 9.77641667353662 * lvl - 0.07509546031114869 * Math.pow(lvl, 2) + 0.0008277573203410827 * Math.pow(lvl, 3) - 0.000003968983245793348 * Math.pow(lvl, 4) + 6.374377745994348e-9 * Math.pow(lvl, 5),
        Plate: (lvl: number) => 5.102460977820272 + 9.509093276356396 * lvl + 0.07993511436723227 * Math.pow(lvl, 2) - 0.0005654807309686971 * Math.pow(lvl, 3) + 0.0000010185213184327804 * Math.pow(lvl, 4),
        Shield: (lvl: number) => -68.32056773225723 + 52.05238254766441 * lvl - 0.2633818416382036 * Math.pow(lvl, 2) + 0.0032416668345449868 * Math.pow(lvl, 3) - 0.000017286124455117578 * Math.pow(lvl, 4) + 2.9484202941863735e-8 * Math.pow(lvl, 5),
    },
    3: {
        Cloth: (lvl: number) => -1.3423883493277042 + 2.200587627369824 * lvl - 0.023452920240817212 * Math.pow(lvl, 2) + 0.0002057092987396633 * Math.pow(lvl, 3) - 5.346376377648381e-7 * Math.pow(lvl, 4),
        Leather: (lvl: number) => -4.3185941880426775 + 5.22367821032947 * lvl - 0.06638307153372526 * Math.pow(lvl, 2) + 0.0005313187225831865 * Math.pow(lvl, 3) - 0.0000013052892289727186 * Math.pow(lvl, 4),
        Mail: (lvl: number) => 31.445856660984333 + 8.055343208054605 * lvl - 0.08529020006193702 * Math.pow(lvl, 2) + 0.0007948792659050846 * Math.pow(lvl, 3) - 0.0000021078789263816906 * Math.pow(lvl, 4),
        Plate: (lvl: number) => -28.396604349521805 + 16.329061088393786 * lvl - 0.16567265946139803 * Math.pow(lvl, 2) + 0.0014420657876884682 * Math.pow(lvl, 3) - 0.000003730547431550686 * Math.pow(lvl, 4),
        Shield: (lvl: number) => -44.06927830732479 + 60.18645188729204 * lvl - 4.54601783641102 * Math.pow(lvl, 2) + 0.19213407170465685 * Math.pow(lvl, 3) - 0.003571960126176484 * Math.pow(lvl, 4) + 0.00003452904159703563 * Math.pow(lvl, 5) - 1.8099081604737638e-7 * Math.pow(lvl, 6) + 4.887914417526831e-10 * Math.pow(lvl, 7) - 5.340719565656609e-13 * Math.pow(lvl, 8),
    },
    2: {
        Cloth: (lvl: number) => 8.528248246851293 + 1.13588900743772 * lvl + 0.00018480865552209587 * Math.pow(lvl, 2),
        Leather: (lvl: number) => 39.0574346793 + 1.8042785077 * lvl + 0.0014831968 * Math.pow(lvl, 2),
        Mail: (lvl: number) => 74.58060541262037 + 3.93396431596397 * lvl + 0.004366253997171184 * Math.pow(lvl, 2),
        Plate: (lvl: number) => -8.953978248173765 + 9.748506027592633 * lvl - 0.003686683605302056 * Math.pow(lvl, 2),
        Shield: (lvl: number) => 82.22823 + 29.92042 * lvl - 0.01284 * Math.pow(lvl, 2) + 0.00007097724866192495 * Math.pow(lvl, 3),
    },
};

const armorSubClass: { [key: number]: any } = {
    0: { name: "Miscellaneous", sellMod: 28 / 16, tooltip: 0 },
    1: { name: "Cloth", sellMod: 9 / 16, tooltip: 1 },
    2: { name: "Leather", sellMod: 11 / 16, tooltip: 1 },
    3: { name: "Mail", sellMod: 14 / 16, tooltip: 1 },
    4: { name: "Plate", sellMod: 16 / 16, tooltip: 1 },
    6: { name: "Shield", sellMod: 16 / 16, tooltip: 0 },
    7: { name: "Libram", sellMod: 16 / 16, tooltip: 1 },
    8: { name: "Idol", sellMod: 16 / 16, tooltip: 1 },
    9: { name: "Totem", sellMod: 16 / 16, tooltip: 1 },
    10: { name: "Sigil", sellMod: 16 / 16, tooltip: 1 },
};

export function getArmorTypeName(subclass: number): string {
    if (subclass === 6) return "Shield";
    if (subclass === 1) return "Cloth";
    if (subclass === 2) return "Leather";
    if (subclass === 3) return "Mail";
    if (subclass === 4) return "Plate";
    return "Cloth"; // Default
}

export const itemStats: { [key: string | number]: any } = {
    armor: {
        name: "Bonus Armor",
        type: 3,
        statMod: (_slot: number, quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 2 / 32 },
                { quality: 3, min: 1, mod: 3 / 32 },
                { quality: 2, min: 1, mod: 3 / 32 },
            ]),
    },
    7: {
        name: "Stamina",
        type: 0,
        statMod: (_slot: number, quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 2 / 3 },
                { quality: 3, min: 1, mod: 2 / 3 },
                { quality: 2, min: 1, mod: 2 / 3 },
            ]),
    },
    43: {
        name: "Mana Regen MP5",
        type: 1,
        statMod: (slot: number, quality: number, lvl: number) =>
            dataFilter(quality, lvl, [2, 11, 12, 23].includes(slot)
                ? [
                    { quality: 4, min: 1, mod: 32 / 16 },
                    { quality: 3, min: 1, mod: 48 / 16 },
                    { quality: 2, min: 1, mod: 48 / 16 },
                ]
                : [
                    { quality: 4, min: 1, mod: 32 / 16 },
                    { quality: 3, min: 1, mod: 92 / 32 },
                    { quality: 2, min: 1, mod: 92 / 32 },
                ]),
    },
    45: {
        name: "Spell Power",
        type: 1,
        statMod: (_slot: number, quality: number, lvl: number) =>
            dataFilter(quality, lvl, [
                { quality: 4, min: 1, mod: 55 / 64 },
                { quality: 3, min: 1, mod: 55 / 64 },
                { quality: 2, min: 1, mod: 45 / 64 },
            ]),
    },
    46: {
        name: "Health Regen HP5",
        type: 1,
        statMod: (slot: number, quality: number, lvl: number) =>
            dataFilter(quality, lvl, [2, 11, 12, 23].includes(slot)
                ? [
                    { quality: 4, min: 1, mod: 16 / 16 },
                    { quality: 3, min: 1, mod: 32 / 16 },
                    { quality: 2, min: 1, mod: 32 / 16 },
                ]
                : [
                    { quality: 4, min: 1, mod: 32 / 16 },
                    { quality: 3, min: 1, mod: 64 / 16 },
                    { quality: 2, min: 1, mod: 64 / 16 },
                ]),
    },
    48: {
        name: "Block Value",
        type: 1,
        statMod: (slot: number, quality: number, lvl: number) =>
            dataFilter(quality, lvl, [2, 11, 12, 14].includes(slot)
                ? [
                    { quality: 4, min: 1, mod: 21 / 64 },
                    { quality: 3, min: 1, mod: 21 / 64 },
                    { quality: 2, min: 1, mod: 16 / 16 },
                ]
                : [
                    { quality: 4, min: 1, mod: 21 / 64 },
                    { quality: 3, min: 1, mod: 21 / 64 },
                    { quality: 2, min: 1, mod: 16 / 16 },
                ]),
    },
    3: { name: "Agility", type: 0, statMod: 16 / 16 },
    4: { name: "Strength", type: 0, statMod: 8 / 16 },
    5: { name: "Intellect", type: 0, statMod: 8 / 16 },
    6: { name: "Spirit", type: 0, statMod: 16 / 16 },
    12: { name: "Defense Rating", type: 1, statMod: 16 / 16 },
    13: { name: "Dodge Rating", type: 1, statMod: 16 / 16 },
    14: { name: "Parry Rating", type: 1, statMod: 16 / 16 },
    15: { name: "Block Rating", type: 1, statMod: 16 / 16 },
    21: { name: "Spell Crit Rating", type: 1, statMod: 16 / 16 },
    31: { name: "Hit Rating", type: 1, statMod: 16 / 16 },
    32: { name: "Crit Rating", type: 1, statMod: 16 / 16 },
    35: { name: "Resilience", type: 1, statMod: 16 / 16 },
    36: { name: "Haste Rating", type: 1, statMod: 16 / 16 },
    37: { name: "Expertise Rating", type: 1, statMod: 16 / 16 },
    38: { name: "Attack Power", type: 1, statMod: 8 / 16 },
    44: { name: "Armor Penetration Rating", type: 1, statMod: 16 / 16 },
    47: { name: "Spell Penetration", type: 1, statMod: 12 / 16 },
    arcane_res: { name: "Resist Arcane", type: 0, statMod: 16 / 16 },
    fire_res: { name: "Resist Fire", type: 0, statMod: 16 / 16 },
    nature_res: { name: "Resist Nature", type: 0, statMod: 16 / 16 },
    frost_res: { name: "Resist Frost", type: 0, statMod: 16 / 16 },
    shadow_res: { name: "Resist Shadow", type: 0, statMod: 16 / 16 },
};
