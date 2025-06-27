export const TechBase = Object.freeze({
  InnerSphere: "Inner Sphere",
  Clan: "Clan",
  Mixed: "Mixed",
});

export const HeatSinkType = Object.freeze({
  Single: "Single",
  Double: "Double",
});

export const BayLocations = Object.freeze({
  Nose: "Nose",
  Wing: "Wing",
  Aft: "Aft",
  Bomb: "Bomb",
});

export const WeaponRanges = Object.freeze({
  Short: "Short",
  Medium: "Medium",
  Long: "Long",
  Extreme: "Extreme",
});

const DefaultSquadron = Object.freeze({
  name: "",
  techBase: TechBase.InnerSphere,
  fighters: [],
});

const DefaultFighter = Object.freeze({
  name: "",
  safeThrust: 0,
  maxThrust: 0,
  totalArmor: 0,
  structuralIntegrity: 0,
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
});

const DefaultBay = Object.freeze({
  name: "",
  location: BayLocations.Nose,
  heat: 0,
  damage: 0,
});

/**
 * Creates a SquadronData object (null passed in) or populates an existing SquadronData object with
 * any missing values
 * @param {SquadronData} data
 * @returns A SquadronData object
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
 * Creates a FighterData object (null passed in) or populates an existing FighterData object with
 * any missing values
 * @param {FighterData} data
 * @returns A FighterData object
 */
export function AssignFighterDataDefaults(data) {
  let fighter = {
    ...DefaultFighter,
    ...data,
  };

  for (const bay in data?.bays) {
    fighter.bays.push(AssignFighterBayDefaults(bay));
  }

  if (fighter.bays.length == 0) {
    fighter.bays.push(AssignFighterBayDefaults(undefined));
  }

  return fighter;
}

/**
 * Creates a BayData object (null passed in) or populates an existing BayData object with
 * any missing values
 * @param {BayData} data
 * @returns A BayData object
 */
export function AssignFighterBayDefaults(data) {
  return {
    ...DefaultBay,
    ...data,
  };
}
