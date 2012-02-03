#Automating CoffeeScript compilation

An issue with CoffeeScript is that it puts another layer between you and JavaScript, and having to manually compile CoffeeScript files whenever they change quickly gets old. Fortunately CoffeeScript has some alternative forms of compilation which can make the development cycle somewhat smoother.

As we covered in the first chapter, we can compile CoffeeScript files using the `coffee` executable:
    
    coffee --compile --output lib src
    
In fact in the example above, all the `.coffee` files in `src` will be compiled & their JavaScript outputted to the `lib` directory. Even calling that is a bit of a bore, so let's look into automating it.

##Cake

[Cake](http://jashkenas.github.com/coffee-script/#cake) is a super simple build system along the lines of [Make](http://www.gnu.org/software/make/) and [Rake](http://rake.rubyforge.org/). The library is bundled with the `coffee-script` npm package, and available via an executable called `cake`.

You can define tasks using CoffeeScript in a file called `Cakefile`. Cake will pick these up, and can be invoked by running `cake [task] [options]` from within the directory. To print a list of all the tasks and options, just type `cake`.

Tasks are defined using the `task()` function, passing a name, optional description and callback function. For example, create a file called `Cakefile`, and two directories, `lib` and `src`. Add the following to the `Cakefile`:

<span class="csscript"></span>

    fs = require 'fs'

    {print} = require 'sys'
    {spawn} = require 'child_process'

    build = (callback) ->
      coffee = spawn 'coffee', ['-c', '-o', 'lib', 'src']
      coffee.stderr.on 'data', (data) ->
        process.stderr.write data.toString()
      coffee.stdout.on 'data', (data) ->
        print data.toString()
      coffee.on 'exit', (code) ->
        callback?() if code is 0
    
    task 'build', 'Build lib/ from src/', ->
      build()
      
In the example above, we're defining a task called `build` that can be invoked by running: `cake build`. This runs the same command as the previous example, compiling all the CoffeeScript files in `src` to JavaScript in `lib`. You can now reference JavaScript files in the `lib` directory as per usual from your HTML:

<span class="csscript"></span>

    <!DOCTYPE html>
    <html>
    <head>
    <meta charset=utf-8>
    <script src="lib/app.js" type="text/javascript" charset="utf-8"></script>      
    </head>
    <body>
    </body>
    </html>

We're still having to manually run `cake build` whenever our CoffeeScript code changes, which is far from ideal. Luckily, the `coffee` command takes another option, `--watch`, which instructs it to watch a directory for changes and re-compiling as necessary. Let's define another task using that:

<span class="csscript"></span>

     task 'watch', 'Watch src/ for changes', ->
        coffee = spawn 'coffee', ['-w', '-c', '-o', 'lib', 'src']
        coffee.stderr.on 'data', (data) ->
          process.stderr.write data.toString()
        coffee.stdout.on 'data', (data) ->
          print data.toString()

If one task relies on another, you can run other tasks using `invoke(name)`. Let's add a utility task to our `Cakefile` which is going to both open  `index.html` and start watching the source for changes.

<span class="csscript"></span>

    task 'open', 'Open index.html', ->
      # First open, then watch
      spawn 'open', 'index.html'
      invoke 'watch'

You can also define options for your task using the `option()` function, which takes a short name, long name and description.

<span class="csscript"></span>

    option '-o', '--output [DIR]', 'output dir'

    task 'build', 'Build lib/ from src/', ->
      # Now we have access to a `options` object
      coffee = spawn 'coffee', ['-c', '-o', options.output or 'lib', 'src']
      coffee.stderr.on 'data', (data) ->
        process.stderr.write data.toString()
      coffee.stdout.on 'data', (data) ->
        print data.toString()

As you can see, the task context now has access to an `options` object containing any data specified by the user. If we run `cake` without any other arguments, all the tasks and options will be listed.

Cake's a great way of automating common tasks such as compiling CoffeeScript without going to the hassle of using bash or Makefiles. It's also worth taking a look at [Cake's source](http://jashkenas.github.com/coffee-script/documentation/docs/cake.html), a great example of CoffeeScript's expressiveness and beautifully documented alongside the code comments.

##Server side support

Using Cake for CoffeeScript compilation is fine for static sites, but for dynamic sites we might as well integrate CoffeeScript compilation into the request/response cycle. Various integration solutions already exist for the popular backend languages and frameworks, such as [Rails](http://rubyonrails.org/) and [Django](https://www.djangoproject.com/). 

When it comes to Rails 3.1, CoffeeScript support comes via [Sprockets & the asset pipeline](https://github.com/sstephenson/sprockets). Add your CoffeeScript files under `app/assets/javascripts`, and Rails is smart enough to pre-compile them when they're requested. JavaScript & CoffeeScript files are concatenated and bundled using special comment directives, meaning you can fetch all of your application's JavaScript with one request. When it comes to production, Rails will write the compiled output to disk, ensuring it's cached and fast to serve. 

Other Ruby options include Rack servers such as 37signal's [Pow](http://pow.cx/) and Joshua Peek's [Nack](http://josh.github.com/nack/), both highly recommended if your application doesn't need Rail's other features and associated overhead.

Django also has [support for CoffeeScript](http://pypi.python.org/pypi/django-coffeescript/) through special template tags. It works with both inline code and external files.

Both Ruby and Python pipe out to Node and the CoffeeScript lib behind the scenes when compiling CoffeeScript, so you'll need to have those installed during development. If you're using Node directly as a backend for your site, CoffeeScript integration is even simpler and you can use it for both the backend and frontend code. We're going to talk more about this in the next chapter, using [Stitch](https://github.com/sstephenson/stitch) to serve all our client-side CoffeeScript.

