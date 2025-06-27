export class TemplatedHtmlElement extends HTMLElement {
  /**
   * Stored as {"templatePath":"HTML code string"}
   */
  static CachedTemplates = {};

  /**
   * Adds and loads a template to the TemplatedHtmlElement's CachedTemplates.
   * This must be called and allowed to complete before the template can be used.
   *
   * @param {string} templateKey The key of the cached template
   * @param {string} templatePath The path of the template to be cached
   */
  static async AddTemplate(templateKey, templatePath) {
    let templateCode = await fetch(templatePath).then((response) =>
      response.text()
    );

    if (templateCode) {
      TemplatedHtmlElement.CachedTemplates[templateKey] = templateCode;
    }
  }

  /** @type {(string)} The HTML template to be used by the TemplatedHtmlElement */
  template;

  /**
   * Constructs a TemplatedHtmlElement using the given key
   * @param {string} templateKey The key for the template to use
   */
  constructor(templateKey) {
    // Always call super first in constructor
    super();

    this.attachShadow({ mode: "open" });

    let templateCode = TemplatedHtmlElement.CachedTemplates[templateKey];

    if (templateCode) {
      this.template = templateCode;
    }
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = this.template;
  }
}
