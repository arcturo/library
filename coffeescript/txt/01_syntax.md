2. General syntax, objects, arrays, flow control, functions, switch, string interpolation

No semicolons
Comments
Whitespace - no superset
Compiler written in coffeeScript

#Variables & Scope

CoffeeScript fixes one of the major bugbears with JavaScript, global variables. In JavaScript, it's all too easy to accidentally declare a global variable by forgetting to declare `var` before the variable assignment. CoffeeScript solves this by simply removing global variables. Behind the scenes, CoffeeScript wraps up scripts with a anonymous function, keeping the local context, and automatically prefixes all variable assignments with `var`. For example, take this simple variable assignment in CoffeeScript:

    myVariable = "test"

When compiled, the resultant JavaScript looks like this:

    (function() {
      var myVariable;
      myVariable = "test";
    }).call(this);

As you can see, the variable assignment is kept completely local, it's impossible to accidentally create a global variable. CoffeeScript actually takes this a step further, and makes it impossible to shadow a higher-level variable. This goes a great deal to prevent some of the most common JavaScript mistakes.

However, sometimes it's useful to create global variables. You can either do this by directly setting them as properties on `window`, or with the following pattern:

    exports = this
    exports.MyVariable = "foo-bar"
    
In the root context, `this` is set to the `window`, and by creating a local `exports` variable you're making it really obvious to anyone reading your code exactly which global variables a script is creating. Additionally, it paves the way for CommonJS modules, which we're going to cover later in the book. 

#Functions

CoffeeScript get's rid of the rather verbose `function` statement, and replaces it with an thin arrow: `->`. Functions can be one liners, or indented on multiple lines. The last expression in the function is implicitly returned. In other words, you don't need to use the `return` statement unless you want to return earlier inside the function. 
    
With that in mind, let's take a look at an example:
    
    func = -> "bar"

The resultant compilation looks like this, with the `->` turned into a `function` statement, and the `"bar"` string automatically being returned.

    var func;
    func = function() {
      return "bar";
    };

As mentioned earlier, there's no reason why the we can't use multiple lines, as long we indent the function body properly.

    func = ->
      # An extra line
      "bar"
      
##Function arguments

How about specifying arguments? Well, CoffeeScript lets you do that by specifying arguments in a pair of round brackets before the arrow.

    times = (a, b) -> a * b

Which compiles to:

    var times;
    times = function(a, b) {
      return a * b;
    };

CoffeeScript supports default arguments too, for example:

    times = (a = 1, b = 2) -> a * 2
    
Which compiles to:

    var times;
    times = function(a, b) {
      if (a == null) {
        a = 1;
      }
      if (b == null) {
        b = 2;
      }
      return a * 2;
    };
    
You can also use splats to accept multiple arguments, denoted by `...`:

    times = (nums...) -> 
      result = 1
      nums.forEach (n) -> result *= n
      result

Which compiles to:

    var times;
    var __slice = Array.prototype.slice;
    times = function() {
      var nums, result;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      result = 1;
      nums.forEach(function(n) {
        return result *= n;
      });
      return result;
    };

##Function invocation

Functions can be invoked exactly as in JavaScript, with brackets `()`, `apply()` or `call()`. However, like Ruby, CoffeeScript will automatically invoke functions with parenthesis if they are invoked with at least one argument.

    a = "Howdy!"
    alert a
    alert(a)

    alert inspect a
    alert(inspect(a))
    
Although parenthesis is optional, I'd recommend using it if it's not immediately obvious what's being invoked, and with which arguments. In the last example, with `inspect`, I'd definitely recommend wrapping at least the `inspect` invocation in brackets

    alert inspect(a)

If you don't pass any arguments with an invocation, CoffeeScript has no way of working out if you intend to invoke the function, or just treat it like a variable. In this respect, CoffeeScript's behavior differs from Ruby which always invokes references to functions, and more similar to Python's. This has been the source of a few errors in my CoffeeScript programs, so it's worth keeping an eye out for cases where you intend to call a function without arguments and parenthesis.

##Function context

Context changes are rife within JavaScript, especially with event callbacks, so CoffeeScript provides a few helpers to manage this. One such helper is a variation on `->`, the fat arrow function: `=>`

Using the fat arrow instead of the thin arrow ensures that the function context will be bound to the local one. For example:

    element.addEventListener "click", => this.clickHandler
    
Compiles down to:
    
    var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
    element.addEventListener("click", __bind(function() {
      return this.clickHandler;
    }, this));
    
The reason you might want to do this, is that callbacks from `addEventListener()` are executed in the context of the `element`, i.e. `this` equals the element. If you want to keep `this` equal to the local context, without doing a `self = this` dance, fat arrows are the way to go. 

This binding idea is a similar concept to to [`jQuery.proxy()`](http://api.jquery.com/jQuery.proxy/) or [ES5's](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind) `bind()` function.

#Object literals

:

#Flow control

if 
else 
unless
one liners

no  "Liz" : "Ike";

#Loops and Comprehensions

array loops
object loops
while

#Arrays

slicing 
ranges
in
slicing strings

#Operators and Aliases

not == !
== == ===
is ===

!==

@

::

#The Existential Operator
