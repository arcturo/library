jQuery(function($) {
  return $("pre").each(function() {
    if ( !$(this).prev().find(".csscript")[0] ) return;
    
    var cs, wrap, compiled, handle, original;
    try {
      cs = CoffeeScript.compile($(this).text(), {bare: true});
    } catch(e) { return }
    
    original = $(this).clone();
    
    compiled = $("<pre />").append($("<code />").text(cs));
    compiled.hide();
    
    handle = $("<button />").addClass("handle");
    handle.attr("title", "Click to toggle between CoffeeScript & JavaScript");
    handle.click(function(){
      original.toggle();
      compiled.toggle();
    });

    wrap = $("<div />").addClass("wrap");
    wrap.append(original);
    wrap.append(compiled);
    wrap.append(handle);
    
    $(this).replaceWith(wrap);
  });
});

$(document).ready(function() {
  // Addapted from http://life.mysiteonline.org/archives/191-jQuery-Printed-Footer-Links.html
  //get the container and target
  var links = $('#content a[href^=http]:not([rel=nofollow])');

  if( $(links).length ) {
    //create a container and heading for the footnotes
    var footnotesWrapper = $('<div>', {
      css: {
	clear: 'both'
      }
    }).addClass('print_only');
    var footnotesLabel = $('<p>', {
      text: 'References'
    }).appendTo(footnotesWrapper);

    //create an OL to hold the footnotes
    var footnoteList = $('<ol>').appendTo(footnotesWrapper);

    $.each(links, function(i) {
      var linkText = $(this).text();
      var linkValue = $(this).attr('href');
      if( linkValue.substring(0,1) === '/' ) {
	linkValue = 'http://www.'+document.location.host + linkValue;
      }
      //create element to hold span with class to hide except on print
      var newElement = $('<span>', {
	text: ' ['+ ++i +']'
      }).addClass('print_only').appendTo($(this));

      var listEntry = $('<li>', {
	text: linkValue
      }).appendTo(footnoteList);
    });

    // append the heading and <ol> to the target
    $('#content').append(footnotesWrapper);
  }
});
