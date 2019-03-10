export class StateWrapper extends HTMLElement {
    connectedCallback() {
        this.watch()
    }
    disconnectedCallback() {
        if (this.watcher) this.watcher();
    }
    set state(state) {
        if (typeof state == 'object' && 'store' in state) {
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
            this.watcher = this.state.watch(this.update.bind(this));
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

const wrapper = 'state-wrapper'

export function h(s, ...v) {
    const temp = document.createElement('template');
    temp.innerHTML = s.join(['<', '></', '>'].join(wrapper));
    const content = document.importNode(temp.content, true);
    content.querySelectorAll(wrapper).forEach((el, i) => {
        el.state = v[i]
    })
    return content
}



if (window) {
    window.StateWrapper = StateWrapper;
    window.h = h
    define();
}