<div class="back"><a href="index.html">&laquo; Back to all chapters</a></div>

#Creating Applications

intro

##Structure & CommonJS

##Stitch it up

##JavaScript templates

Stitch

eco
tmpl

Backbone/Spine

<span class="noconvert"></span>

    app/controllers
    app/views
    app/models
    app/lib
    lib
    public
    public/index.html
    public/css
    public/css/views


<span class="noconvert"></span>

    npm install stitch

<span class="noconvert"></span>

    #!/usr/bin/env node
    var stitch  = require('stitch'),
        express = require('express'),
        util    = require('util'),
        argv    = process.argv.slice(2);

    var package = stitch.createPackage({
      paths: [__dirname + '/lib', __dirname + '/app'],
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
      app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
      app.use(app.router);
      app.use(express.static(__dirname + '/public'));
      app.get('/application.js', package.createServer());
    });

    var port = argv[0] || 9294;
    util.puts("Starting server on port: " + port);
    app.listen(port);

<span class="noconvert"></span>

    stitch.compilers.tmpl = function(module, filename) {
      var content = fs.readFileSync(filename, 'utf8');
      content = ["var template = jQuery.template(", JSON.stringify(content), ");", 
                 "module.exports = (function(data){ return jQuery.tmpl(template, data); });\n"].join("");
      return module._compile(content, filename);
    };
    
<span class="noconvert"></span>
  
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset=utf-8>
      <title>Application</title>
      <link rel="stylesheet" href="/css/application.css" type="text/css" charset="utf-8">
      <script src="/application.js" type="text/javascript" charset="utf-8"></script>
      <script type="text/javascript" charset="utf-8">
        var exports = this;
        jQuery(function(){
          var App = require("app");
          exports.App = App.init({el: $("body")});      
        });
      </script>
    </head>
    <body>
    </body>
    </html>