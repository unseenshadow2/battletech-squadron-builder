import {
  AssignFighterBayDefaults,
  AssignFighterBombBayDefaults,
  WeaponRanges,
  BayLocations,
} from "../data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

/**
 * @typedef {import('../data-types.mjs').WeaponBay} WeaponBay
 */

/**
 * @typedef {import('../data-types.mjs').BombBays} BombBays
 */

await TemplatedHtmlElement.AddTemplate(
  "FighterBaysElement",
  "../../templates/fighter-bays.html"
);

export class FighterBaysElement extends TemplatedHtmlElement {
  /**
   * @type {HTMLTableElement}
   */
  #table;

  /**
   * @type {"weapons" | "bombs"}
   */
  get mode() {
    return this.getAttribute("mode");
  }
  set mode(val) {
    this.setAttribute("mode", val);
  }

  /**
   * @type {WeaponBay[]}
   */
  bays = [AssignFighterBayDefaults(undefined)];

  /**
   * @type {BombBays}
   */
  bombs = AssignFighterBombBayDefaults(undefined);

  /**
   * The HTML template to be used by the TemplatedHtmlElement
   * @type {HTMLTemplateElement}
   */
  weaponBayRowTemplate;

  /**
   * The HTML template to be used by the TemplatedHtmlElement
   * @type {HTMLTemplateElement}
   */
  bombBayRowTemplate;

  /**
   * @type {HTMLTableSectionElement}
   */
  bayTableBody;

  /**
   * @type {HTMLTableRowElement}
   */
  weaponHeaders;

  /**
   * @type {HTMLTableRowElement}
   */
  bombHeaders;

  constructor() {
    // Always call super first in constructor
    super("FighterBaysElement");
  }

  connectedCallback() {
    super.connectedCallback();

    this.weaponBayRowTemplate = this.shadowRoot.getElementById("weapon-row");
    this.bombBayRowTemplate = this.shadowRoot.getElementById("bomb-row");
    this.bayTableBody = this.shadowRoot.getElementById("bay-table-body");
    this.#table = this.shadowRoot.getElementById("bay-table");

    this.weaponHeaders = this.shadowRoot.getElementById("weapon-headers");
    this.bombHeaders = this.shadowRoot.getElementById("bomb-headers");

    this.Update();
  }

  Update() {
    // Clear the table
    this.bayTableBody.innerHTML = "";

    if (this.mode === "weapons") {
      // Enable the Weapons Header
      this.weaponHeaders.classList.remove("hidden");
      this.bombHeaders.classList.add("hidden");

      // Populate the table
      if (this.bays.length == 0) {
        let row = this.GenerateWeaponRow(
          AssignFighterBayDefaults(undefined),
          0
        );
        this.bayTableBody.appendChild(row);
      } else {
        for (let i = 0; i < this.bays.length; i++) {
          let row = this.GenerateWeaponRow(
            AssignFighterBayDefaults(this.bays[i]),
            i
          );
          this.bayTableBody.appendChild(row);
        }
      }

      // Add the Add button
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      let addButton = document.createElement("button");

      tr.appendChild(td);
      td.appendChild(addButton);

      td.rowSpan = 3;

      addButton.innerText = "Add Weapon";
      addButton.addEventListener("click", () => {
        const weapon = AssignFighterBayDefaults(undefined);
        this.bays.push(weapon);

        const row = this.GenerateWeaponRow(weapon, this.bays.length - 1);
        const existingBays =
          this.bayTableBody.querySelectorAll(".weapon-bay-row");
        existingBays.item(existingBays.length - 1).after(row);
      });

      this.bayTableBody.appendChild(tr);
    } else if (this.mode === "bombs") {
      // Enable the Bombs Header
      this.weaponHeaders.classList.add("hidden");
      this.bombHeaders.classList.remove("hidden");

      for (let bombKey in this.bombs) {
        const bomb = this.bombs[bombKey];
        let row = this.GenerateBombRow(AssignFighterBayDefaults(bomb), 0);
        this.bayTableBody.appendChild(row);
      }
    }
  }

  /**
   * Generate a table row to display the weapon
   * @param {WeaponBay} weapon The bay to be used to generate the table row
   * @param {number} index The index of the bay to be used for making the ids unique
   * @returns {HTMLTableRowElement}
   */
  GenerateWeaponRow(weapon, index) {
    const row = this.weaponBayRowTemplate.content.cloneNode(true);
    const weaponName = row.getElementById("weapon");
    const count = row.getElementById("count");
    const weaponLocation = row.getElementById("location");
    const attackValue = row.getElementById("attack-value");
    const heat = row.getElementById("heat");
    const rangeBracket = row.getElementById("range-bracket");

    weaponName.value = weapon.name;
    count.valueAsNumber = weapon.count;
    weaponLocation.value = weapon.location;
    attackValue.value = weapon.attackValue;
    heat.value = weapon.heat;
    rangeBracket.value = weapon.rangeBracket;

    // Populate dropdowns
    for (const locKey in BayLocations) {
      if (BayLocations[locKey] != BayLocations.Bomb) {
        const option = document.createElement("option");
        option.value = BayLocations[locKey];
        option.innerText = locKey;

        weaponLocation.appendChild(option);
      }
    }

    for (const rangeKey in WeaponRanges) {
      if (WeaponRanges[rangeKey] != WeaponRanges.Bomb) {
        const option = document.createElement("option");
        option.value = WeaponRanges[rangeKey];
        option.innerText = rangeKey;

        rangeBracket.appendChild(option);
      }
    }

    return row;
  }

  /**
   * Generate a table row to display the bomb
   * @param {WeaponBay} bomb
   * @param {number} index
   * @returns {HTMLTableRowElement}
   */
  GenerateBombRow(bomb, index) {
    const row = this.bombBayRowTemplate.content.cloneNode(true);
    const bombName = row.getElementById("bomb");
    const count = row.getElementById("count");
    const attackValue = row.getElementById("attack-value");
    const rangeBracket = row.getElementById("range-bracket");

    bombName.value = bomb.name;
    count.valueAsNumber = bomb.count;
    attackValue.value = bomb.damage;
    rangeBracket.value = bomb.range;

    count.addEventListener("change", () => {
      bomb.count = count.valueAsNumber;
    });

    return row;
  }
}

customElements.define("ap-fighter-bays", FighterBaysElement);
