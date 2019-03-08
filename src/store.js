const handler = {
    ownKeys(target) {
        return [
            ...Reflect.ownKeys(target.state),
            ...Reflect.ownKeys(target.getters),
            ...Reflect.ownKeys(this.methods),
        ];
    },
    getOwnPropertyDescriptor(target, key) {
        if (key in target.getters) {
            return {
                value: target.getters[key].call(target.self, target.self),
                writable: true,
                enumerable: true,
                configurable: true
            }
        }
        return (
            Reflect.getOwnPropertyDescriptor(target.state, key) ||
            Reflect.getOwnPropertyDescriptor(this.methods, key)
        );
    },
    getPrototypeOf(target) {
        return Object.getPrototypeOf(target);
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
                else if (key in target.getters)
                    return this.wrap(target.getters[key].call(target.self, target.self), key, target)
                else return undefined;
        }
    },
    set(target, key, value) {
        if (key == 'self') return this.self = target.self = value
        if (key in this.methods) throw new Error(`${key} is read only`);
        target.state[key] = value;
        this.methods.trigger(target)(key);
    },
    wrap(val, key, target) {
        if (!val.__proto__) {
            return val
        }
        const store = target.self
        class Wrapper extends val.__proto__.constructor {
            constructor(arg) {
                super(arg);
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
    },
    methods: {
        watch: target => (key, fn) => {
            if (!target.watch[key]) target.watch[key] = new Set();
            target.watch[key].add(fn.bind(target.self));
            fn(target.self[key]);
            return () => target.watch[key].delete(fn);
        },
        dispatch: target => (key, args) => {
            if (!(key in target.actions))
                throw new Error(`No Action with name ${key}`);
            return target.actions[key].call(target.self, args);
        },
        trigger: target => key => {
            if (target.watch[key])
                target.watch[key].forEach(fn => fn.call(target.self, target.self[key]));
        },
    },
};

class Store {
    constructor(store) {
        this.state = {
            ...store.state,
        }
        this.getters = {
            ...store.getters,
        }
        this.watch = Object.entries(store.watch || {})
            .map(([key, val]) => ({
                [key]: new Set([val].flat(Infinity)),
            }))
            .reduce((obj, val) => Object.assign(obj, val), {})
        this.actions = {
            ...store.actions,
        }
        return this.self = new Proxy(this, handler)
    }
}




const test = new Store({
    state: {
        count: 0
    },
    getters: {
        countN: store => -store.count
    }
})

test.count.watch(console.log)


console.log(test)


// module.exports = Store;