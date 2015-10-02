
function hasType(x, t) {
    if (typeof x === 'undefined') {
        return 'defined';
    } else if (typeof t === 'function' && typeof t.tagName !== 'undefined') {
        return x instanceof Tag && x.name === t.tagName ? null : t.name;
    } else if (typeof t === 'function') {
        return t(x);
    } else if (t instanceof Tag) {
        return x instanceof Tag && x.name === t.name ? null : t.name;
    } else {
        for (let k in x) {
            if (typeof t[k] === 'undefined') {
                return `object without field "${k}"`;
            }
        }

        let err;

        for (let k in t) {
            if (err = hasType(x[k], t[k])) {
                return `object with field "${k}" that is ${err}`;
            }
        }
    }
}

export default class Tag {
    constructor(name, ...args) {
        this.name = name;
        this.args = args;
    }

    match(alternatives) {
        let alt = alternatives[this.name];

        if (typeof alt === 'undefined') {
            alt = alternatives.default;
        }

        if (typeof alt === 'function') {
            return alt.apply(null, this.args);
        } else if (typeof alt === 'undefined') {
            throw new Error(`No case provided for "${this.name}"`);
        } else {
            return alt;
        }
    }

    toString() {
        return `${this.name}(${this.args.map(JSON.stringify).join(', ')})`;
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

    static define(name, ...types) {
        if (types.length === 0) {
            return new Tag(name);
        }

        let fn = (...args)=> {
            if (args.length !== types.length) {
                throw new Error(
    `Tag constructor "${name}" expects ${types.length} arguments, not ${args.length}`
                );
            }

            for (let i = 0; i < args.length; i++) {
                let arg  = args[i],
                    type = types[i],
                    err  = hasType(arg, type);

                if (err) {
                    throw new Error(
      `Tag constructor "${name}" expected argument ${i + 1} to be ${err}`
                    );
                }
            }

            return new Tag(name, ...args);
        };

        fn.tagName = name;

        return fn;
    }

    static any() {
        return null;
    }

    static number(x) {
        return typeof x === 'number' ? null : 'number';
    }
    
    static string(x) {
        return typeof x === 'string' ? null : 'string';
    }

    static boolean(x) {
        return typeof x === 'boolean' ? null : 'boolean';
    }

    static objectOf(type) {
        return function(x) {
            if (typeof x !== 'object') return 'object';

            let err;

            for (let k in x) {
                if (err = hasType(x[k], type)) {
                    return `object of ${err}`;
                }
            }
        };
    }

    static arrayOf(type) {
        return function(arr) {
            if (!(arr instanceof Array)) return 'array';

            let err;

            for (let x of arr) {
                if (err = hasType(x, type)) {
                    return `array of ${err}`;
                }
            }
        };
    }

    static oneOf(...types) {
        return function(x) {
            let errs = [];
            let err;

            for (let type of types) {
                if (err = hasType(x, type)) {
                    errs.push(err);
                } else {
                    return;
                }
            }

            return errs.join(' or ');
        };
    }

    static validate(message, fn) {
        return function(x) {
            return fn(x) ? null : message;
        }
    }
}

