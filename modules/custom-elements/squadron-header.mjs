import {
  AssignSquadronDataDefaults,
  TechBase,
  BayLocations,
  HeatSinkType,
  AssignFighterBombBayDefaults,
} from "../data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

import { SquadronBaysElement } from "./squadron-weapon-bays.mjs";

import { StrCompare } from "../utilities.mjs";

/**
 * @typedef {import('../data-types.mjs').Squadron} Squadron
 * @typedef {import('../data-types.mjs').SquadronBay} SquadronBay
 * @typedef {import('../data-types.mjs').WeaponBay} WeaponBay
 * @typedef {import('../data-types.mjs').TechBase} TechBase
 *
 * @typedef SquadronStatistics
 * @type {object}
 * @property {number} gunnery
 * @property {number} piloting
 * @property {number} heatCapacity
 * @property {number} heatCapacityCurrent
 * @property {number} safeThrust
 * @property {number} maxThrust
 * @property {number} totalFuel
 * @property {number} structuralIntegrity
 * @property {SquadronBay[]} bays
 * @property {SquadronBay[]} bombs
 */

await TemplatedHtmlElement.AddTemplate(
  "SquadronHeader",
  "templates/squadron-header.html"
);

export class SquadronHeader extends TemplatedHtmlElement {
  /**
   * @type {Squadron}
   */
  squadron = AssignSquadronDataDefaults(undefined);

  constructor() {
    // Always call super first in constructor
    super("SquadronHeader");
  }

  /**
   * @type {HTMLInputElement}
   */
  nameInput;

  /**
   * @type {SquadronBaysElement}
   */
  squadronBay1;

  /**
   * @type {SquadronBaysElement}
   */
  squadronBay2;

  /**
   * @type {SquadronBaysElement}
   */
  squadronBay3;

  /**
   * @type {HTMLInputElement}
   */
  isTechBaseRadio;

  /**
   * @type {HTMLInputElement}
   */
  clanTechBaseRadio;

  /**
   * @type {HTMLInputElement}
   */
  mixedTechBaseRadio;

  connectedCallback() {
    super.connectedCallback();

    this.nameInput = this.shadowRoot.getElementById("name-input");
    this.nameInput.addEventListener("change", () => {
      this.squadron.name = this.nameInput.value;
    });

    this.squadronBay1 = this.shadowRoot.getElementById("bays-1");
    this.squadronBay2 = this.shadowRoot.getElementById("bays-2");
    this.squadronBay3 = this.shadowRoot.getElementById("bays-3");

    this.isTechBaseRadio = this.shadowRoot.getElementById("is-tech-base-radio");
    this.clanTechBaseRadio = this.shadowRoot.getElementById(
      "clan-tech-base-radio"
    );
    this.mixedTechBaseRadio = this.shadowRoot.getElementById(
      "mixed-tech-base-radio"
    );

    this.isTechBaseRadio.addEventListener("click", () => {
      if (this.isTechBaseRadio.checked) {
        this.squadron.techBase = TechBase.InnerSphere;
      }
    });

    this.clanTechBaseRadio.addEventListener("click", () => {
      if (this.clanTechBaseRadio.checked) {
        this.squadron.techBase = TechBase.Clan;
      }
    });

    this.mixedTechBaseRadio.addEventListener("click", () => {
      if (this.mixedTechBaseRadio.checked) {
        this.squadron.techBase = TechBase.Mixed;
      }
    });
  }

