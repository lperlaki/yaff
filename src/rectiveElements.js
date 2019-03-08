export class WrapperElement extends HTMLElement {
    connectedCallback() {
        this.watch()
    }
    disconnectedCallback() {
        if (this.watcher) this.watcher();
    }
    set state(state) {
        if (state.hasOwnProperty('store')) {
            this.stateref = state;
            this.watch()
        } else this.update(state)
    }
    get state() {
        return this.stateref
    }
    get value() {
        return this.ref;
    }
    update(val) {
        this.ref = val
        this.innerHTML = this.value;
    }
    watch() {
        if (this.state)
            this.watcher = this.state.watch(val => this.update(val));
    }
    constructor(val = '') {
        super();
        this.state = val
    }
}

export class Component extends HTMLElement {
    constructor(content) {
        super();
        const shadowRoot = this.attachShadow({
            mode: 'open'
        })
        shadowRoot.appendChild(content.cloneNode(true))
    }
}

customElements.define('store-component', Component);
customElements.define('store-wrapper', WrapperElement);

export function h(s, ...v) {
    const temp = document.createElement('template');
    temp.innerHTML = s.join('<store-wrapper>');
    const content = document.importNode(temp.content, true);
    content.querySelectorAll('store-wrapper').forEach((el, i) => {
        el.state = v[i]
    })
    return content
}