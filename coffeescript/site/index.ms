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
  <h1>CoffeeScript</h1>
  
  <ol class="pages">
  {{#pages}}
    <li><a href="{{href}}">{{name}}</a></li>
  {{/pages}}
  </ol>
</div>
</body>
</html>