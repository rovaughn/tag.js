import { test } from 'tape';
import Tag from './tag';

test('tag matching', (t)=> {
    t.plan(5);

    let A = Tag.define('A', Tag.any, Tag.any, Tag.any);
    let B = Tag.define('B', Tag.any, Tag.any);
    let C = Tag.define('C', Tag.any);
    let D = Tag.define('D');
    let E = Tag.define('E');

    let f = (tag)=> tag.match({
        A: (x, y, z)=> x + y + z,
        B: (x, y)   => x * y,
        C: (x)      => -x,
        D:             10,

        default: ()=>  7
    });

    t.equal(f(A(1, 2, 3)), 6);
    t.equal(f(B(4, 5)), 20);
    t.equal(f(C(7)), -7);
    t.equal(f(D), 10);
    t.equal(f(E), 7);
});

test('matching throws when no alternative', (t)=> {
    t.plan(1);

    let A = Tag.define('A');

    t.throws(function() {
        A.match({
            E: 3
        });
    }, /No case provided for "A"/);
});

test('define validates argument counts', (t)=> {
    t.plan(2);

    let T2 = Tag.define('T', Tag.any, Tag.any);

    t.throws(function() {
        T2(1);
    }, /Tag constructor "T" expects 2 arguments, not 1/);

    t.throws(function() {
        T2(1, 2, 3);
    }, /Tag constructor "T" expects 2 arguments, not 3/);
});

test('define validates shapes', (t)=> {
    t.plan(4);

    let S = Tag.define('S');
    let Z = Tag.define('Z');

    let Many = Tag.define('T', {
        any: Tag.any,
        num: Tag.number,
        str: Tag.string,
        boo: Tag.boolean,
        obj: Tag.objectOf(Tag.number),
        arr: Tag.arrayOf(Tag.string),
        one: Tag.oneOf(S, Z),
        cus: Tag.validate('in range (0, 5)', (x)=> x > 0 && x < 5)
    });

    t.ok(Many({
        any: 5,
        num: 3,
        str: 'str',
        boo: false,
        obj: {x: 1},
        arr: ['one', 'two'],
        one: S,
        cus: 3
    }));

    t.throws(function() {
        Tag.define('T', {
            num: Tag.number
        })({
            num: 'asdf'
        });
    });

    t.throws(function() {
        Tag.define('T', {
            num: Tag.number
        })({});
    });

    t.throws(function() {
        Tag.define('T', {
            num: Tag.number
        })({
            num: 3,
            str: 'asdf'
        });
    });
});

test('toString()', (t)=> {
    t.plan(1);

    let Test = Tag.define('Test', Tag.any, Tag.any, Tag.any);
    let tag = Test('hi', 2, 3);

    t.equal(tag.toString(), 'Test("hi", 2, 3)');
});

test('set()', (t)=> {
    t.plan(3);

    let Test = Tag.define('Test', Tag.any);
    let tag1 = Test({a: 1, b: 2});
    let tag2 = tag1.set({a: 5});
    let tag3 = tag1.set({a: 6, b: 10, c: 7});

    t.deepEqual(tag1, tag1, 'Original tag is not mutated');
    t.deepEqual(tag2, new Tag('Test', {a: 5, b: 2}), 'Setting one property');
    t.deepEqual(tag3, new Tag('Test', {a: 6, b: 10, c: 7}), 'Setting multiple');
});

