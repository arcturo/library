#Automating CoffeeScript compilation

An issue to CoffeeScript is that it puts another layer between you and JavaScript, and manually having to compile CoffeeScript files whenever they change quickly gets old. Fortunately CoffeeScript has some alternatives to manual compilation, which can make the development cycle somewhat smoother.

As we covered in the first chapter, we can compile CoffeeScript files using the `coffee` executable:
    
    coffee --compile --output lib src
    
In fact in the example above, all the `.coffee` files in `src` will be compiled & their JavaScript outputted to the `lib` directory. Even calling that is a bit of a bore, so let's look into automating it.

##Cake

[Cake](http://jashkenas.github.com/coffee-script/#cake) is a super simple build system along the lines of [Make](http://www.gnu.org/software/make/) and [Rake](http://rake.rubyforge.org/). The library is bundled with the `coffee-script` npm package, and available via an executable called `cake`.

You can define tasks using CoffeeScript in a file called `Cakefile`. Cake will pick these up, and can be invoked by running `cake [task] [options]` from within the directory. To print a list of all the tasks and options, just type `cake`.

Tasks are defined using the `task()` function, passing a name, optional description and callback function. For example, create a file called `Cakefile`, and two directories, `lib` and `src`.

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

We're still having to manually run `cake build` whenever our CoffeeScript code changes, which is far from ideal. Luckily, the `coffee` command takes another option, `--watch`, which instructs it to watch a directory for changes and re-compiling as necessary.

<span class="csscript"></span>

     task 'watch', 'Watch src/ for changes', ->
        coffee = spawn 'coffee', ['-w', '-c', '-o', 'lib', 'src']
        coffee.stderr.on 'data', (data) ->
          process.stderr.write data.toString()
        coffee.stdout.on 'data', (data) ->
          print data.toString()

If one task relies on another, you can run other tasks using `invoke(name)`. Let's add a utility task to our `Cakefile` which is going to both open our  

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

http://jashkenas.github.com/coffee-script/documentation/docs/cake.html

##Server side support

above fine for static


Python
Rails
Hem