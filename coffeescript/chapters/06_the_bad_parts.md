<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#The Bad Parts

JavaScript is a tricky beast, and knowing the parts that you should avoid is just as important as knowing about the parts you should use. As Sun Tzu says, "know your enemy", and that's exactly what we're going to do in the chapter, exploring the dark side of JavaScript and revealing all the lurking monsters ready to pounce on the unsuspecting developer. 

As I mentioned in the introduction, CoffeeScript's awesomeness lies not only in it's syntax, but in it's ability to fix some of JavaScript's warts. However, due to the fact CoffeeScript uses static analysis and has no runtime type checking, it's not a silver bullet to all of JavaScript's bugbears and there's still some issues you need to be aware about.

First, let's talk about what things the language does solve. 

##A JavaScript Subset

CoffeeScript's syntax is already a subset of JavaScript's, so already there's less to fix. Let's take the `with` statement for example. This statement has for a long time been "considered harmful", and should be avoided. `with` was intended to provide a shorthand for writing recurring property lookups on objects. For example, instead of writing:

    dataObj.users.alex.email = "info@eribium.org";
    
You could write:

    with(dataObj.users.alex) {
      email = "info@eribium.org";
    }
    
Setting aside the fact that we shouldn't have such a deep object in the first place, the syntax is quite cleaner. Except for one thing. It's damn confusing to the JavaScript interpreter - it doesn't know exactly what you're going to do in the `with` context, and forces the specified object to be searched first for all name lookups. 

This really hurts performance and means the interpreter has to turn off all sorts of JIT optimizations. Additionally `with` statements can't be minified using tools like [uglify-js](https://github.com/mishoo/UglifyJS). All things considered, it's much better just to avoid using them, and CoffeeScript takes this a step further by eliminating them from it's syntax. In other words, using `with` in CoffeeScript will throw a syntax error. 

##Global variables

By default, your JavaScript programs run in a global scope, and by default any variables created are in that global scope. If you want to create a variable in the local scope, JavaScript requires explicitly indicating that fact using the `var` keyword. 

    usersCount = 1;        // Global
    var groupsCount = 2;   // Global
                          
    (function(){              
      pagesCount = 3;      // Global
      var postsCount = 4;  // Local
    })()

This is a bit of an odd decision decision since the vast majority of the time you'll be creating local variables not global, so why not make that the default? As it stands, developers have to remember to put `var` statements before any variables they're initializing, or face weird bugs when variables accidentally conflict and overwrite each other.

Luckily CoffeeScript comes to your rescue here by eliminating implicit global variable assignment entirely. In other words, the `var` keyword is reserved in CoffeeScript, and will trigger a syntax error if used. Local variables are created implicitly by default, and it's impossible to create global variables without explicitly assigning them as properties on `window`.

Let's have a look at an example of CoffeeScript's variable assignment:

<span class="csscript"></span>

    outerScope = true
    do ->
      innerScope = true
      
Compiles down to:

    var outerScope;
    outerScope = true;
    (function() {
      var innerScope;
      return innerScope = true;
    })();
    
Notice how CoffeeScript initializes variables (using `var`) automatically in the context their first used. Whilst it's impossible to shadow outer variables, you can still refer to and access them. You need to watch out for this, be careful that you're not reusing the name of an external variable accidentally if you're writing a deeply nested function or class. For example, here we're accidentally overwriting the `package` variable in a Class function:

<span class="csscript"></span>

    package = require('./package')
    
    class Hem
      build: ->
        # Overwrites outer variable!
        package = @hemPackage.compile()
        
      hemPackage: ->
        package.create()
        
Global variables are needed from time to time, and to create those you need to set them as properties on `window`:

<span class="csscript"></span>

      class window.Asset
        constructor: ->

By ensuring global variables are explicit, rather than implicit, CoffeeScript removes one of the major sources of bugs in JavaScript programs.

##Semicolons

