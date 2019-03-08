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
                    return this.wrap(target.state[key], key);
                else if (key in target.getters)
                    return this.wrap(target.getters[key].call(target.self))
                else return undefined;
        }
    },
    set(target, key, value) {
        if (key == 'self') return this.self = target.self = value
        if (key in this.methods) throw new Error(`${key} is read only`);
        target.state[key] = value;
        this.methods.trigger(target)(key);
    },
    wrap(val, key) {
        const store = this.self
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
            target.watch[key].add(fn.bind(target.self));
            fn(target.state[key]);
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
        store = {
            state: {
                ...store.state,
            },
            getters: {
                ...store.getters,
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
        const pro = new Proxy(store, handler)
        return pro.self = pro;
    }
}



const test = new Store({
    state: {
        count: 0
    }
})

console.log(test.count.store == test)


// module.exports = Store;