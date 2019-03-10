const handler = {
    ownKeys(target) {
        return [
            ...Reflect.ownKeys(target.state),
            ...Reflect.ownKeys(target.getters),
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
            Reflect.getOwnPropertyDescriptor(target.state, key)
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
            default:
                if (key in target.state)
                    return target.wrap(target.state[key], key, target);
                else if (key in target.getters)
                    return this.wrap(target.getters[key].call(target.self, target.self), key, target)
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

export default class Store extends EventTarget {
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
        class Wrapper extends val.__proto__.constructor {
            constructor(arg) {
                super(arg);
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
        return new Wrapper(val);
    }

    // watch(key, fn) {
    //     if (!this.watchers[key]) this.watchers[key] = new Set();
    //     this.watchers[key].add(fn.bind(this.self));
    //     fn.call(this.self, this.self[key]);
    //     return () => this.watchers[key].delete(fn);
    // }

    watch(key, infn) {

        const fn = ({
            detail
        }) => {
            infn.call(this.self, detail)
        }
        this.addEventListener(key, fn)
        return () => this.removeEventListener(key, fn)
    }

    dispatch(key, args) {
        if (!(key in this.actions))
            throw new Error(`No Action with name ${key}`);
        return this.actions[key].call(this.self, args);
    }

    // trigger(key) {
    //     if (this.watchers[key])
    //         this.watchers[key].forEach(fn => fn.call(this.self, this.self[key]));
    // }

    trigger(key) {
        this.dispatchEvent(new CustomEvent(key, {
            detail: this.self[key]
        }))
    }
}

if (window) {
    window.Store = Store
}