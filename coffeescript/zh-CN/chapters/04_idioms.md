<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#Common CoffeeScript idioms

Every language has a set of idioms and practices, and CoffeeScript is no exception. This chapter will explore those conventions, and show you some JavaScript to CoffeeScript comparisons so you can get a practical sense of the language. 

##Each

In JavaScript to iterate over every item in an array, we could either use the newly added [`forEach()`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach) function, or an old C style `for` loop. If you're planning to use some of JavaScript's latest features introduced in ECMAScript 5, I advise you also include a [shim](https://github.com/kriskowal/es5-shim) in the page to emulate support in older browsers.
    
    for (var i=0; i < array.length; i++)
      myFunction(array[i]);
      
    array.forEach(function(item, i){
      myFunction(item)
    });

Although the `forEach()` syntax is much more succinct and readable, it suffers from the drawback that the callback function will be invoked every iteration of the array, and is therefore much slower than the equivalent `for` loop. Let's see how it looks in CoffeeScript.

<span class="csscript"></span>
      
    myFunction(item) for item in array
    
It's a readable and concise syntax, I'm sure you'll agree, and what's great is that it compiles to a `for` loop behind the scenes. In other words CoffeeScript's syntax offers the same expressiveness as `forEach()`, but without the speed and shimming caveats. 
    
##Map

As with `forEach()`, ES5 also includes a native map function that has a much more succinct syntax than the classic `for` loop, namely [`map()`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map). Unfortunately it suffers from much the same caveats that `forEach()` does, its speed is greatly reduced due to the function calls.

    var result = []
    for (var i=0; i < array.length; i++)
      result.push(array[i].name)

    var result = array.map(function(item, i){
      return item.name;
    });

As we covered in the syntax chapter, CoffeeScript's comprehensions can be used to get the same behavior as `map()`. Notice we're surrounding the comprehension with parens, which is **absolutely critical** in ensuring the comprehension returns what you'd expect, the mapped array. 

<span class="csscript"></span>

    result = (item.name for item in array)

##Select

Again, ES5 has a utility function [`filter()`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/filter) for reducing arrays:
    
    var result = []
    for (var i=0; i < array.length; i++)
      if (array[i].name == "test")
        result.push(array[i])

    result = array.filter(function(item, i){
      return item.name == "test"
    });

CoffeeScript's basic syntax uses the `when` keyword to filter items with a comparison. Behind the scenes a `for` loop is generated. The whole execution is performed in an anonymous function to ward against scope leakage and variable conflict. 

<span class="csscript"></span>

    result = (item for item in array when item.name is "test")

Don't forgot to include the parens, as otherwise `result` will be the last item in the array. 
CoffeeScript's comprehensions are so flexible that they allow you to do powerful selections as in the following example:

<span class="csscript"></span>

    passed = []
    failed = []
    (if score > 60 then passed else failed).push score for score in [49, 58, 76, 82, 88, 90]
    
    # Or
    passed = (score for score in scores when score > 60)
    
If comprehensions get too long, you can split them onto multiple lines.

<span class="csscript"></span>

    passed = []
    failed = []
    for score in [49, 58, 76, 82, 88, 90]
      (if score > 60 then passed else failed).push score

##Includes

Checking to see if a value is inside an array is typically done with `indexOf()`, which rather mind-bogglingly still requires a shim, as Internet Explorer hasn't implemented it. 

    var included = (array.indexOf("test") != -1)

CoffeeScript has a neat alternative to this which Pythonists may recognize, namely `in`.

<span class="csscript"></span>
    
    included = "test" in array

Behind the scenes, CoffeeScript is using `Array.prototype.indexOf()`, and shimming if necessary, to detect if the value is inside the array. Unfortunately this  means the same `in` syntax won't work for strings. We need to revert back to using `indexOf()` and testing if the result is negative:

<span class="csscript"></span>

    included = "a long test string".indexOf("test") isnt -1

Or even better, hijack the bitwise operator so we don't have to do a `-1` comparison. 

<span class="csscript"></span>
    
    string   = "a long test string"
    included = !!~ string.indexOf "test"
    
##Property iteration

To iterate over a bunch of properties in JavaScript, you'd use the `in` operator, for example:

    var object = {one: 1, two: 2}
    for(var key in object) alert(key + " = " + object[key])
    
However, as you've seen in the previous section, CoffeeScript has already reserved `in` for use with arrays. Instead, the operator has been renamed `of`, and can be used like thus:

<span class="csscript"></span>
    
    object = {one: 1, two: 2}
    alert("#{key} = #{value}") for key, value of object
    
As you can see, you can specify variables for both the property name, and its value; rather convenient.
    
##Min/Max

This technique is not specific to CoffeeScript, but I thought it useful to demonstrate anyway. `Math.max` and `Math.min` take multiple arguments, so you can easily use `...` to pass an array to them, retrieving the maximum and minimum values in the array. 

<span class="csscript"></span>

    Math.max [14, 35, -7, 46, 98]... # 98
    Math.min [14, 35, -7, 46, 98]... # -7
    
It's worth noting that this trick will fail with really large arrays as browsers have a limitation on the amount of arguments you can pass to functions.
    
##Multiple arguments

In the `Math.max` example above, we're  using `...` to de-structure the array and passing it as multiple arguments to `max`. Behind the scenes, CoffeeScript is converting the function call to use `apply()`, ensuring the array is passed as multiple arguments to `max`. We can use this feature in other ways too, such as proxying function calls:

<span class="csscript"></span>

    Log =
      log: ->
        console?.log(arguments...)
      
Or you can alter the arguments before they're passed onwards:

<span class="csscript"></span>

    Log =
      logPrefix: "(App)"

      log: (args...) ->
        args.unshift(@logPrefix) if @logPrefix
        console?.log(args...)
        
Bear in mind though, that CoffeeScript will automatically set the function invocation context to the object the function is being invoked on. In the example above, that would be `console`. If you want to set the context specifically, then you'll need to call `apply()` manually. 

##And/or

CoffeeScript style guides indicates that `or` is preferred over `||`, and `and` is preferred over `&&`. I can see why, as the former is somewhat more readable. Nevertheless, the two styles have identical results.  

This preference over more English style code also applies to using `is` over `==` and `isnt` over `!=`.
    
<span class="csscript"></span>

    string = "migrating coconuts"
    string == string # true
    string is string # true
    
One extremely nice addition to CoffeeScript is the 'or equals', which is a pattern Rubyists may recognize as `||=`:
    
<span class="csscript"></span>

    hash or= {}
    
If hash evaluates to `false`, then it's set to an empty object. It's important to note here that this expression also recognizes `0`, `""` and `null` as false. If that isn't your intention, you'll need to use CoffeeScript's existential operator, which only gets activated if `hash` is `undefined` or `null`:

<span class="csscript"></span>

    hash ?= {}

##Destructuring assignments

Destructuring assignments can be used with any depth of array and object nesting, to help pull out deeply nested properties.

<span class="csscript"></span>

    someObject = { a: 'value for a', b: 'value for b' }
    { a, b } = someObject
    console.log "a is '#{a}', b is '#{b}'"
    
This is especially useful in Node applications when requiring modules:

<span class="csscript"></span>

    {join, resolve} = require('path')
    
    join('/Users', 'Alex')

##External libraries

Using external libraries is exactly the same as calling functions on CoffeeScript libraries; since at the end of the day everything is compiled down to JavaScript. Using CoffeeScript with [jQuery](http://jquery.com) is especially elegant, due to the amount of callbacks in jQuery's API. 

<span class="csscript"></span>

    # Use local alias
    $ = jQuery

    $ ->
      # DOMContentLoaded
      $(".el").click ->
        alert("Clicked!")
    
Since all of CoffeeScript's output is wrapped in an anonymous function, we can set a local `$` alias for `jQuery`. This will make sure that even if jQuery's no conflict mode is enabled and the `$` re-defined, our script will still function as intended. 

##Private variables

The `do` keyword in CoffeeScript lets us execute functions immediately, a great way of encapsulating scope & protecting variables. In the example below, we're defining a variable `classToType` in the context of an anonymous function which's immediately called by `do`. That anonymous function returns a second anonymous function, which will be ultimate value of `type`. Since `classToType` is defined in a context that no reference is kept to, it can't be accessed outside that scope.

<span class="csscript"></span>

    # Execute function immediately
    type = do ->
      classToType = {}
      for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
        classToType["[object " + name + "]"] = name.toLowerCase()
      
      # Return a function
      (obj) ->
        strType = Object::toString.call(obj)
        classToType[strType] or "object"

In other words, `classToType` is completely private, and can never again be referenced outside the executing anonymous function. This pattern is a great way of encapsulating scope and hiding variables.