JavaScript does not enforce the use of semicolons in source code, so it's possible to omit them. However, behind the scenes the JavaScript compiler still needs them, so the parser automatically inserts them whenever it encounters a parse error due to a missing semicolon. In other words, it'll try to evaluate a statement without semicolons and, if that fails, try again using semicolons.

Unfortunately this is a tremendously bad idea, and can actually change the behavior of your code. Take the following example, seems valid JavaScript, right?

    function() {}
    (window.options || {}).property
    
Wrong, well at least according to the parser; it raises a syntax error. In case of a leading parenthesis, the parser will not insert a semicolon. The code gets transformed onto one line:

    function() {}(window.options || {}).property

Now you can see the issue, and why the parser is complaining. When you're writing JavaScript, you should always include semicolons after statements. Fortunately CoffeeScript gets round all this hassle by not having semicolons in its syntax. Rather the semicolons are inserted automatically (at the right places) when the CoffeeScript is compiled down to JavaScript.

##Reserved words

Certain keywords in JavaScript are reserved for future versions of JavaScript, such as `const`, `enum` and `class`. Using these as variable names in your JavaScript programs can unpredictable results; some browsers will cope with them just fine, and others will choke. CoffeeScript neatly sidesteps this issue, by detecting if you're using a reserved keyword, and escaping it if necessary.

For example, let's say you were to use the reserved keyword `class` as a property on an object, your CoffeeScript might look like this:

<span class="csscript"></span>

    myObj = {
      delete: "I am a keyword!"
    }
    myObj.class = ->
    

The CoffeeScript parser notices you're using a reserved keyword, and quotes it for you:

    var myObj;
    myObj = {
      "delete": "I am a keyword!"
    };
    myObj["class"] = function() {};
    
##Equality comparisons

The weak equality comparison in JavaScript is broken.

    ""           ==   "0"           // false
    0            ==   ""            // true
    0            ==   "0"           // true
    false        ==   "false"       // false
    false        ==   "0"           // true
    false        ==   undefined     // false
    false        ==   null          // false
    null         ==   undefined     // true
    " \t\r\n"    ==   0             // true
    
CoffeeScript solves this by simply replacing all weak comparisons with strict ones. 

This doesn't mean you can't blah coerciion TODO

#The un-fixed parts

Whilst CoffeeScript goes some length to solving some of JavaScript's design flaws, it can only go so far.

##Using eval

Whilst CoffeeScript removes some of JavaScript's foibles, other features are a necessary evil, you just need to be aware of their shortcomings. A case in point, is the `eval()` function. Whilst undoubtedly it has its uses, you should know about its drawbacks, and avoid it if possible. The `eval()` function will execute a string of JavaScript code in the local scope, and functions like `setTimeout()` and `setInterval()` can also both take a string as their first argument to be evaluated. 

However, like `with`, `eval()` throws the compiler off track, and is a major performance hog. As the compiler has no idea what's inside until runtime, it can't perform any optimizations like inlining. Another concern is with security. If you give it dirty input, `eval` can easily open up your code for injection attacks. 99% of the time when you're using `eval`, there are better & safer alternatives (such as square brackets).

<span class="csscript"></span>

    # Don't do this
    model = eval(modelName)
    
    # Use square brackets instead
    model = window[modelName]
    
##Using typeof

The `typeof` operator is probably the biggest design flaw of JavaScript, simply because it's basically completely broken. In fact, it really has only one use, checking to see if a value is `undefined`.

<span class="csscript"></span>

    typeof undefinedVar is "undefined"

For all other types of type checking, `typeof` fails rather miserably, returning inconsistent results depending on the browser and how instances were instantiated. This isn't something that CoffeeScript can help you either, since the language uses static analysis and has no runtime type checking. You're on your own here.

