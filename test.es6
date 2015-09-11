import { test } from 'tape';
import Tag from './tag';

test('tag matching', (t)=> {
    t.plan(4);

    let A = Tag.define('A', 3);
    let B = Tag.define('B', 2);
    let C = Tag.define('C', 1);
    let D = Tag.define('D', 0);

    let f = (tag)=> tag.match({
        A: (x, y, z)=> x + y + z,
        B: (x, y)   => x * y,
        C: (x)      => -x,
        D:             10
    });

    t.equal(f(A(1, 2, 3)), 6);
    t.equal(f(B(4, 5)), 20);
    t.equal(f(C(7)), -7);
    t.equal(f(D), 10);
});

test('define validates argument counts', (t)=> {
    t.plan(2);

    let T2 = Tag.define('T', 2);

    t.throws(function() {
        T2(1);
    }, /Tag constructor "T" expects 2 arguments, not 1/);

    t.throws(function() {
        T2(1, 2, 3);
    }, /Tag constructor "T" expects 2 arguments, not 3/);
});

test('toString()', (t)=> {
    t.plan(1);

    let Test = Tag.define('Test', 3);
    let tag = Test('hi', 2, 3);

    t.equal(tag.toString(), 'Test("hi", 2, 3)');
});

test('toJSON()/fromJSON()', (t)=> {
    t.plan(3);

    let Test = Tag.define('Test', 3);
    let tag = Test(1, 'hello', 3);

    let json = JSON.stringify(tag);
    let parsed = Tag.fromJSON(JSON.parse(json));

    t.deepEqual(tag.toJSON(), ["Test", 1, 'hello', 3], 'toJSON() as expected');
    t.deepEqual(tag, parsed, 'Tag is equal to the parsed version');
    t.equal(json, '["Test",1,"hello",3]', 'JSON is as expected');
});

test('set()', (t)=> {
    t.plan(3);

    let Test = Tag.define('Test', 1);
    let tag1 = Test({a: 1, b: 2});
    let tag2 = tag1.set({a: 5});
    let tag3 = tag1.set({a: 6, b: 10, c: 7});

    t.deepEqual(tag1, tag1, 'Original tag is not mutated');
    t.deepEqual(tag2, new Tag('Test', {a: 5, b: 2}), 'Setting one property');
    t.deepEqual(tag3, new Tag('Test', {a: 6, b: 10, c: 7}), 'Setting multiple');
});

