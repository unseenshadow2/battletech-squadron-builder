import "./custom-elements/custom-elements.mjs";
import { AssignSquadronDataDefaults } from "./data-types.mjs";

let squadronData = AssignSquadronDataDefaults(undefined);
let squadronHeader = document.getElementById("squadron-data-row");
let fighterRows = [
  document.getElementById("fighter-row-1"),
  document.getElementById("fighter-row-2"),
  document.getElementById("fighter-row-3"),
  document.getElementById("fighter-row-4"),
  document.getElementById("fighter-row-5"),
  document.getElementById("fighter-row-6"),
];
