<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#Creating Applications

Now you've been given an overview of the syntax, lets explore actually structuring and creating CoffeeScript applications. This section aims to be useful to all CoffeeScript developers, novice or advanced. Indeed, it should be relevant to pure JavaScript developers too. 

For some reason, when developers are building client side JavaScript applications, tried and tested patterns and conventions often fly out the window, and the end result is a spaghetti mess of un-maintainable coupled JavaScript. I can't stress enough how important application architecture is; if you're writing any JavaScript/CoffeeScript beyond simple form validation you should implement a form of application structure, such as [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller). 

The secret to building maintainable large applications is not to build large applications. In other words, build a series of modular de-coupled components. Keep application logic as generic as possible, abstracting it out as appropriate. Lastly separate out your logic into views, models and controllers (MVC). Implementing MVC is beyond the scope of this chapter, for that I recommend you check out my book on [JavaScript Web Applications](http://oreilly.com/catalog/9781449307530/) and use a framework like [Backbone](http://documentcloud.github.com/backbone/) or [Spine](https://github.com/maccman/spine). Rather than that, here we're going to cover structuring applications using CommonJS modules.

##Structure & CommonJS

So what exactly are CommonJS modules? Well, If you've used [NodeJS](http://nodejs.org/) before you've used CommonJS modules, probably without realizing it. CommonJS modules were initially developed for writing server side JavaScript libraries, in an attempt to deal with loading, namespacing and scoping issues. They were a common format that would be compatible across all JavaScript implementations. The aim was that a library written for [Rhino](http://www.mozilla.org/rhino/) would work for Node. Eventually these ideas transitioned back to browsers, and now we have great libraries like [RequireJS](http://requirejs.org) and [Yabble](https://github.com/jbrantly/yabble) to use modules client-side. 

Practically speaking, modules ensure that your code is run in a local namespace (code encapsulation), that you can load other modules with the `require()` function, and expose module properties via `module.exports`. Let's dive into that in a bit more depth now. 

###Requiring files

You can load in other modules and libraries using `require()`. Simply pass a module name and, if it's in the load path, it'll return an object representing that module. For example:

    var User = require("models/user");
    
Synchronous require support is a contentious issue, but has mostly been resolved with the mainstream loader libraries and latest CommonJS [proposals](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition). It may be something you'll have to look into if you decided to take a separate route than the one I'm advocating with Stitch below. 

###Exporting properties

By default, modules don't expose any properties so their contents are completely invisible to `require()` calls. If you want a particular property to be accessible from your module, you'll need to set it on `module.exports`:

    // random_module.js
    module.exports.myFineProperty = function(){
      // Some shizzle
    }
    
Now, whenever this module is required then `myFineProperty` will be exposed:

    var myFineProperty = require("random_module").myFineProperty;

##Stitch it up

Formatting your code as CommonJS modules is all fine and dandy, but how do you actually get this working on the client in practice? Well, my method of choice is the rather unheard of [Stitch](https://github.com/sstephenson/stitch) library. Stitch is by Sam Stephenson, the mind behind [Prototype.js](http://www.prototypejs.org) amongst other things, and solves the module problem so elegantly it makes me want to dance for joy! Rather than try and dynamically resolve dependencies, Stitch simply bundles up all your JavaScript files into one, wrapping them in some CommonJS magic. Oh, and did I mention it'll compile your CoffeeScript, JS templates, [LESS CSS](http://lesscss.org) and [Sass](http://sass-lang.com) files too!

First things first, let's get Stitch installed. You'll need to install [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) if you haven't already, then run:

    npm install -g stitch
    
Now let's create our application structure. If you're using [Spine](https://github.com/maccman/spine), you can automate this with [Spine.App](http://github.com/maccman/spine.app), otherwise it's something you'll need to do manually. I usually have an `app` folder for all the application specific code, and a `lib` folder for general libraries. Then anything else, including static assets, goes in the `public` directory.

    app/controllers
    app/views
    app/models
    app/lib
    lib
    public
    public/index.html
    public/css
    public/css/views

Now to actually boot up the Stitch server. Let's create a file called `server.js` and fill it with the following script:

    #!/usr/bin/env node
    var stitch  = require('stitch'),
        express = require('express'),
        util    = require('util'),
        argv    = process.argv.slice(2);

    var package = stitch.createPackage({
      // Specify the paths you want Stitch to automatically bundle up
      paths: [__dirname + '/app'],
      
      // Specify your base libraries
      dependencies: [
        __dirname + '/lib/json2.js',
        __dirname + '/lib/shim.js',
        __dirname + '/lib/jquery.js',
        __dirname + '/lib/jquery.tmpl.js',
        __dirname + '/lib/spine.tmpl.js',
        __dirname + '/lib/spine.js'
      ]
    });

    var app = express.createServer();

    app.configure(function() {
      app.set('views', __dirname + '/views');
      // Compile Less CSS files
      app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
      app.use(app.router);
      // Set the static route, in this case `public`
      app.use(express.static(__dirname + '/public'));
      // And invoke Stitch when application.js is requested
      app.get('/application.js', package.createServer());
    });

    var port = argv[0] || process.env.PORT || 9294;
    util.puts("Starting server on port: " + port);
    app.listen(port);

Rightio, we're almost there. Now if you invoke `server.js` with Node you'll hopefully have a Stitch server up and running. Let's go ahead and test it out by putting an `app.coffee` script in the `app` folder. This will be the file that'll bootstrap our application.

<span class="csscript"></span>

    module.exports = App =
      init: ->
        # Bootstrap the app
        
Now let's create our main page `index.html` which, if we're building a single page app, will be the only page the user actually navigates to. This is a static asset, so it's under the `public` directory.
  
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset=utf-8>
      <title>Application</title>
      <link rel="stylesheet" href="/css/application.css" type="text/css" charset="utf-8">
      <!-- Require the main Stitch file -->
      <script src="/application.js" type="text/javascript" charset="utf-8"></script>
      <script type="text/javascript" charset="utf-8">
        jQuery(function(){
          var App = require("app");
          window.App = App.init({el: $("body")});      
        });
      </script>
    </head>
    <body>
    </body>
    </html>

When the page loads, our inline jQuery callback is requiring the `app.coffee` script (which is automatically compiled), and invoking our `init()` function. That's all there is to it, we've got CommonJS modules up and running, as well as a HTTP server and CoffeeScript compiler. If, say, we wanted to include a module, it's just a case of calling `require()`.

<span class="csscript"></span>

    # models/user.coffee
    module.exports = class User
      constructor: (@name) ->
      
    # app.coffee
    User = require("models/user")

##JavaScript templates

If you're moving logic to the client side, then you'll definitely need some sort of templating library. JavaScript templating is very similar to templates on the server, such as Ruby's ERB or Python's text interpolation, expect of course it runs client side. There are a whole host of templating libraries out there, so I encourage you to do some research and check them out. By default, Stitch comes with support for [Eco](https://github.com/sstephenson/eco) templates baked right in. 

JavaScript templates are very similar to server side ones. You have template tags interoperated with HTML, and during rendering those tags get evaluated and replaced. The great thing about [Eco](https://github.com/sstephenson/eco) templates, is they're actually written in CoffeeScript. 

Here's an example:

    <% if @projects.length: %>
      <% for project in @projects: %>
        <a href="<%= project.url %>"><%= project.name %></a>
        <p><%= project.description %></p>
      <% end %>
    <% else: %>
      No projects
    <% end %>

As you can see, the syntax is remarkably straightforward. Just use `<%` tags for evaluating expressions, and `<%=` tags for printing them. A partial list of template tags is as follows:
    
* `<% expression %>`  
  Evaluate a CoffeeScript expression without printing its return value.

* `<%= expression %>`  
  Evaluate a CoffeeScript expression, escape its return value, and print it.

* `<%- expression %>`  
  Evaluate a CoffeeScript expression and print its return value without escaping it.

You can use any CoffeeScript expression inside the templating tags, but there's one thing to look out for. CoffeeScript is whitespace-sensitive, but your Eco templates aren't. Therefore, Eco template tags that begin an indented CoffeeScript block must be suffixed with a colon. To indicate the end of an indented block, use the special tag `<% end %>`. For example:

    <% if @project.isOnHold(): %>
      On Hold
    <% end %>
    
You don't need to write the `if` and `end` tags on separate lines:

    <% if @project.isOnHold(): %> On Hold <% end %>

And you can use the single-line postfix form of `if` as you'd expect:

    <%= "On Hold" if @project.isOnHold() %>

Now we've got a handle on the syntax, let's define an Eco template in `views/users/show.eco`:
    
    <label>Name: <%= @name %></label>
    
Stitch will automatically compile our template and include it in `application.js`. Then, in our application's controllers we can require the template, like it was a module, and execute it passing any data required. 
    
    require("views/users/show")(new User("name"))
    
##Bonus - 30 second deployment with Heroku

[Heroku](http://heroku.com/) is an incredibly awesome web host that manages all the servers and scaling for you, letting you get on with the exciting stuff (building awesome JavaScript applications). You'll need an account with Heroku for this tutorial to work, but the great news is that their basic plan is completely free. While traditionally a Ruby host, Heroku have recently released their Cedar stack, which includes Node support. 

Firstly we need to make a `Procfile`, which will inform Heroku about our application.

    echo "web: node server.js" > Procfile

Now, if you haven't already, you'll need to create a local git repository for your application. 

    git init
    git add .
    git commit -m "First commit"    
    
And now to deploy the application, we'll use the `heroku` gem (which you'll need to install if you haven't already).

    heroku create myAppName --stack cedar
    git push heroku master
    heroku open
    
That's it! Seriously, that's all there is to it. Hosting Node applications has never been easier.