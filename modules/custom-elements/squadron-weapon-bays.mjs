import {
  AssignSquadronBayDefaults,
  WeaponRanges,
  BayLocations,
} from "../data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

/**
 * @typedef {import('../data-types.mjs').SquadronBay} SquadronBay
 */

await TemplatedHtmlElement.AddTemplate(
  "SquadronBaysElement",
  "templates/squadron-weapon-bays.html"
);

export class SquadronBaysElement extends TemplatedHtmlElement {
  /**
   * @type {HTMLTableElement}
   */
  #table;

  /**
   * @type {SquadronBay[]}
   */
  bays = [AssignSquadronBayDefaults(undefined)];

  /**
   * The HTML template to be used by the TemplatedHtmlElement
   * @type {HTMLTemplateElement}
   */
  bayRowTemplate;

  /**
   * @type {HTMLTableSectionElement}
   */
  bayTableBody;

  /**
   * @type {boolean}
   */
  get showRightBorder() {
    this.#table.hasAttribute("showRightBorder");
  }

  set showRightBorder(val) {
    if (val) {
      this.#table.setAttribute("showRightBorder", "");
    } else {
      this.#table.removeAttribute("showRightBorder");
    }
  }

  constructor() {
    // Always call super first in constructor
    super("SquadronBaysElement");
  }

  connectedCallback() {
    super.connectedCallback();

    this.bayRowTemplate = this.shadowRoot.getElementById("bay-row");
    this.bayTableBody = this.shadowRoot.getElementById("bay-table-body");
    this.#table = this.shadowRoot.getElementById("bay-table");

    this.showRightBorder = this.hasAttribute("showRightBorder");

    this.Update();
  }

  Update() {
    // Clear the table
    this.bayTableBody.innerHTML = "";

    // Populate the table
    if (this.bays.length == 0) {
      let row = this.GenerateRow(AssignSquadronBayDefaults(undefined), 0);
      this.bayTableBody.appendChild(row);
    } else {
      for (let i = 0; i < this.bays.length; i++) {
        let row = this.GenerateRow(this.bays[i], i);
        this.bayTableBody.appendChild(row);
      }
    }
  }

  /**
   * Generate a table row to display the bay
   * @param {SquadronBay} bay The bay to be used to generate the table row
   * @param {number} index The index of the bay to be used for making the ids unique
   */
  GenerateRow(bay, index) {
    const row = this.bayRowTemplate.content.cloneNode(true);
    const weaponBay = row.getElementById("weapon-bay");
    const bayLocation = row.getElementById("location");
    const weaponCount = row.getElementById("weapon-count");
    const attackValue = row.getElementById("attack-value");
    const heat = row.getElementById("heat");
    const rangeBracket = row.getElementById("range-bracket");

    weaponBay.value = bay.name;
    bayLocation.value = bay.location;
    weaponCount.value = `${bay.startingWeaponCount} / ${bay.currentWeaponCount}`;
    attackValue.value = bay.attackValue;
    heat.value = `${bay.heatPer} / ${bay.heatPer * bay.currentWeaponCount}`;
    rangeBracket.value = bay.rangeBracket;

    return row;
  }
}

customElements.define("ap-squadron-bays", SquadronBaysElement);
