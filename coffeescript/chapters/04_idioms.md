<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#Common CoffeeScript idioms

Every language has a set of idioms and conventions, and CoffeeScript is no exception. This chapter will explore those conventions, and show you some JavaScript to CoffeeScript caparisons so you can get a practical sense of the language. 


##Each

In JavaScript to iterate over every item in an array, we could either use the newly added [`forEach()`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach) function, or an old C style `for` loop. If you're planning to use some of JavaScript's latest features in ECMAScript 5, I advise you also include a [shim](https://github.com/kriskowal/es5-shim) in the page to emulate support in older browsers.

    array.forEach(function(item, i){
      myFunction(item)
    });
    
    for (var i=0; i < array.length; i++)
      myFunction(array[i]);

Although the `forEach()` syntax is much more succinct and readable, it suffers from the drawback that the callback function will be invoked every iteration of the array, and is therefore much slower than the equivalent `for` loop. Let's see how it looks in CoffeeScript.

<span class="csscript"></span>
      
    myFunction(item) for item in array
    
It's a readable and concise syntax, I'm sure you'll agree, and what's great is that it compiles to a `for` loop behind the scenes. In other words, CoffeeScript's syntax offers the same expressiveness as `forEach()`, but without the speed and shimming caveats. 
    
##Map

JS:

    var result = array.map(function(item, i){
      return item.name;
    });
    
    var result = []
    for (var i=0; i < array.length; i++)
      result.push(array[i].name)
    
CS:

<span class="csscript"></span>

    result = (item.name for item in array)

##Select

JS:

    result = array.filter(function(item, i){
      return item.name == "test"
    });
    
    var result = []
    for (var i=0; i < array.length; i++)
      if (callback(array[i]))
        result.push(array[i])

CS

<span class="csscript"></span>

    result = (myFunction(item) for item in array when item.name is "test")

    passed = []
    failed = []
    (if score > 60 then passed else failed).push score for score in [49, 58, 76, 82, 88, 90]
    
    passed = (score for score in scores when score > 60)
    
##Reduce

<span class="csscript"></span>

    [1..1000].reduce (t, s) -> t + s
    
##Includes

Shim

JS:

    var included = (array.indexOf("test") != -1)

CS:

<span class="csscript"></span>
    
    included = "test" in array
    
    included = ~"a long test string".indexOf "test"
    
##Min/Max

<span class="csscript"></span>

    Math.max.apply Math, [14, 35, -7, 46, 98] # 98
    Math.min.apply Math, [14, 35, -7, 46, 98]

##And/or

Use `or` instead of ||
Use `and` instead of &&

    test or= 

##jQuery

<span class="csscript"></span>

    jQuery ($) ->
      
      
    someObject = { a: 'value for a', b: 'value for b' }
    { a, b } = someObject
    console.log "a is '#{a}', b is '#{b}'"
    
> CoffeeScript uses a straight source-to-source compiler. No type checking is performed, and we can't work out if a variable even exists or not. This means that we can't implement features that other languages can build in natively without costly runtime checks. As a result, any feature which relies on this kind of analysis won't be considered.
