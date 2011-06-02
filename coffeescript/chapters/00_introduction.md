<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#What is CoffeeScript?

[CoffeeScript](http://coffeescript.org) is a little language that compiles down to JavaScript. The syntax is inspired by Ruby and Python, and implements many features from those two languages. 

Why is it better than writing pure JavaScript? Well for a start, there's less code to write - CoffeeScript is very succinct, and takes white-space into account. In my experience this reduces code by a third to a half of the original pure JavaScript. In addition, CoffeeScript has some neat features, such as array comprehensions, prototype aliases and classes that further reduce the amount of typing you need to do. 

JavaScript has a lot of [skeletons in its closet](http://bonsaiden.github.com/JavaScript-Garden/) which can often trip up un-experienced developers. CoffeeScript neatly sidesteps these, by only exposing a curated subset of JavaScript features, fixing some of the language's oddities. 

CoffeeScript is *not* a superset of JavaScript, so although you can use external JavaScript libraries from inside CoffeeScript, you'll get syntax errors if you compile JavaScript as-is, without converting it. The language compiles CoffeeScript syntax into its counterpart JavaScript, there's no interpretation at runtime. 

So first to get some common fallacies out the way. You will need to know JavaScript in order to write CoffeeScript, as runtime errors require JavaScript knowledge. However, having said that, runtime errors are usually very obvious, and so far I haven't found mapping JavaScript back to CoffeeScript an issue at all. The second problem I've often heard CoffeeScript accused of is speed, i.e. the code produced by the CoffeeScript compile would run slower than it's equivalent written in pure JavaScript. In practice though, it turns out this isn't a problem either. CoffeeScript tends to run as fast, or faster than its equivalent hand-written JavaScript.

CoffeeScript is not limited to the browser, and can be used to great effect in server side JavaScript implementations, such as [Node.js](http://nodejs.org/).   Additionally, CoffeeScript is getting much wider use and integration, such as being a default in Rails 3.1. Now is definitely the time to jump on the CoffeeScript train, and you'll thank yourself for the time invested in learning about the language now, in lieu of the major time savings you'll make later. 

##Initial setup

One of the easiest ways to initially play around with the library is to use it right inside the browser; navigate to [http://jashkenas.github.com/coffee-script](http://jashkenas.github.com/coffee-script) and click on the *Try CoffeeScript* tab. The site uses a browser version of the CoffeeScript compiler, converting any CoffeeScript typed inside the left panel, to JavaScript in the right panel.

In fact you can use browser based compiler yourself, by including [this script](http://jashkenas.github.com/coffee-script/extras/coffee-script.js) in a page, marking up any CoffeeScript script tags with the correct `type`.

<span class="noconvert"></span>

    <script src="http://jashkenas.github.com/coffee-script/extras/coffee-script.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/coffeescript">
      # Some CoffeeScript
    </script>
    
Obviously, in production, you don't want to be interpreting CoffeeScript at runtime, as it'll slow thing up for your clients, so CoffeeScript offers a [Node.js](http://nodejs.org) compiler to pre-process CoffeeScript files.

To install it, first make sure you have a working copy of the latest stable version of [Node.js](http://nodejs.org), and [npm](http://npmjs.org/) (the Node Package Manager). You can then install CoffeeScript with npm:

<span class="noconvert"></span>

    npm install coffee-script
    
This will give you a `coffee` executable. If you execute it without any command line options, it'll give you the CoffeeScript console, which you can use to quickly execute CoffeeScript statements. To pre-process files, pass the `--compile` option.

<span class="noconvert"></span>

    coffee --compile my-script.coffee
    
If `--output` is not specified, CoffeeScript will write to a JavaScript file with the same name, in this case `my-script.js`. This will overwrite any existing files, so be careful you're overwriting any JavaScript files unintentionally. For a full list of the command line options available, please see the [docs](http://coffeescript.org).

As you can see above, the default extension of CoffeeScript files is `.coffee`. Amongst other things, this will allow text editors like [TextMate](http://macromates.com/) to work out which language the file contains, giving it the appropriate syntax highlighting. By default, TextMate doesn't include support for CoffeeScript, but you can easily install the [bundle to do so](https://github.com/jashkenas/coffee-script-tmbundle).

If all this compilation seems like a bit of a inconvenience and bother, that's because it is. We'll be getting onto ways to solve this by automatically compiling CoffeeScript files when they're first requested, but first lets take a look at the languages's syntax. 