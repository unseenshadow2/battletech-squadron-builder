import "./custom-elements/custom-elements.mjs";
import { AssignSquadronDataDefaults } from "./data-types.mjs";

let squadronData = AssignSquadronDataDefaults(undefined);
let squadronPage = document.querySelector("ap-squadron-page");

/**
 * @type {HTMLInputElement}
 */
const loadElement = document.getElementById("squadron-load");

function Save() {
  const blob = new Blob([JSON.stringify(squadronPage.squadron)], {
    type: "application/json",
  });

  let a = document.createElement("a");
  a.style = "display: none";
  document.body.appendChild(a);
  a.href = window.URL.createObjectURL(blob);
  a.download = `${squadronPage.squadron.name}.squadron`;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

function Load() {
  const reader = new FileReader();
  reader.onload = (loadE) => {
    const loaded = JSON.parse(loadE.target.result);
    squadronPage.ResetDataBindings(AssignSquadronDataDefaults(loaded));
  };

  loadElement.onchange = () => {
    reader.readAsText(loadElement.files[0]);
  };
  loadElement.click();
}

window.SaveFighter = Save;
window.LoadFighter = Load;
