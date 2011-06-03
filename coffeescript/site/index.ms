<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<title>CoffeeScript</title>
<link rel="stylesheet" href="site/site.css" type="text/css" charset="utf-8">
<script src="site/jquery.js" type="text/javascript" charset="utf-8"></script>      
</head>
<body>
<div id="container">
  <header>
    <h1><a href="index.html">The Little Book on CoffeeScript</a></h1>
  </header>
  
  <div id="content">
    <ol class="pages">
    {{#pages}}
      <li><a href="{{href}}">{{name}}</a></li>
    {{/pages}}
    </ol>
  </div>
</div>
</body>
</html>