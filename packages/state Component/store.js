const handler = {
    ownKeys(target) {
        return [
            ...Reflect.ownKeys(target.state),
            ...Reflect.ownKeys(this.methods),
        ];
    },
    getOwnPropertyDescriptor(target, prop) {
        return (
            Reflect.getOwnPropertyDescriptor(target.state, prop) ||
            Reflect.getOwnPropertyDescriptor(this.methods, prop)
        );
    },
    getPrototypeOf(target) {
        return Store.prototype;
    },
    has(target, key) {
        return key in target.state;
    },
    get(target, key) {
        switch (key) {
            case 'watch':
                return this.methods.watch(target);
            case 'dispatch':
                return this.methods.dispatch(target);
            case 'trigger':
                return this.methods.trigger(target);
            default:
                if (key in target.state)
                    return this.wrap(target.state[key], key, target);
                else return undefined;
        }
    },
    set(target, key, value) {
        if (key in this.methods) throw new Error(`${key} is read only`);
        target.state[key] = value;
        this.methods.trigger(target)(key);
    },
    wrap(val, key, target) {
        const store = new Proxy(target, this);
        class Wrapper extends val.__proto__.constructor {
            constructor(arg) {
                super(arg);
                this.store = store;
                this.key = key;
            }
            watch(fn) {
                return this.store.watch(this.key, fn);
            }
        }
        return new Wrapper(val);
    },
    methods: {
        watch: target => (key, fn) => {
            if (!target.watch[key]) target.watch[key] = new Set();
            target.watch[key].add(fn);
            fn(target.state[key]);
            return () => target.watch[key].delete(fn);
        },
        dispatch(target) {
            return function (key, args) {
                if (!(key in target.actions))
                    throw new Error(`No Action with name ${key}`);
                return target.actions[key](this, args);
            };
        },
        trigger(target) {
            return function (key) {
                const value = target.state[key];
                if (target.watch[key])
                    target.watch[key].forEach(fn => fn(value));
            };
        },
    },
};

export default class Store {
    constructor(store) {
        store = {
            state: {
                ...store.state,
            },
            watch: Object.entries(store.watch || {})
                .map(([key, val]) => ({
                    [key]: new Set([val].flat(Infinity)),
                }))
                .reduce((obj, val) => Object.assign(obj, val), {}),
            actions: {
                ...store.actions,
            },
        };
        return new Proxy(store, handler);
    }
}