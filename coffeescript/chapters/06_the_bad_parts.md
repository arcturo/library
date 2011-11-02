<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#The Bad Parts

JavaScript is a tricky beast, and knowing the parts that you should avoid is just as important as known about the good parts. As Sun Tzu says, know your enemy, and that's exactly what we're going to do in the chapter, exploring the dark side of JavaScript and revealing all the ugly monsters lurking ready to pounce on the unsuspecting developer. 

As I touched on in the introduction, CoffeeScript's awesomeness lies not only in it's syntax, but in it's ability to fix some of JavaScript's warts. However, due to the fact CoffeeScript uses static analysis and has no runtime type checking, it's not a silver bullet to all of JavaScript's bugbears and there's still some issues you need to be aware about.

Let's first talk about what things the language does solve. 

##Subset

CoffeeScript's syntax is already a subset of JavaScript's, so already there's less to fix. Let's take the `with` statement for example. This statement has for a long time been "considered harmful", and should be avoided. `with` was intended to provide a shorthand for writing recurring property lookups on objects. For example, instead of writing:

    dataObj.users.alex.email = "info@eribium.org";
    
You could write:

    with(dataObj.users.alex) {
      email = "info@eribium.org"
    }
    
Setting aside the fact that we shouldn't have such a deep object in the first place, the syntax is quite cleaner. Except for one thing. It's damn confusing to the JavaScript interpreter - it doesn't know exactly what you're going to do in the `with` context, and forces the specified object to be searched first for all name lookups. 

This really hurts performance and means the interpreter has to turn off all sorts of JIT optimizations. Additionally `with` statements can't be minified using tools like [uglify-js](https://github.com/mishoo/UglifyJS). All things considered, it's much better just to avoid using them, and CoffeeScript takes this a step further by eliminating them from it's syntax. In other words, using `with` in CoffeeScript will throw a syntax error. 

##Global variables



##Semicolons

JavaScript does not enforce the use of semicolons in source code, so it's possible to omit them. However, behind the scenes the JavaScript compiler still needs them, so the parser automatically inserts them whenever it encounters a parse error due to a missing semicolon. In other words, it'll try to evaluate a statement without semicolons and, if that fails, try again using semicolons. 

Unfortunately this is a tremendously bad idea, and can actually change the behavior of your code.


## eval

Whilst CoffeeScript removes some of JavaScript's foibles, other features are a necessary evil, you just need to be aware of their shortcomings. A case in point, is the `eval()` function. Whilst undoubtedly it has its uses, you should know about its drawbacks, and avoid it if possible. The `eval()` function will execute a string of JavaScript code in the local scope, and functions like `setTimeout()` and `setInterval()` can also both take a string as their first argument to be evaluated. 

However, like `with`, `eval()` throws the compiler off track, and is a major performance hog. As the compiler has no idea what's inside until runtime, it can't perform any optimizations. Any concern is with security. If you give it dirty input, `eval` can easily open up your code for injection attacks. 99% of the time when you're using `eval`, there are better & safer alternatives (such as square brackets).

## delete


## parseInt


    2.toString()
    
##Strict checking

    "use strict"
  
  

==
global variables (and overwriting issue)
parseInt
typeof
instanceof
hasOwnProperty
The function Statement Versus the function Expression
shimming
Strict checking
Semicolons
reserved words
jslint

"use strict"