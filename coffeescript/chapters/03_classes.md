<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#Classes

Classes in JavaScript seem to have the kind of effect that cloves of garlic have to Dracula for some purists; although, let's be honest, if you're that way inclined, you're unlikely to be reading a book on CoffeeScript. However, it turns out that classes are just as damn useful in JavaScript as they are in other languages and CoffeeScript provides a great abstraction. 

Behind the scenes, CoffeeScript is using JavaScript's native prototype to create classes; adding a bit of syntactic sugar for static property inheritance and context persistence. As a developer all that's exposed to you is the `class` keyword.

<span class="csscript"></span>

    class Animal
    
In the example above, `Animal` is the name of the class, and also the name of the resultant variable that you can use to create instances. Behind the scenes CoffeeScript is using construction functions which means you can instantiate classes using the `new` operator.

<span class="csscript"></span>

    animal = new Animal

Defining constructors (functions that get invoked upon instantiation) is simple, just use a function named `constructor`. This is akin to using's Ruby's `initialize` or Python's `__init__`.

<span class="csscript"></span>

    class Animal
      constructor: (name) ->
        @name = name

In fact, CoffeeScript provides a shorthand for the common pattern of setting instance properties. By prefixing argument's with `@`, CoffeeScript will automatically set the arguments as instance properties in the constructor. Indeed, this shorthand will also work for normal functions outside classes. The example below is equivalent to the last example, where we set the instance properties manually. 

<span class="csscript"></span>

    class Animal
      constructor: (@name) ->

As you'd expect, any arguments passed on instantiation are proxied to the constructor function.

<span class="csscript"></span>

    animal = new Animal("Parrot")
    alert "Animal is a #{animal.name}"

##Instance properties

Adding additional instance properties to a class is very straightforward, it's exactly the syntax as adding properties onto an object. Just make sure properties are indented correctly inside the class body. 

<span class="csscript"></span>

    class Animal
      price: 5

      sell: (customer) ->
        
    animal = new Animal
    animal.sell(new Customer)

Context changes are rife within JavaScript, and earlier in the Syntax chapter we talked about how CoffeeScript can lock the value of `this` to a particular context using a fat arrow function: `=>`. This ensures that whatever context a function is called under, it'll always execute inside the context it was created in. CoffeeScript has extended support for fat arrows to classes, so by using a fat arrow for an instance method you'll ensure that it's invoked in the correct context, and that `this` is always equal to the current instance. 
    
<span class="csscript"></span>

    class Animal
      price: 5

      sell: =>
        alert "Give me #{@price} shillings!"
        
    animal = new Animal
    $("#sell").click(animal.sell)
    
As demonstrated in the example above, this is especially useful in event callbacks. Normally the `sell()` function would be invoked in the context of the `#sell` element. However, by using fat arrows for `sell()`, we're ensuring the correct context is being maintained, and that `this.price` equals `5`.

##Static properties

How about defining class (i.e. static) properties? Well, it turns out that inside a class definition, `this` refers to the class object. In other words you can set class properties by setting them directly on `this`. 

<span class="csscript"></span>

    class Animal
      this.find = (name) ->      

    Animal.find("Parrot")
    
In fact, as you may remember, CoffeeScript aliases `this` to `@`, which lets you write static properties even more succinctly: 
    
<span class="csscript"></span>

    class Animal
      @find: (name) ->
      
    Animal.find("Parrot")

##Inheritance & Super

It wouldn't be a proper class implementation without some form of inheritance, and CoffeeScript doesn't disappoint. You can inherit from another class by using the `extends` keyword. In the example below, `Parrot` extends from `Animal`, inheriting all of its instance properties, such as `alive()`

<span class="csscript"></span>

    class Animal
      constructor: (@name) ->
      
      alive: ->
        false

    class Parrot extends Animal
      constructor: ->
        super("Parrot")
      
      dead: ->
        not @alive()

You'll notice that in the example above, we're using the `super()` keyword. Behind the scenes, this is translated into a function call on the class' parent prototype, invoked in the current context. In this case, it'll be `Parrot.__super__.constructor.call(this, "Parrot");`. In practice, this will have exactly the same effect as invoking `super` in Ruby or Python, invoking the overridden inherited function. 

Unless you override the `constructor`, by default CoffeeScript will invoke the parent's constructor when instances are created. 

CoffeeScript uses prototypal inheritance to automatically inherit all of a class's instance properties. This ensures that classes are dynamic; even if you add properties to a parent class after a child has been created, the property will still be propagated to all of its inherited children.

<span class="csscript"></span>

    class Animal
      constructor: (@name) ->
      
    class Parrot extends Animal
    
    Animal::rip = true
    
    parrot = new Parrot("Macaw")
    alert("This parrot is no more") if parrot.rip()

It's worth pointing out though that static properties aren't inherited, only instance properties are. This is due to implementation details with JavaScript's prototypal architecture, and is a difficult problem to work around. The CoffeeScript team are actively looking at this problem though, so hopefully we'll see a solution to this soon. 

##Mixins

[Mixins](http://en.wikipedia.org/wiki/Mixin) are not something supported natively by CoffeeScript, for the good reason that they can be trivially implemented. For example, here's two functions, `extend()` and `include()` that'll add class and instance properties respectively to a class. 

<span class="csscript"></span>

    extend = (obj, mixin) ->
      obj[name] = method for name, method of mixin        
      obj

    include = (klass, mixin) ->
      extend klass.prototype, mixin
    
    # Usage
    include Parrot,
      isDeceased: true
      
    (new Parrot).isDeceased
    
Mixins are a great pattern for sharing common logic between modules when inheritance is not suited. The advantage of mixins, is that you can include multiple ones, compared to inheritance where only one class can be inherited from.