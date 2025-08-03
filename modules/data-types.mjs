/**
 * @typedef TechBase
 * @type {"Inner Sphere" | "Clan" | "Mixed"}
 */
export const TechBase = Object.freeze({
  InnerSphere: "Inner Sphere",
  Clan: "Clan",
  Mixed: "Mixed",
});

/**
 * @typedef HeatSinkType
 * @type {"Single" | "Double"}
 */
export const HeatSinkType = Object.freeze({
  Single: "Single",
  Double: "Double",
});

/**
 * @typedef BayLocation
 * @type {"Nose" | "Wing" | "Aft" | "Bomb"}
 */
export const BayLocations = Object.freeze({
  Nose: "Nose",
  Wing: "Wing",
  Aft: "Aft",
  Bomb: "Bomb",
});

/**
 * @typedef WeaponRange
 * @type {"Short" | "Medium" | "Long" | "Extreme" | "Bomb"}
 */
export const WeaponRanges = Object.freeze({
  Short: "Short",
  Medium: "Medium",
  Long: "Long",
  Extreme: "Extreme",
  Bomb: "Bomb",
});

/**
 * @typedef Squadron
 * @type {object}
 * @property {string} name
 * @property {TechBase} techBase
 * @property {Fighter[]} fighters
 */

/**
 * @type {Readonly<Squadron>}
 */
const DefaultSquadron = Object.freeze({
  name: "",
  techBase: TechBase.InnerSphere,
  fighters: [],
});

/**
 * @typedef Fighter
 * @type {object}
 * @property {string} name
 * @property {number} safeThrust
 * @property {number} maxThrust
 * @property {number} totalArmor
 * @property {number} armorDamage
 * @property {number} structuralIntegrity
 * @property {number} structuralIntegrityDamage
 * @property {number} heatSinks
 * @property {HeatSinkType} heatSinkType
 * @property {number} fuel
 * @property {number} gunnery
 * @property {number} piloting
 * @property {number} engineCriticals
 * @property {number} avionicsCriticals
 * @property {number} sensorsCriticals
 * @property {number} fireControlSystemCriticals
 * @property {number} lifeSupportCriticals
 * @property {number} pilotCriticals
 * @property {WeaponBay[]} bays
 * @property {BombBays} bombs
 */

/**
 * @type {Readonly<Fighter>}
 */
const DefaultFighter = Object.freeze({
  name: "",
  safeThrust: 0,
  maxThrust: 0,
  totalArmor: 0,
  armorDamage: 0,
  structuralIntegrity: 0,
  structuralIntegrityDamage: 0,
  heatSinks: 0,
  heatSinkType: HeatSinkType.Single,
  fuel: 0,
  gunnery: 0,
  piloting: 0,
  engineCriticals: 0,
  avionicsCriticals: 0,
  sensorsCriticals: 0,
  fireControlSystemCriticals: 0,
  lifeSupportCriticals: 0,
  pilotCriticals: 0,
  bays: [],
  bombs: {},
});

/**
 * @typedef WeaponBay
 * @type {object}
 * @property {string} name
 * @property {BayLocation} location
 * @property {number} heat
 * @property {number} damage
 * @property {number} count
 * @property {WeaponRange} range
 */

/**
 * @type {Readonly<WeaponBay>}
 */
const DefaultBay = Object.freeze({
  name: "",
  location: BayLocations.Nose,
  heat: 0,
  damage: 0,
  count: 0,
  range: WeaponRanges.Short,
});

/**
 * @typedef BombBays
 * @type {object}
 * @property {WeaponBay} heBombs
 * @property {WeaponBay} laserGuidedBombs
 * @property {WeaponBay} clusterBombs
 * @property {WeaponBay} rocketPods
 * @property {WeaponBay} tags
 */

/**
 * @type {Readonly<BombBays>}
 */