  Update() {
    this.nameInput.value = this.squadron.name;
    this.isTechBaseRadio.checked =
      this.squadron.techBase == TechBase.InnerSphere;
    this.clanTechBaseRadio.checked = this.squadron.techBase == TechBase.Clan;
    this.mixedTechBaseRadio.checked = this.squadron.techBase == TechBase.Mixed;

    const statistics = this.RecalculateSquadronStatistics();

    if (statistics.bays.length == 0) {
      this.squadronBay1.ResetDataBindings(undefined);
      this.squadronBay2.ResetDataBindings(undefined);
      this.squadronBay3.ResetDataBindings(undefined);
    } else {
      // Split weapons over first two squadron bays, favoring the first squadron bay
      const midpoint = Math.ceil(statistics.bays.length / 2);
      this.squadronBay1.ResetDataBindings(statistics.bays.slice(0, midpoint));
      this.squadronBay2.ResetDataBindings(
        statistics.bays.slice(midpoint, statistics.bays.length)
      );

      // Assign bombs to last squadron bay
      this.squadronBay3.ResetDataBindings(statistics.bombs);
    }

    this.shadowRoot.getElementById("gunnery-input").valueAsNumber =
      statistics.gunnery;
    this.shadowRoot.getElementById("piloting-input").valueAsNumber =
      statistics.piloting;

    this.shadowRoot.getElementById("safe-thrust-input").valueAsNumber =
      statistics.safeThrust;
    this.shadowRoot.getElementById("max-thrust-input").valueAsNumber =
      statistics.maxThrust;

    this.shadowRoot.getElementById("heat-capacity-total-input").valueAsNumber =
      statistics.heatCapacity;
    this.shadowRoot.getElementById("heat-capacity-current").valueAsNumber =
      statistics.heatCapacityCurrent;

    this.shadowRoot.getElementById("total-fuel-input").valueAsNumber =
      statistics.totalFuel;

    this.shadowRoot.getElementById("si-input").valueAsNumber =
      statistics.structuralIntegrity;
  }

  /**
   * Resets the data bindings to the squadron
   * @param {Squadron?} squadronIn
   */
  ResetDataBindings(squadronIn) {
    this.squadron = squadronIn ?? this.squadron;
    this.Update();
  }

