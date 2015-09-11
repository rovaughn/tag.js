tag
===

Algebraic datatypes for javascript.

Examples are written in ES6.

    let Just = Tag.define('Just', 1);
    let Nothing = Tag.define('Nothing', 0);

    Just(3).match({
    Just: (x)=> {
        console.log('The value was just', x);
        return x*10;
    },
    Nothing: => {
        console.log('The value was nothing');
        return -5;
    }
    });

    // prints The value was just 3

TODO
----

- Integrate with React type checking.
- Maybe a more symbol-based match thing.  Like `let A = Tag.define('A')`, then
  `A(1).match({ [A]: (x)=> x })` would produce `1`.  Then the string tag
  wouldn't even be necessary.  This would make a lot more sense when importing
  between modules.  Tags defined in two different modules wouldn't step on
  each other's foot.
- Use the fact of whether or not the tag is nullary to determine if the
  match-case should be called as a function or returned directly as a value.
  (Then again, what about executing, like the example above.)

