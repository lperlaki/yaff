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

const wrapper_tag = ['<', '></', '>'].join(wrapper)

const reg = /(?:<|>)(?=[^<>]*$)/

const swelm = el => el.tagName == 'STATE-WRAPPER'

const attrib = el => [...el.attributes].filter(a => a.value == 'state-wrapper')

const exp = document.createExpression('//state-wrapper | //*[@*="state-wrapper"]')

const bindAttr = (attr, state) => (typeof state == 'object' && 'store' in state) ? state.watch(v => attr.value = v) : attr.value = state

function* elementsGenerator(content) {
    const elements = exp.evaluate(content.firstChild, 7)
    for (let i = 0; i < elements.snapshotLength; i++) {
        let el = elements.snapshotItem(i);
        if (swelm(el)) {
            yield el;
        } else {
            yield* attrib(el)
        }
    }
}


export function h(s, ...v) {
    const temp = document.createElement('template');
    let sum = '';
    temp.innerHTML = s.map((e, i) => `${e}${i in v && reg.test(sum += e) && (reg.exec(sum)[0] == '>' ? wrapper_tag : wrapper) || ''}`).join('');
    const content = document.importNode(temp.content, true);
    const elements = elementsGenerator(content);
    for (let val of v) {
        let el = elements.next().value;
        if (Attr.prototype.isPrototypeOf(el)) {
            bindAttr(el, val)
        } else {
            if (DocumentFragment.prototype.isPrototypeOf(val)) el.replaceWith(val)
            else if (Array.prototype.isPrototypeOf(val) && DocumentFragment.prototype.isPrototypeOf(val[0])) el.replaceWith(...val)
            else el.state = val
        }
    }
    return content;
}





if (window) {
    window.StateWrapper = StateWrapper;
    window.h = h
    define();
}