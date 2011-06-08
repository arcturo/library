<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#CoffeeScript Syntax

Firstly, before we get any further into this section, I want to reiterate that while CoffeeScript's syntax is often identical with JavaScript's, it's not a superset, and therefore some JavaScript keywords, such as `function` and `var` aren't permitted, and will throw syntax errors. If you're writing a CoffeeScript file, it needs to be pure CoffeeScript; you can't intermingle the two languages. 

Why isn't CoffeeScript a superset? Well, the very fact that whitespace is significant in CoffeeScript programs prevents it being a superset. And, once that's decision's been made, the team decided you might as well go the full hog and deprecate some JavaScript keywords and features in the name of simplicity and in an effort to reduce many commonly occurring bugs. 

What I find mind-blowing, in a meta sort of way, is that the CoffeeScript interpreter itself is actually written in CoffeeScript. It looks like the chicken or egg paradox has finally been solved!

Right, so firstly let's tackle the basic stuff. There's no semicolons in CoffeeScript, it'll add them automatically for you upon compilation. Semicolons were the cause of much debate in the JavaScript community, and behind some weird interpreter [behavior](http://bonsaiden.github.com/JavaScript-Garden/#core.semicolon). Anyway, CoffeeScript resolves this problem for you by simply removing semi-colons from its syntax, adding them as needed behind the scenes.

Comments are in the same format as Ruby comments, starting with a hash character. 

    # A comment
    
Multiline comments are also supported, and are brought forward to the generated JavaScript. They're enclosed by three hash characters.

<span class="csscript"></span>

    ###
      A multiline comment, perhaps a LICENSE.
    ###

As I briefly alluded to, whitespace is significant in CoffeeScript. In practice, this means that you can replace curly brackets (`{}`) with a tab. This takes inspiration from Python's syntax, and has the excellent side-effect of ensuring that your script is formatted in a sane manner, otherwise it won't even compile!

##Variables & Scope

CoffeeScript fixes one of the major bugbears with JavaScript, global variables. In JavaScript, it's all too easy to accidentally declare a global variable by forgetting to include `var` before the variable assignment. CoffeeScript solves this by simply removing global variables. Behind the scenes, CoffeeScript wraps up scripts with a anonymous function, keeping the local context, and automatically prefixes all variable assignments with `var`. For example, take this simple variable assignment in CoffeeScript:

<span class="csscript"></span>

    myVariable = "test"

Notice the dark grey box in the top right of the code example above. Give that a click, and the code will toggle between CoffeeScript and the compiled JavaScript. This is rendered right inside the page at runtime, so you assured the compiled output is accurate. 

As you can see, the variable assignment is kept completely local, it's impossible to accidentally create a global variable. CoffeeScript actually takes this a step further, and makes it impossible to shadow a higher-level variable. This goes a great deal to prevent some of the most common mistakes developers make in JavaScript.

However, sometimes it's useful to create global variables. You can either do this by directly setting them as properties on the global object (`window` in browsers), or with the following pattern:

<span class="csscript"></span>

    exports = this
    exports.MyVariable = "foo-bar"
    
In the root context, `this` is equal to the global object, and by creating a local `exports` variable you're making it really obvious to anyone reading your code exactly which global variables a script is creating. Additionally, it paves the way for CommonJS modules, which we're going to cover later in the book. 

##Functions

CoffeeScript removes the rather verbose `function` statement, and replaces it with an thin arrow: `->`. Functions can be one liners, or indented on multiple lines. The last expression in the function is implicitly returned. In other words, you don't need to use the `return` statement unless you want to return earlier inside the function. 
    
With that in mind, let's take a look at an example:
    
<span class="csscript"></span>

    func = -> "bar"

You can see in the resultant compilation, the `->` is turned into a `function` statement, and the `"bar"` string is automatically returned.

As mentioned earlier, there's no reason why the we can't use multiple lines, as long we indent the function body properly.

<span class="csscript"></span>

    func = ->
      # An extra line
      "bar"
      
###Function arguments

How about specifying arguments? Well, CoffeeScript lets you do that by specifying arguments in a pair of rounded brackets before the arrow.

<span class="csscript"></span>

    times = (a, b) -> a * b

CoffeeScript supports default arguments too, for example:

<span class="csscript"></span>

    times = (a = 1, b = 2) -> a * 2
    
You can also use splats to accept multiple arguments, denoted by `...`

<span class="csscript"></span>

    sum = (nums...) -> 
      result = 0
      nums.forEach (n) -> result += n
      result

In the example above, `nums` is an array of all the arguments passed to the function. It's not an `arguments` object, but rather a real array, so you don't need to concern yourself with `Array.prototype.splice` or `jQuery.makeArray()` if you want to manipulate it. 

