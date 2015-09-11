
export default class Tag {
    constructor(name, ...args) {
        this.name = name;
        this.args = args;
    }

    match(alternatives) {
        let alt = alternatives[this.name];

        if (typeof alt === 'function') {
            return alt.apply(null, this.args);
        } else if (typeof alt === 'undefined') {
            throw new Error(`No case provided for ${this.name}`);
        } else {
            return alt;
        }
    }

    toString() {
        return `${this.name}(${this.args.map(JSON.stringify).join(', ')})`;
    }

    toJSON() {
        return [this.name].concat(this.args);
    }

    set(newValues) {
        var oldValues = this.args[0],
            combined  = {};

        for (var k in oldValues) {
            combined[k] = oldValues[k];
        }

        for (var k in newValues) {
            combined[k] = newValues[k];
        }

        return new Tag(this.name, combined);
    }

    static define(name, nargs) {
        if (nargs === 0) {
            return new Tag(name);
        }

        return (...args)=> {
            if (args.length !== nargs) {
                throw new Error(
    `Tag constructor "${name}" expects ${nargs} arguments, not ${args.length}`
                );
            }

            return new Tag(name, ...args);
        };
    }

    static fromJSON([name, ...args]) {
        return new Tag(name, ...args);
    }
}