  /**
   * Calculates the statistics of the current squadron
   * @returns {SquadronStatistics}
   */
  RecalculateSquadronStatistics() {
    const totalFighters = this.squadron.fighters.filter((fighter) => {
      if (fighter.safeThrust <= 0) return false;
      if (fighter.totalArmor <= 0) return false;
      if (fighter.structuralIntegrity <= 0) return false;

      return true;
    });

    const remainingFighters = totalFighters.filter((fighter) => {
      if (fighter.armorDamage >= fighter.totalArmor) return false;
      if (fighter.structuralIntegrityDamage >= fighter.structuralIntegrity)
        return false;

      return true;
    });

    /**
     * @type {SquadronStatistics}
     */
    const statistics = {
      gunnery: 0,
      piloting: 0,
      heatCapacity: 0,
      heatCapacityCurrent: 0,
      safeThrust: 100,
      maxThrust: 100,
      totalFuel: 10000,
      structuralIntegrity: 100,
    };

    /**
     * @type {Record<string, SquadronBay>}
     */
    const dicBays = {};

    /**
     * @type {Record<string, SquadronBay>}
     */
    const dicBombs = {};

    // Initialize Bombs
    const defaultBombs = AssignFighterBombBayDefaults(undefined);
    for (const key in defaultBombs) {
      /**
       * @type {WeaponBay}
       */
      const bomb = defaultBombs[key];
      dicBombs[bomb.name] = {
        name: bomb.name,
        location: bomb.location,
        startingWeaponCount: 0,
        currentWeaponCount: 0,
        attackValue: bomb.damage,
        heatPer: 0,
        heatTotal: 0,
        rangeBracket: bomb.range,
      };
    }

    // Calculate Totals
    for (const fighter of totalFighters) {
      // Heat Capacity
      statistics.heatCapacity +=
        fighter.heatSinks *
        (fighter.heatSinkType == HeatSinkType.Single ? 1 : 2);

      // Weapons
      for (const bay of fighter.bays) {
        const key = `${bay.name}-${bay.location}`;

        /**
         * @type {SquadronBay}
         */
        let squadronBay = dicBays[key];

        if (squadronBay == undefined) {
          squadronBay = {
            name: bay.name,
            location: bay.location,
            attackValue: bay.damage,
            heatPer: bay.heat,
            rangeBracket: bay.range,
            startingWeaponCount: 0,
            currentWeaponCount: 0,
          };

          dicBays[key] = squadronBay;
        }

        squadronBay.startingWeaponCount += bay.count;
      }
    }

    // Calculate Remaining
    for (const fighter of remainingFighters) {
      // Pilot
      statistics.gunnery += fighter.gunnery;
      statistics.piloting += fighter.piloting;

      // Thrust
      const totalBombs =
        fighter.bombs.clusterBombs.count +
        fighter.bombs.heBombs.count +
        fighter.bombs.laserGuidedBombs.count +
        fighter.bombs.rocketPods.count +
        fighter.bombs.tags.count;
      const safeThrust = fighter.safeThrust - Math.ceil(totalBombs / 5);
      const maxThrust = Math.ceil(safeThrust * 1.5);

      statistics.safeThrust = Math.min(safeThrust, statistics.safeThrust);
      statistics.maxThrust = Math.min(maxThrust, statistics.maxThrust);
      statistics.totalFuel = Math.min(fighter.fuel, statistics.totalFuel);

      // Heat
      statistics.heatCapacityCurrent +=
        fighter.heatSinks *
        (fighter.heatSinkType == HeatSinkType.Single ? 1 : 2);

      // SI
      statistics.structuralIntegrity = Math.min(
        fighter.structuralIntegrity - fighter.structuralIntegrityDamage,
        statistics.structuralIntegrity
      );

      // Weapons
      for (const bay of fighter.bays) {
        const key = `${bay.name}-${bay.location}`;

        /**
         * @type {SquadronBay}
         */
        let squadronBay = dicBays[key];

        squadronBay.currentWeaponCount += bay.count;
      }

      // Bombs
      for (const key in fighter.bombs) {
        const bomb = fighter.bombs[key];
        dicBombs[bomb.name].currentWeaponCount += bomb.count;
      }
    }

    if (remainingFighters.length > 0) {
      // Finalize gunnery and piloting
      statistics.gunnery = Math.floor(
        statistics.gunnery / remainingFighters.length
      );
      statistics.piloting = Math.floor(
        statistics.piloting / remainingFighters.length
      );
    } else {
      // Zero out non-zero values when no valid fighters exist
      statistics.gunnery = 0;
      statistics.piloting = 0;
      statistics.safeThrust = 0;
      statistics.maxThrust = 0;
      statistics.totalFuel = 0;
      statistics.structuralIntegrity = 0;
    }

    // Weapons Cleanup
    statistics.bays = [];
    for (const key in dicBays) {
      const bay = dicBays[key];
      bay.heatTotal = bay.currentWeaponCount * bay.heatPer;
      statistics.bays.push(bay);
    }

    statistics.bays.sort(SortSquadronBays);

    // Bombs Cleanup
    statistics.bombs = [
      dicBombs[defaultBombs.heBombs.name],
      dicBombs[defaultBombs.laserGuidedBombs.name],
      dicBombs[defaultBombs.clusterBombs.name],
      dicBombs[defaultBombs.rocketPods.name],
      dicBombs[defaultBombs.tags.name],
    ];

    return statistics;
  }
}

/**
 * The compareFn for ascending squadron bays
 * @param {SquadronBay} a
 * @param {SquadronBay} b
 * @returns {number}
 */
function SortSquadronBays(a, b) {
  const aLocVal = SquadronBayLocationValue(a);
  const bLocVal = SquadronBayLocationValue(b);
  const locVal = aLocVal - bLocVal;

  if (locVal != 0) {
    return locVal;
  }

  return StrCompare(a.name, b.name);
}

/**
 * Gets the numerical value of a location for sorting
 * @param {SquadronBay} bay
 * @returns {number}
 */
function SquadronBayLocationValue(bay) {
  switch (bay.location) {
    case BayLocations.Nose:
      return 1;
    case BayLocations.Wing:
      return 2;
    case BayLocations.Aft:
      return 3;
    default:
      return 10;
  }
}

customElements.define("ap-squadron-header", SquadronHeader);
