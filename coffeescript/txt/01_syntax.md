2. General syntax, objects, arrays, flow control, functions, switch, string interpolation

No semicolons
Comments
Whitespace - no superset
Compiler written in coffeeScript

#Variables & Scope

CoffeeScript fixes one of the major bugbears with JavaScript, global variables. In JavaScript, it's all too easy to accidentally declare a global variable by forgetting to declare `var` before the variable assignment. CoffeeScript solves this by simply removing global variables. Behind the scenes, CoffeeScript wraps up scripts with a anonymous function, keeping the local context, and automatically prefixes all variable assignments with `var`. For example, take this simple variable assignment in CoffeeScript:

    myVariable = "test"

As you can see, the variable assignment is kept completely local, it's impossible to accidentally create a global variable. CoffeeScript actually takes this a step further, and makes it impossible to shadow a higher-level variable. This goes a great deal to prevent some of the most common mistakes developers make in JavaScript.

However, sometimes it's useful to create global variables. You can either do this by directly setting them as properties on `window`, or with the following pattern:

    exports = this
    exports.MyVariable = "foo-bar"
    
In the root context, `this` is equal to the `window` object, and by creating a local `exports` variable you're making it really obvious to anyone reading your code exactly which global variables a script is creating. Additionally, it paves the way for CommonJS modules, which we're going to cover later in the book. 

#Functions

CoffeeScript removes the rather verbose `function` statement, and replaces it with an thin arrow: `->`. Functions can be one liners, or indented on multiple lines. The last expression in the function is implicitly returned. In other words, you don't need to use the `return` statement unless you want to return earlier inside the function. 
    
With that in mind, let's take a look at an example:
    
    func = -> "bar"

You can see in the resultant compilation, the `->` is turned into a `function` statement, and the `"bar"` string is automatically returned.

As mentioned earlier, there's no reason why the we can't use multiple lines, as long we indent the function body properly.

    func = ->
      # An extra line
      "bar"
      
##Function arguments

How about specifying arguments? Well, CoffeeScript lets you do that by specifying arguments in a pair of rounded brackets before the arrow.

    times = (a, b) -> a * b

Which compiles to:

    var times;
    times = function(a, b) {
      return a * b;
    };

CoffeeScript supports default arguments too, for example:

    times = (a = 1, b = 2) -> a * 2
    
You can also use splats to accept multiple arguments, denoted by `...`:

    sum = (nums...) -> 
      result = 0
      nums.forEach (n) -> result += n
      result

In the example above, `nums` is an array of all the arguments passed to the function. 

##Function invocation

Functions can be invoked exactly as in JavaScript, with brackets `()`, `apply()` or `call()`. However, like Ruby, CoffeeScript will automatically call functions if they are invoked with at least one argument.

    a = "Howdy!"
    
    alert a
    # Equivalent to:
    alert(a)

    alert inspect a
    # Equivalent to:
    alert(inspect(a))
    
Although parenthesis is optional, I'd recommend using it if it's not immediately obvious what's being invoked, and with which arguments. In the last example, with `inspect`, I'd definitely recommend wrapping at least the `inspect` invocation in brackets

    alert inspect(a)

If you don't pass any arguments with an invocation, CoffeeScript has no way of working out if you intend to invoke the function, or just treat it like a variable. In this respect, CoffeeScript's behavior differs from Ruby which always invokes references to functions, and more similar to Python's. This has been the source of a few errors in my CoffeeScript programs, so it's worth keeping an eye out for cases where you intend to call a function without any arguments, and include parenthesis.

##Function context

Context changes are rife within JavaScript, especially with event callbacks, so CoffeeScript provides a few helpers to manage this. One such helper is a variation on `->`, the fat arrow function: `=>`

Using the fat arrow instead of the thin arrow ensures that the function context will be bound to the local one. For example:

    this.clickHandler = -> alert "clicked"
    element.addEventListener "click", (e) => this.clickHandler(e)

The reason you might want to do this, is that callbacks from `addEventListener()` are executed in the context of the `element`, i.e. `this` equals the element. If you want to keep `this` equal to the local context, without doing a `self = this` dance, fat arrows are the way to go. 

This binding idea is a similar concept to jQuery's [`proxy()`](http://api.jquery.com/jQuery.proxy/) or [ES5's](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind) `bind()` functions. 

#Object literals & arrays

Object literals can be specified exactly as in JavaScript, with a pair of braces and key/value statements. However, like with function invocation, CoffeeScript makes the braces optional. In fact, you can also use indentation and new lines instead of comma separation.  

    object1 = {one: 1, two: 2}

    # Without braces
    object2 = one:1, two:2
    
    # Using new lines instead of commas
    object3 = 
      one: 1
      two: 2
    
    User.create(name: "John Smith")

Likewise, arrays can use whitespace instead of comma separators, although the square brackets (`[]`) are still required.

    array1 = [1, 2, 3]

    array2 = [
      1
      2
      3
    ]

    array3 = [1,2,3,]
    
As you can see in the example above, CoffeeScript has also stripped the trailing comma in `array3`, another common source of cross-browser errors. 

#Flow control

The convention of optional parentheses continues with CoffeeScript's `if` and `else` keywords.

    if true == true
      "We're ok"
      
    if true != true then "Panic"
    
    # Equivalent to:
    #  (1 > 0) ? "Ok" : "Y2K!"
    if 1 > 0 then "Ok" else "Y2K!"
    
As you can see above, if the `if` statement is on one line, you'll need to use the `then` keyword, so CoffeeScript knows when the function body begins. Conditional operators (`?:`) are not supported, instead you should use a single line `if/else` statement.

CoffeeScript also includes a Ruby idiom of allowing suffixed `if` statements.

    alert "It's cold!" if heat < 5

Instead of using the exclamation mark (`!`) for negation, you can also use the `not` keyword - which can sometimes make your code more readable as exclamation marks can be easy to miss.

    if not true then "Panic"
    
In the example above, we could also use the CoffeeScript's `unless` statement, the opposite of `if`.

    unless true
      "Panic"

In a similar fashion to `not`, CoffeeScript also introduces the `is` statement, which translates to `===`.

    if true is 1
      "Type coercian fixed!"

You may have noticed in the examples above, that CoffeeScript is converting `==` statements into `===` and `!=` statements into `!==`. This is one of my favorite features to the language, and yet one of the most simple. What's the reasoning behind this? Well frankly JavaScript's type coercion is a bit odd, and its equality operator coerces types in order to compare them, leading to some confusing behaviors and the source of many bugs. 

The example below is taken from [JavaScript Garden's equality section](http://bonsaiden.github.com/JavaScript-Garden/#types.equality) which delves into the issue in some depth. 

<span class="noconvert"></span>

    ""           ==   "0"           // false
    0            ==   ""            // true
    0            ==   "0"           // true
    false        ==   "false"       // false
    false        ==   "0"           // true
    false        ==   undefined     // false
    false        ==   null          // false
    null         ==   undefined     // true
    " \t\r\n"    ==   0             // true
  
The solution is to use the strict equality operator, which consists of three equal signs: `===`. It works exactly like the normal equality operator, but without any type coercion. It's recommended to always use the strict equality operator, and explicitly convert types if needs be. As mentioned earlier, this is the default in CoffeeScript, with any weak equality operators being converted into strict ones. 

    if 10 == "+10" then "type coercion fail"

#Loops and Comprehensions

array loops
object loops
while

#Arrays

slicing 
ranges
in
slicing strings

#Aliases

    @

    ::

#The Existential Operator
