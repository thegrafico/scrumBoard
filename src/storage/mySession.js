class mySession {
    /**
     * 
     * @param {Object} config - key with configurations 
     */
    constructor(config) {
        this.config = config;
        this._val = {};
    }

    set(key, value) {
        this._val[key] = value;
    }

    get(key) {

        if (!(key in this._val)) {
            return "KEY NOT FOUND";
        }

        return this._val[key];
    }
}

module.exports = { mySession };