const DefaultBombBays = Object.freeze({
  heBombs: Object.freeze({
    name: "HE",
    location: BayLocations.Bomb,
    heat: 0,
    damage: 10,
    count: 0,
    range: WeaponRanges.Bomb,
  }),
  laserGuidedBombs: Object.freeze({
    name: "Laser Guided",
    location: BayLocations.Bomb,
    heat: 0,
    damage: 10,
    count: 0,
    range: WeaponRanges.Bomb,
  }),
  clusterBombs: Object.freeze({
    name: "Cluster",
    location: BayLocations.Bomb,
    heat: 0,
    damage: 5,
    count: 0,
    range: WeaponRanges.Bomb,
  }),
  rocketPods: Object.freeze({
    name: "RL 10",
    location: BayLocations.Bomb,
    heat: 0,
    damage: 6,
    count: 0,
    range: WeaponRanges.Medium,
  }),
  tags: Object.freeze({
    name: "Tag",
    location: BayLocations.Bomb,
    heat: 0,
    damage: 0,
    count: 0,
    range: WeaponRanges.Bomb,
  }),
});

/**
 * @typedef SquadronBay
 * @type {object}
 * @property {string} name
 * @property {BayLocation} location
 * @property {number} startingWeaponCount
 * @property {number} currentWeaponCount
 * @property {number} attackValue
 * @property {number} heatTotal
 * @property {number} heatPer
 * @property {WeaponRange} rangeBracket
 */

/**
 * @type {Readonly<SquadronBay>}
 */
const DefaultSquadronBay = Object.freeze({
  name: "None",
  location: BayLocations.Nose,
  startingWeaponCount: 0,
  currentWeaponCount: 0,
  attackValue: 0,
  heatTotal: 0,
  heatPer: 0,
  rangeBracket: WeaponRanges.Short,
});

/**
 * Creates a Squadron object (null passed in) or populates an existing SquadronData object with
 * any missing values
 * @param {?Squadron} data
 * @returns {!Squadron} A Squadron object
 */
export function AssignSquadronDataDefaults(data) {
  return {
    ...DefaultSquadron,
    ...data,
    fighters: [
      AssignFighterDataDefaults(data?.fighters[0]),
      AssignFighterDataDefaults(data?.fighters[1]),
      AssignFighterDataDefaults(data?.fighters[2]),
      AssignFighterDataDefaults(data?.fighters[3]),
      AssignFighterDataDefaults(data?.fighters[4]),
      AssignFighterDataDefaults(data?.fighters[5]),
    ],
  };
}

/**
 * Creates a Fighter object (null passed in) or populates an existing Fighter object with
 * any missing values
 * @param {?Fighter} data
 * @returns {!Fighter} A Fighter object
 */
export function AssignFighterDataDefaults(data) {
  let fighter = {
    ...DefaultFighter,
    bays: [],
    ...data,
  };

  const bays = Array.isArray(data?.bays) ? data.bays : [];

  for (let i = 0; i < bays.length; i++) {
    fighter.bays[i] = AssignFighterBayDefaults(bays[i]);
  }

  if (fighter.bays.length == 0) {
    fighter.bays.push(AssignFighterBayDefaults(undefined));
  }

  fighter.bombs = AssignFighterBombBayDefaults(fighter.bombs);

  return fighter;
}

/**
 * Creates a WeaponBay object (null passed in) or populates an existing WeaponBay object with
 * any missing values
 * @param {?WeaponBay} data
 * @returns {!WeaponBay} A WeaponBay object
 */
export function AssignFighterBayDefaults(data) {
  return {
    ...DefaultBay,
    ...data,
  };
}

/**
 * Creates a BombBays array or populates an existing BombBays array with
 * any missing values
 * @param {?BombBays} data
 * @returns {!BombBays} A BombBays object
 */
export function AssignFighterBombBayDefaults(data) {
  let bombBays = { ...data };

  for (const bombName in DefaultBombBays) {
    bombBays[bombName] = AssignFighterBayDefaults({
      ...DefaultBombBays[bombName],
      ...bombBays[bombName],
    });
  }

  return bombBays;
}

/**
 * Creates a SquadronBay object (null passed in) or populates an existing SquadronBay object with
 * any missing values
 * @param {?SquadronBay} data
 * @returns {!SquadronBay}
 */
export function AssignSquadronBayDefaults(data) {
  return {
    ...DefaultSquadronBay,
    ...data,
  };
}
