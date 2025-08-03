import {
  AssignFighterDataDefaults,
  AssignFighterBayDefaults,
} from "../data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

import "./fighter-bays.mjs";

/**
 * @typedef {import('../data-types.mjs').Fighter} Fighter
 * @typedef {import('../data-types.mjs').WeaponBay} WeaponBay
 * @typedef {import('./fighter-bays.mjs').FighterBaysElement} FighterBaysElement
 */

await TemplatedHtmlElement.AddTemplate(
  "FighterRow",
  "templates/fighter-row.html"
);

export class FighterRowElement extends TemplatedHtmlElement {
  /**
   * @type {string}
   */
  get fighterNumber() {
    return this.getAttribute("fighternumber") ?? "1";
  }
  set fighterNumber(val) {
    this.setAttribute("fighternumber", val);
  }

  /**
   * @type {Fighter}
   */
  fighter = AssignFighterDataDefaults(undefined);

  /**
   * The HTML template to be used by the TemplatedHtmlElement
   * @type {HTMLTemplateElement}
   */
  damagePipTemplate;

  /**
   * @type {HTMLElement}
   */
  armorPipsContainer;

  /**
   * @type {HTMLElement}
   */
  siPipsContainer;

  /**
   * @type {FighterBaysElement}
   */
  weaponBayElement;

  /**
   * @type {FighterBaysElement}
   */
  bombBayElement;

  /**
   * @type {HTMLButtonElement}
   */
  copyPasteButton;

  isCopyMode = true;

  constructor() {
    // Always call super first in constructor
    super("FighterRow");
  }

  connectedCallback() {
    super.connectedCallback();

    this.weaponBayElement = this.shadowRoot.getElementById("weapon-bays");
    this.bombBayElement = this.shadowRoot.getElementById("bomb-bays");

    this.weaponBayElement.addEventListener("WeaponsChange", () => {
      this.fighter.bays = this.weaponBayElement.bays;
      this.DispatchChangeEvent();
    });

    this.bombBayElement.addEventListener("BombsChange", () => {
      this.fighter.bombs = this.bombBayElement.bombs;
      this.DispatchChangeEvent();
    });

    this.Update();

    // Setup copy/paste
    this.copyPasteButton = this.shadowRoot.getElementById("copy-paste-button");
    this.copyPasteButton.addEventListener("click", () => {
      if (this.isCopyMode) {
        this.DispatchCopyEvent();
      } else {
        this.DispatchPasteEvent();
      }
    });
  }

  /**
   * Resets the data bindings to the squadron
   * @param {Fighter} fighterIn
   */
  ResetDataBindings(fighterIn) {
    this.fighter = fighterIn ?? this.fighter;

    // We reset the bindings of our weapons and bombs in the Update() function

    this.Update();
  }

  Update() {
    const titleElement = this.shadowRoot.getElementById("fighter-number");
    titleElement.textContent = `Fighter ${this.fighterNumber}:`;

    /* -------- Fighter --------- */
    const nameElement = this.shadowRoot.getElementById("name-input");
    nameElement.value = this.fighter.name;
    nameElement.addEventListener("change", () => {
      this.fighter.name = nameElement.value;
      this.DispatchChangeEvent();
    });

    const maxThrustElement = this.shadowRoot.getElementById("max-thrust-input");
    maxThrustElement.valueAsNumber = this.fighter.maxThrust;

    const safeThrustElement =
      this.shadowRoot.getElementById("safe-thrust-input");
    safeThrustElement.valueAsNumber = this.fighter.safeThrust;
    safeThrustElement.addEventListener("change", () => {
      this.fighter.safeThrust = safeThrustElement.valueAsNumber;
      this.fighter.maxThrust = Math.ceil(this.fighter.safeThrust * 1.5);
      maxThrustElement.valueAsNumber = this.fighter.maxThrust;

      this.DispatchChangeEvent();
    });

    const heatSinksElement = this.shadowRoot.getElementById("heat-sinks-input");
    heatSinksElement.valueAsNumber = this.fighter.heatSinks;
    heatSinksElement.addEventListener("change", () => {
      this.fighter.heatSinks = heatSinksElement.valueAsNumber;
      this.DispatchChangeEvent();
    });

    const heatSinksTypeElement =
      this.shadowRoot.getElementById("heat-sinks-select");
    heatSinksTypeElement.value = this.fighter.heatSinkType;
    heatSinksTypeElement.addEventListener("change", () => {
      this.fighter.heatSinkType = heatSinksTypeElement.value;
      this.DispatchChangeEvent();
    });

    const fuelElement = this.shadowRoot.getElementById("fuel-input");
    fuelElement.valueAsNumber = this.fighter.fuel;
    fuelElement.addEventListener("change", () => {
      this.fighter.fuel = fuelElement.valueAsNumber;
      this.DispatchChangeEvent();
    });

    this.weaponBayElement.ResetDataBindings(this.fighter);
    this.bombBayElement.ResetDataBindings(this.fighter);

    /* --------- Pilot ---------- */
    const gunneryElement = this.shadowRoot.getElementById("gunnery-input");
    gunneryElement.valueAsNumber = this.fighter.gunnery;
    gunneryElement.addEventListener("change", () => {
      this.fighter.gunnery = gunneryElement.valueAsNumber;
      this.DispatchChangeEvent();
    });

    const pilotingElement = this.shadowRoot.getElementById("piloting-input");
    pilotingElement.valueAsNumber = this.fighter.piloting;
    pilotingElement.addEventListener("change", () => {
      this.fighter.piloting = pilotingElement.valueAsNumber;
      this.DispatchChangeEvent();
    });

    /* --------- Crits ---------- */
    // TODO: Populate crits

    /* ------ Armor and SI ------ */
    // Grab everything for pip creation
    this.damagePipTemplate = this.shadowRoot.getElementById(
      "damage-pip-template"
    );
    this.armorPipsContainer =
      this.shadowRoot.getElementById("fighter-armor-pips");
    this.siPipsContainer = this.shadowRoot.getElementById("fighter-si-pips");

    // Setup Armor and SI Displays
    let totalArmorInput = this.shadowRoot.getElementById("total-armor-input");
    let fatalThresholdInput = this.shadowRoot.getElementById(
      "fatal-threshold-input"
    );
    let siInput = this.shadowRoot.getElementById("si-input");

    totalArmorInput.valueAsNumber = this.fighter.totalArmor;
    fatalThresholdInput.valueAsNumber = this.CalculateFatalThreshold(
      this.fighter.totalArmor
    );
    siInput.valueAsNumber = this.fighter.structuralIntegrity;

    this.SetupPips(this.armorPipsContainer, this.fighter.totalArmor, true);
    this.SetupPips(
      this.siPipsContainer,
      this.fighter.structuralIntegrity,
      false
    );

    totalArmorInput.addEventListener("change", () => {
      this.fighter.totalArmor = totalArmorInput.valueAsNumber;
      fatalThresholdInput.valueAsNumber = this.CalculateFatalThreshold(
        this.fighter.totalArmor
      );

      this.SetupPips(this.armorPipsContainer, this.fighter.totalArmor, true);
      this.DispatchChangeEvent();
    });

    siInput.addEventListener("change", () => {
      this.fighter.structuralIntegrity = siInput.valueAsNumber;
      this.SetupPips(
        this.siPipsContainer,
        this.fighter.structuralIntegrity,
        false
      );

      this.DispatchChangeEvent();
    });
  }