<span class="csscript"></span>

    trigger = (events...) ->
      events.splice(1, 0, this)
      this.parent.trigger.apply(events)

###Function invocation

Functions can be invoked exactly as in JavaScript, with brackets `()`, `apply()` or `call()`. However, like Ruby, CoffeeScript will automatically call functions if they are invoked with at least one argument.

<span class="csscript"></span>

    a = "Howdy!"
    
    alert a
    # Equivalent to:
    alert(a)

    alert inspect a
    # Equivalent to:
    alert(inspect(a))
    
Although parenthesis is optional, I'd recommend using it if it's not immediately obvious what's being invoked, and with which arguments. In the last example, with `inspect`, I'd definitely recommend wrapping at least the `inspect` invocation in brackets

<span class="csscript"></span>

    alert inspect(a)

If you don't pass any arguments with an invocation, CoffeeScript has no way of working out if you intend to invoke the function, or just treat it like a variable. In this respect, CoffeeScript's behavior differs from Ruby which always invokes references to functions, and more similar to Python's. This has been the source of a few errors in my CoffeeScript programs, so it's worth keeping an eye out for cases where you intend to call a function without any arguments, and include parenthesis.

###Function context

Context changes are rife within JavaScript, especially with event callbacks, so CoffeeScript provides a few helpers to manage this. One such helper is a variation on `->`, the fat arrow function: `=>`

Using the fat arrow instead of the thin arrow ensures that the function context will be bound to the local one. For example:

<span class="csscript"></span>

    this.clickHandler = -> alert "clicked"
    element.addEventListener "click", (e) => this.clickHandler(e)

The reason you might want to do this, is that callbacks from `addEventListener()` are executed in the context of the `element`, i.e. `this` equals the element. If you want to keep `this` equal to the local context, without doing a `self = this` dance, fat arrows are the way to go. 

This binding idea is a similar concept to jQuery's [`proxy()`](http://api.jquery.com/jQuery.proxy/) or [ES5's](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind) `bind()` functions. 

##Object literals & array definition

Object literals can be specified exactly as in JavaScript, with a pair of braces and key/value statements. However, like with function invocation, CoffeeScript makes the braces optional. In fact, you can also use indentation and new lines instead of comma separation.  

<span class="csscript"></span>

    object1 = {one: 1, two: 2}

    # Without braces
    object2 = one:1, two:2
    
    # Using new lines instead of commas
    object3 = 
      one: 1
      two: 2
    
    User.create(name: "John Smith")

Likewise, arrays can use whitespace instead of comma separators, although the square brackets (`[]`) are still required.

<span class="csscript"></span>

    array1 = [1, 2, 3]

    array2 = [
      1
      2
      3
    ]

    array3 = [1,2,3,]
    
As you can see in the example above, CoffeeScript has also stripped the trailing comma in `array3`, another common source of cross-browser errors. 

##Flow control

The convention of optional parentheses continues with CoffeeScript's `if` and `else` keywords.

<span class="csscript"></span>

    if true == true
      "We're ok"
      
    if true != true then "Panic"
    
    # Equivalent to:
    #  (1 > 0) ? "Ok" : "Y2K!"
    if 1 > 0 then "Ok" else "Y2K!"
    
As you can see above, if the `if` statement is on one line, you'll need to use the `then` keyword, so CoffeeScript knows when the block begins. Conditional operators (`?:`) are not supported, instead you should use a single line `if/else` statement.

CoffeeScript also includes a Ruby idiom of allowing suffixed `if` statements.

<span class="csscript"></span>

    alert "It's cold!" if heat < 5

Instead of using the exclamation mark (`!`) for negation, you can also use the `not` keyword - which can sometimes make your code more readable as exclamation marks can be easy to miss.

<span class="csscript"></span>

    if not true then "Panic"
    
In the example above, we could also use the CoffeeScript's `unless` statement, the opposite of `if`.

<span class="csscript"></span>

    unless true
      "Panic"

In a similar fashion to `not`, CoffeeScript also introduces the `is` statement, which translates to `===`.

<span class="csscript"></span>

    if true is 1
      "Type coercian fixed!"

You may have noticed in the examples above, that CoffeeScript is converting `==` operators into `===` and `!=` into `!==`. This is one of my favorite features to the language, and yet one of the most simple. What's the reasoning behind this? Well frankly JavaScript's type coercion is a bit odd, and its equality operator coerces types in order to compare them, leading to some confusing behaviors and the source of many bugs. 

