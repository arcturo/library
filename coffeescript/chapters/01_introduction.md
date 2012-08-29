<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#What is CoffeeScript?

[CoffeeScript](http://coffeescript.org) is a little language that compiles down to JavaScript. The syntax is inspired by Ruby and Python, and implements many features from those two languages. This book is designed to help you learn CoffeeScript, understand best practices and start building awesome client side applications. The book is little, only five chapters, but that's rather apt as CoffeeScript is a little language too. 

This book is completely open source, and was written by [Alex MacCaw](http://alexmaccaw.co.uk) (or [@maccman](http://twitter.com/maccman)) with great contributions from [David Griffiths](https://github.com/dxgriffiths), [Satoshi Murakami](http://github.com/satyr), and [Jeremy Ashkenas](https://github.com/jashkenas).

If you have any errata or suggestions, please don't hesitate to open a ticket on the book's [GitHub page](https://github.com/arcturo/library). Readers may also be interested in [JavaScript Web Applications by O'Reilly](http://oreilly.com/catalog/9781449307530/), a book I authored that explores rich JavaScript applications and moving state to the client side. 

So let's dive right into it; why is CoffeeScript better than writing pure JavaScript? Well for a start, there's less code to write - CoffeeScript is very succinct, and takes whitespace into account. In my experience this reduces code by a third to a half of the original pure JavaScript. In addition, CoffeeScript has some neat features, such as array comprehensions, prototype aliases and classes that further reduce the amount of typing you need to do. 

More importantly though, JavaScript has a lot of [skeletons in its closet](http://bonsaiden.github.com/JavaScript-Garden/) which can often trip up inexperienced developers. CoffeeScript neatly sidesteps these by only exposing a curated selection of JavaScript features, fixing many of the language's oddities. 

CoffeeScript is *not* a superset of JavaScript, so although you can use external JavaScript libraries from inside CoffeeScript, you'll get syntax errors if you compile JavaScript as-is, without converting it. The compiler converts CoffeeScript code into its counterpart JavaScript, there's no interpretation at runtime. 

First to get some common fallacies out the way. You will need to know JavaScript in order to write CoffeeScript, as runtime errors require JavaScript knowledge. However, having said that, runtime errors are usually pretty obvious, and so far I haven't found mapping JavaScript back to CoffeeScript to be an issue. The second problem I've often heard associated with CoffeeScript is speed; i.e. the code produced by the CoffeeScript compiler would run slower than its equivalent written in pure JavaScript. In practice though, it turns out this isn't a problem either. CoffeeScript tends to run as fast, or faster than hand-written JavaScript.

What are the disadvantages of using CoffeeScript? Well, it introduces another compile step between you and your JavaScript. CoffeeScript tries to mitigate the issue as best it can by producing clean and readable JavaScript, and with its server integrations which automate compilation. The other disadvantage, as with any new language, is the fact that the community is still small at this point, and you'll have a hard time finding fellow collaborators who already know the language. CoffeeScript is quickly gaining momentum though, and its IRC list is well staffed; any questions you have are usually answered promptly. 

CoffeeScript is not limited to the browser, and can be used to great effect in server side JavaScript implementations, such as [Node.js](http://nodejs.org/).   Additionally, CoffeeScript is getting much wider use and integration, such as being a default in Rails 3.1. Now is definitely the time to jump on the CoffeeScript train. The time you invest in learning about the language now will be repaid by major time savings later.

##Initial setup

One of the easiest ways to initially play around with the library is to use it right inside the browser. Navigate to [http://coffeescript.org](http://coffeescript.org) and click on the *Try CoffeeScript* tab. The site uses a browser version of the CoffeeScript compiler, converting any CoffeeScript typed inside the left panel to JavaScript in the right panel. 

You can also convert JavaScript back to CoffeeScript using the [js2coffee](http://js2coffee.org/) project, especially useful when migrating JavaScript projects to CoffeeScript.

In fact, you can use the browser-based CoffeeScript compiler yourself, by including [this script](http://jashkenas.github.com/coffee-script/extras/coffee-script.js) in a page, marking up any CoffeeScript script tags with the correct `type`.

    <script src="http://jashkenas.github.com/coffee-script/extras/coffee-script.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/coffeescript">
      # Some CoffeeScript
    </script>
    
Obviously, in production, you don't want to be interpreting CoffeeScript at runtime as it'll slow things up for your clients. Instead CoffeeScript offers a [Node.js](http://nodejs.org) compiler to pre-process CoffeeScript files.

To install it, first make sure you have a working copy of the latest stable version of [Node.js](http://nodejs.org), and [npm](http://npmjs.org/) (the Node Package Manager). You can then install CoffeeScript with npm:

    npm install -g coffee-script
    
This will give you a `coffee` executable. If you execute it without any command line options, it'll give you the CoffeeScript console, which you can use to quickly execute CoffeeScript statements. To pre-process files, pass the `--compile` option.

    coffee --compile my-script.coffee
    
If `--output` is not specified, CoffeeScript will write to a JavaScript file with the same name, in this case `my-script.js`. This will overwrite any existing files, so be careful you're not overwriting any JavaScript files unintentionally. For a full list of the command line options available, pass `--help`.

As you can see above, the default extension of CoffeeScript files is `.coffee`. Amongst other things, this will allow text editors like [TextMate](http://macromates.com/) to work out which language the file contains, giving it the appropriate syntax highlighting. By default, TextMate doesn't include support for CoffeeScript, but you can easily install the [bundle to do so](https://github.com/jashkenas/coffee-script-tmbundle).

If all this compilation seems like a bit of an inconvenience and bother, that's because it is. We'll be getting onto ways to solve this by automatically compiling CoffeeScript files, but first lets take a look at the language's syntax. 
