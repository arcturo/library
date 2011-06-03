<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#Classes

Classes in JavaScript seem to have the kind of effect that a clove of garlic has to Dracula for some purists; although let's be honest, if you're that way inclined, you're unlikely to be reading a book on CoffeeScript. However, it turns out that they're just as damn useful in JavaScript as they are in other languages and CoffeeScript provides a great class abstraction. 

As they're not available natively in JavaScript, CoffeeScript emulates classes behind the scenes, handling things like instantiation and inheritance. All that's exposed to you, as a developer, is the `class` keyword.

    class Animal
    
In the example above, `Animal` is the name of the class, and also the name of the resultant variable that you can use to create instances. Since, behind the scenes, CoffeeScript is using construction functions you can instantiate classes using the `new` keyword.

    animal = new Animal

Defining constructors (functions that get invoked upon instantiation) is simple, just use a function named `constructor`. This is akin to using's Ruby's `initialize` or Python's `__init__`.

    class Animal
      constructor: (name) ->
        @name = name

In fact, CoffeeScript provides a shorthand for the common pattern of setting instance properties. By prefixing argument's with `@`, CoffeeScript will automatically set the arguments as instance properties in the constructor. Indeed, this shorthand will also work for normal functions outside classes.

    class Animal
      constructor: (@name) ->

As you'd expect, any arguments passed on instantiation are proxied to the constructor.

    animal = new Animal("Parrot")
    alert("Animal is a #{animal.name}")

##Instance properties

binding this

##Static properties

Inside of a class definition, "this" refers to the class object. So, in brief:

Don't get inherited

##Inheritance

    class Parrot
      constructor: ->
        super("Parrot")
        
      alive: ->
        false
      
      dead: ->
        not @alive()
      
  
##Super

##Mixins

    extend = (obj, mixin) ->
      for name, method of mixin
        obj[name] = method

    include = (klass, mixin) ->
      extend klass.prototype, mixin