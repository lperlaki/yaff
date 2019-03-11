const handler = {
    ownKeys(target) {
        return [
            ...Reflect.ownKeys(target.state),
            ...Reflect.ownKeys(target.getters),
            ...Reflect.ownKeys(target.actions),
        ];
    },
    getOwnPropertyDescriptor(target, key) {
        if (key in target.getters) {
            return {
                get: () => target.getters[key].call(target.self, target.self),
                enumerable: true,
                configurable: true
            }
        }
        return (
            Reflect.getOwnPropertyDescriptor(target.state, key) ||
            Reflect.getOwnPropertyDescriptor(target.actions, key)
        );
    },
    getPrototypeOf(target) {
        return Object.getPrototypeOf(target);
    },
    has(target, key) {
        return key in target.state || key in target.getters;
    },
    get(target, key) {
        switch (key) {
            case 'watch':
                return target.watch.bind(target);
            case 'dispatch':
                return target.dispatch.bind(target);
            case 'trigger':
                return target.trigger.bind(target);
            case 'save':
                return target.save.bind(target);
            case 'load':
                return target.load.bind(target);
            default:
                if (key in target.state)
                    return target.wrap(target.state[key], key, target);
                else if (key in target.getters)
                    return this.wrap(target.getters[key].call(target.self, target.self), key, target)
                else if (key in target.actions)
                    return target.actions[key].bind(target.self)
                else return undefined;
        }
    },
    set(target, key, value) {
        if (key == 'self') return this.self = target.self = value
        // if (key in this.methods) throw new Error(`${key} is read only`);
        target.state[key] = value;
        target.trigger(key);
    },

};


import {
    EventTarget
} from "event-target-shim"

export class Store extends EventTarget {
    constructor(store) {
        super()
        this.self = new Proxy(this, handler)
        this.state = {
            ...store.state,
        }
        this.getters = {
            ...store.getters,
        }
        Object.entries(store.watch || {}).forEach(([key, val]) => this.watch(key, val))
        // .map(([key, val]) => ({
        //     [key]: new Set([val].flat(Infinity)),
        // }))
        // .reduce((obj, val) => Object.assign(obj, val), {})
        this.actions = {
            ...store.actions,
        }
        return this.self
    }

    wrap(val, key) {
        if (!val.__proto__) return val
        const store = this.self
        class State extends val.__proto__.constructor {
            constructor(args) {
                if (Array.isArray(args))
                    super(...args, 0).pop()
                else super(args);
            }
            get value() {
                return this.valueOf()
            }
            get store() {
                return store
            }
            get key() {
                return key
            }
            watch(fn) {
                return this.store.watch(this.key, fn);
            }
        }
        return new State(val);
    }

    watch(key, infn) {
        const fn = ({
            detail
        }) => {
            infn.call(this.self, detail)
        }
        this.addEventListener(key, fn)
        fn({
            detail: this.self[key]
        })
        return () => this.removeEventListener(key, fn)
    }

    dispatch(key, args) {
        if (!(key in this.actions))
            throw new Error(`No Action with name ${key}`);
        return this.actions[key].call(this.self, args);
    }

    trigger(key) {
        this.dispatchEvent(new CustomEvent(key, {
            detail: this.self[key]
        }))
    }

    save(key = 'store') {
        localStorage.setItem(key, JSON.stringify(this.state))
    }

    load(key = 'store') {
        this.state = JSON.parse(localStorage.getItem(key))
        for (let key in this.state) this.trigger(key)
    }
}

export default Store;

if (window) {
    window.Store = Store
}