  /**
   * Toggles the copyPasteButton's text between Copy and Paste
   */
  ToggleCopyMode() {
    if (this.isCopyMode) {
      this.copyPasteButton.textContent = "Paste";
    } else {
      this.copyPasteButton.textContent = "Copy";
    }

    this.isCopyMode = !this.isCopyMode;
  }

  /**
   * Calculates the fatal threshold of a fighter
   * @param {number} totalArmor The fighter's total armor
   * @returns {number} The fighter's fatal threshold
   */
  CalculateFatalThreshold(totalArmor) {
    return Math.max(Math.ceil(totalArmor / 4), 2);
  }

  /**
   * Fills a container with armor pips
   * @param {HTMLElement} container The container for the pips
   * @param {number} pipsCount The number of pips to be populated
   * @param {boolean} isArmor Whether the container is for armor or SI
   */
  SetupPips(container, pipsCount, isArmor) {
    container.innerHTML = "";
    for (let i = 1; i <= pipsCount; i++) {
      const pip = this.damagePipTemplate.content
        .cloneNode(true)
        .querySelector(".damage-pip");
      pip.value = i;

      if (isArmor) {
        if (i <= this.fighter.armorDamage) {
          pip.setAttribute("damaged", "");
        }

        pip.addEventListener("click", () => {
          this.fighter.armorDamage = pip.value;
          if (pip.clicked) {
            this.fighter.armorDamage -= 1;
          }

          this.FillPips(this.armorPipsContainer, this.fighter.armorDamage);

          if (this.fighter.armorDamage === pip.value) {
            pip.clicked = true;
          }

          this.DispatchChangeEvent();
        });
      } else {
        if (i <= this.fighter.structuralIntegrityDamage) {
          pip.setAttribute("damaged", "");
        }

        pip.addEventListener("click", () => {
          this.fighter.structuralIntegrityDamage = pip.value;
          if (pip.clicked) {
            this.fighter.structuralIntegrityDamage -= 1;
          }

          this.FillPips(
            this.siPipsContainer,
            this.fighter.structuralIntegrityDamage
          );

          if (this.fighter.structuralIntegrityDamage === pip.value) {
            pip.clicked = true;
          }

          this.DispatchChangeEvent();
        });
      }

      container.appendChild(pip);
    }
  }

  /**
   * Fill in the pips for damaged armor or SI
   * @param {HTMLElement} container The container for the damage pip elements
   * @param {number} damage The amount of damage to be displayed
   */
  FillPips(container, damage) {
    for (let pip of container.querySelectorAll(".damage-pip")) {
      pip.clicked = false;

      if (pip.value > damage) {
        pip.removeAttribute("damaged");
      } else {
        pip.setAttribute("damaged", "");
      }
    }
  }

  /**
   * Dispatch the change event with the current weapons bays
   */
  DispatchChangeEvent() {
    const fighterChangeEvent = new CustomEvent("change", {
      detail: this.fighter,
    });
    this.dispatchEvent(fighterChangeEvent);
  }

  /**
   * Dispatch the copy event with the current weapons bays
   */
  DispatchCopyEvent() {
    const fighterCopyEvent = new CustomEvent("copyfighter", {
      detail: this.fighter,
    });
    this.dispatchEvent(fighterCopyEvent);
  }

  /**
   * Dispatch the paste event with the current weapons bays
   */
  DispatchPasteEvent() {
    const fighterPasteEvent = new CustomEvent("pastefighter", {
      detail: this.fighterNumber,
    });
    this.dispatchEvent(fighterPasteEvent);
  }
}

customElements.define("ap-fighter-row", FighterRowElement);