The example below is taken from [JavaScript Garden's equality section](http://bonsaiden.github.com/JavaScript-Garden/#types.equality) which delves into the issue in some depth. 

<span class="csscript"></span>

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

<span class="csscript"></span>

    if 10 == "+10" then "type coercion fail"
    
##String interpolation

CoffeeScript brings Ruby style string interpolation to JavaScript. Double quotes strings can contain `#{}` tags, which contain expressions to be interpolated into the string. 

<span class="csscript"></span>

    favourite_color = "Blue. No, yel..."
    question = "Bridgekeeper: What... is your favourite colour?
                Galahad: #{favourite_color}
                Bridgekeeper: Wrong!
                "

As you can see in the example above, multiline strings are also allowed, without having to prefix each line with a `+`:

##Loops and Comprehensions

Array iteration in JavaScript has a rather archaic syntax, reminiscent of an older language like C rather than a modern object orientated one. The introduction of ES5 improved that situation somewhat, with the `forEach()` function, but that still requires a function call every iteration and is therefore much slower. Again, CoffeeScript comes to the rescue, with a beautiful syntax:

<span class="csscript"></span>

    for name in ["Roger", "Roderick", "Brian"]
      alert "Release #{name}"
      
If you need the current iteration index, just pass an extra argument:
      
<span class="csscript"></span>

    for name, i in ["Roger the pickpocket", "Roderick the robber"]
      alert "#{i} - Release #{name}"

You can also iterate on one line, using the postfix form. 

<span class="csscript"></span>

    release prisoner for prisoner in ["Roger", "Roderick", "Brian"]
    
As with Python comprehensions, you can filter them:

<span class="csscript"></span>

    prisoners = ["Roger", "Roderick", "Brian"]
    release prisoner for prisoner in prisoners when prisoner[0] is "R" 

You can also use comprehensions for iterating over properties in objects. Instead of the `in` keyword, use `of`.

<span class="csscript"></span>

    names = sam: seaborn, donna: moss
    alert("#{first} #{last}") for first, last of names

The only low level loop that CoffeeScript exposes is the `while` loop. This has similar behavior to the `while` loop in pure JavaScript, but has the added advantage that it returns an array of results, i.e. like the `Array.prototype.map()` function.

<span class="csscript"></span>

    num = 6
    minstrel = while num -= 1
      num + " Brave Sir Robin ran away"

##Arrays

CoffeeScript takes inspiration from Ruby when it comes to array slicing by using ranges. Ranges are created by two numerical values, the first and last positions in the range, separated by `..` or `...`. If a range isn't prefixed by anything, CoffeeScript expands it out into an array.

<span class="csscript"></span>

    range = [1..5]
    
If, however, the range is specified immediately after a variable, CoffeeScript converts it into a `slice()` method call. 
    
<span class="csscript"></span>

    firstTwo = ["one", "two", "three"][0..1]
    
In the example above, the range returns a new array, containing only the first two elements of the original array. You can also use the same syntax for replacing an array segment with another array.

<span class="csscript"></span>

    numbers = [0..9]
    numbers[3..5] = [-3, -4, -5]

What's neat, is that JavaScript allows you to call `slice()` on strings too, so you can use ranges with string to return a new subset of characters. 
    
<span class="csscript"></span>

    my = "my string"[0..2]

Checking to see if a value exists inside an array is always a bore in JavaScript, particular as `indexOf()` doesn't yet have full cross-browser support (IE, I'm talking about you). CoffeeScript solves this with the `in` operator, for example.

<span class="csscript"></span>

    words = ["rattled", "roudy", "rebbles", "ranks"]
    alert "Stop wagging me" if "ranks" in words 

##Aliases & the Existential Operator

CoffeeScript includes some useful aliases to save some typing. One of which is `@`, which is an alias for `this`.

<span class="csscript"></span>

    @saviour = true
    
Another is `::`, which is an alias for `prototype`

<span class="csscript"></span>

    User::first = -> @records[0]
    
Using `if` for `null` checks in JavaScript is common, but has a few pitfalls in that empty strings and zero are both coerced into `false`, which can catch you out. CoffeeScript existential operator `?` returns true unless a variable is `null` or `undefined`, similar to Ruby's `nil?`. 

<span class="csscript"></span>

    praise if brian?
    
You can also use it in place of the `||` operator:

<span class="csscript"></span>

    velocity = southern ? 40
    
If you're using a `null` check before accessing a property, you can skip that by placing the existential operator right before the opening brackets. This is similar to Ruby's `try` method. 

<span class="csscript"></span>

    blackKnight.getLegs()?.kick()

You can safely call a value in the same manner, checking function-ness beforehand.

<span class="csscript"></span>

    whiteKnight.guard? us