export class StateWrapper extends HTMLElement {
    connectedCallback() {
        this.watch()
    }
    disconnectedCallback() {
        if (this.watcher) this.watcher();
    }
    set state(state) {
        if ('store' in state) {
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

// export class Component extends HTMLElement {
//     constructor(content) {
//         super();
//         const shadowRoot = this.attachShadow({
//             mode: 'open'
//         })
//         shadowRoot.appendChild(content.cloneNode(true))
//     }
// }

// customElements.define('x-component', Component);

export function define() {
    if (!window.customElements.get('state-wrapper'))
        window.customElements.define('state-wrapper', StateWrapper);
}

export {
    h
}
from './utils';

if (window) {
    window.StateWrapper = StateWrapper;
    window.h = h
    define();
}