To illustrate the problem, here's a table taken from [JavaScript Garden](TODO) which shows some of the major inconstancies in the keyword's type checking. 
  
    Value               Class      Type
    -------------------------------------
    "foo"               String     string
    new String("foo")   String     object
    1.2                 Number     number
    new Number(1.2)     Number     object
    true                Boolean    boolean
    new Boolean(true)   Boolean    object
    new Date()          Date       object
    new Error()         Error      object
    [1,2,3]             Array      object
    new Array(1, 2, 3)  Array      object
    new Function("")    Function   function
    /abc/g              RegExp     object
    new RegExp("meow")  RegExp     object
    {}                  Object     object
    new Object()        Object     object
    
As you can see, depending on if you define a string with quotes or with the `String` class affects the result of `typeof`. Logically `typeof` should return `"string"` for both checks, but for the latter it returns `"object"`. Unfortunately the inconstancies only get worse from there. 

So what can we use for type checking in JavaScript? Well, luckily `Object.prototype.toString()` comes to the rescue here. If we invoke that function in the context of a particular object, it'll return the correct type. All we need to do is massage the string it returns, so we end up with the sort of string `typeof` should be returning. Here's an example implementation ported from jQuery's `$.type`:

<span class="csscript"></span>

    type = do ->
      classToType = {}
      for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
        classToType["[object " + name + "]"] = name.toLowerCase()
      
      (obj) ->
        strType = Object::toString.call(obj)
        classToType[strType] or "object"
    
    # Returns the sort of types we'd expect:
    type("")         # "string"
    type(new String) # "string"
    type([])         # "array"
    type(/\d/)       # "regexp"
    type(new Date)   # "date"
    type(true)       # "boolean"
    type(null)       # "null"
    type({})         # "object"
    
If you're checking to see if an variable has been defined, you'll still need to use `typeof` otherwise you'll get a `ReferenceError`.

<span class="csscript"></span>

    if typeof aVar isnt "undefined"
      objectType = type(aVar)
    
As an alternative to type checking, you can often use duck typing and the CoffeeScript existential operator together to eliminating the need to resolve an object's type. For example, let's say we're pushing a value onto an array. We could say that, as long as the 'array like' object implements `push()`, we should treat it like an array:

<span class="csscript"></span>

    anArray?.push? aValue
    
If `anArray` is an object other than an array than the existential operator will ensure that `push()` is never called.
    
##Using instanceof

JavaScript's `instanceof` keyword is nearly as broken as `typeof`. Ideally `instanceof` would compare the constructor of two object, returning a boolean if one was an instance of the other. However, in reality `instanceof` only works when comparing custom made objects. When it comes to comparing built-in types, it's as useless as `typeof`. 

<span class="csscript"></span>

    new String("foo") instanceof String # true
    "foo" instanceof String             # false
    
It only returns a correct result for custom made objects.

<span class="csscript"></span>

    class Parent
    class Child extends Parent
    
    child = new Child
    child instanceof Child  # true
    child instanceof Parent # true
    
Make sure you only use it for your own objects or, even better, stick clear of it.

##Using delete

The `delete` keyword can only safely be used for removing properties inside objects. 

<span class="csscript"></span>

    anObject = {one: 1, two: 2}
    delete anObject.one
    anObject.hasOwnProperty("one") # false

Any other use, such as deleting variables or function's won't work.

<span class="csscript"></span>

    aVar = 1
    delete aVar
    typeof Var # "integer"

It's rather peculiar behavior, but there you have it. If you want to remove a reference to a variable, just assign it to `null` instead.

<span class="csscript"></span>

    aVar = 1
    aVar = null

##Using parseInt


    2.toString()
    
##Strict checking

All you need to do to enable strict checking, is start your script or function with the following string:

<span class="csscript"></span>

    "use strict"
    
    # rest of script ...

---------

==
global variables (and overwriting issue)
typeof
instanceof
parseInt
hasOwnProperty
The function Statement Versus the function Expression
shimming
Strict checking
Semicolons
reserved words
jslint

"use strict"