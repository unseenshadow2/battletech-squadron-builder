import {
  AssignFighterDataDefaults,
  AssignFighterBayDefaults,
} from "../data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

/**
 * @typedef {import('../data-types.mjs').Fighter} Fighter
 */
/**
 * @typedef {import('../data-types.mjs').WeaponBay} WeaponBay
 */

await TemplatedHtmlElement.AddTemplate(
  "FighterRow",
  "../../templates/fighter-row.html"
);

export class FighterRow extends TemplatedHtmlElement {
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

  constructor() {
    // Always call super first in constructor
    super("FighterRow");
  }

  connectedCallback() {
    super.connectedCallback();
    this.Update();
  }

  Update() {
    // TODO: Actually populate the fighter in here
    let titleElement = this.shadowRoot.getElementById("fighter-number");
    titleElement.textContent = `Fighter ${this.fighterNumber}:`;

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
    });

    siInput.addEventListener("change", () => {
      this.fighter.structuralIntegrity = siInput.valueAsNumber;
      this.SetupPips(
        this.siPipsContainer,
        this.fighter.structuralIntegrity,
        false
      );
    });
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
        });
      }

      container.appendChild(pip);
    }
  }

  /**
   *
   * @param {HTMLElement} container
   * @param {number} damage
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
}

customElements.define("ap-fighter-row", FighterRow);
