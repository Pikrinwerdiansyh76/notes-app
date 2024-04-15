class NoteSearchError extends HTMLElement {
  _shadowRoot = null
  _style = null

  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._style = document.createElement('style')

    this.render()
  }

  _updateStyle() {
    this._style.textContent = `
    :host {
      display: block;  
    }
  
    .placeholder {
      font-weight: lighter;
      color: rgba(0, 0, 0, 0.5);
    }
    `
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = ''
  }

  render() {
    this._emptyContent()
    this._updateStyle()

    this._shadowRoot.appendChild(this._style)
    this._shadowRoot.innerHTML += `
      <div>
        <h2 class="placeholder">Galat! Catatan tidak ditemukan</h2>
        <slot></slot>
      </div>
    `
  }
}

customElements.define('note-search-error', NoteSearchError)
