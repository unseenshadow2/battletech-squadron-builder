import {
  AssignSquadronDataDefaults,
  AssignFighterDataDefaults,
} from "../data-types.mjs";
import { TemplatedHtmlElement } from "./templated-html-element.mjs";

import "./squadron-header.mjs";
import "./fighter-row.mjs";

/**
 * @typedef {import('../data-types.mjs').Squadron} Squadron
 * @typedef {import('./squadron-header.mjs').SquadronHeader} SquadronHeader
 * @typedef {import('./fighter-row.mjs').FighterRowElement} FighterRowElement
 */

await TemplatedHtmlElement.AddTemplate(
  "SquadronPage",
  "templates/squadron-page.html"
);

export class SquadronPage extends TemplatedHtmlElement {
  /**
   * @type {SquadronHeader}
   */
  squadronHeader;

  /**
   * @type {FighterRowElement[]}
   */
  fighterRows;

  /**
   * @type {Squadron}
   */
  squadron = AssignSquadronDataDefaults();

  /**
   * @type {boolean}
   */
  isCopying = false;

  /**
   * @type {?import("../data-types.mjs").Fighter}
   */
  copyFighter;

  constructor() {
    // Always call super first in constructor
    super("SquadronPage");
  }

  connectedCallback() {
    super.connectedCallback();

    this.squadronHeader = this.shadowRoot.getElementById("squadron-header-row");
    this.fighterRows = [
      this.shadowRoot.getElementById("fighter-row-1"),
      this.shadowRoot.getElementById("fighter-row-2"),
      this.shadowRoot.getElementById("fighter-row-3"),
      this.shadowRoot.getElementById("fighter-row-4"),
      this.shadowRoot.getElementById("fighter-row-5"),
      this.shadowRoot.getElementById("fighter-row-6"),
    ];

    this.ResetDataBindings(this.squadron);

    for (const fighterRow of this.fighterRows) {
      fighterRow.addEventListener("change", () => {
        // console.log(
        //   `Fighter ${fighterRow.fighterNumber} has changed. Squadron: `,
        //   JSON.parse(JSON.stringify(this.squadron))
        // );
        this.squadronHeader.Update();
      });

      fighterRow.addEventListener("copyfighter", (e) => {
        this.isCopying = true;
        this.copyFighter = JSON.parse(JSON.stringify(e.detail));

        this.ToggleAllCopyMode();
      });

      fighterRow.addEventListener("pastefighter", (e) => {
        this.isCopying = false;
        this.squadron.fighters[e.detail - 1] = this.copyFighter;
        this.fighterRows[e.detail - 1].ResetDataBindings(this.copyFighter);

        this.ToggleAllCopyMode();
        this.squadronHeader.Update();
      });
    }
  }

  Update() {}

  /**
   * Resets the data bindings to the squadron
   * @param {Squadron?} squadronIn
   */
  ResetDataBindings(squadronIn) {
    this.squadron = squadronIn ?? this.squadron;

    this.squadronHeader.ResetDataBindings(this.squadron);

    for (let i = 0; i < this.squadron.fighters.length; i++) {
      this.fighterRows[i].ResetDataBindings(this.squadron.fighters[i]);
    }

    this.Update();
  }

  ToggleAllCopyMode() {
    for (const fighterRow of this.fighterRows) {
      fighterRow.ToggleCopyMode();
    }
  }
}

customElements.define("ap-squadron-page", SquadronPage);
