jQuery(function($) {
  return $("pre").each(function() {
    if ($(this).prev().find(".noconvert")[0]) return;
    
    var cs, wrap, compiled, handle, original;
    try {
      cs = CoffeeScript.compile($(this).text(), {bare: true});
    } catch(e) { return }
    
    original = $(this).clone();
    
    compiled = $("<pre />").append($("<code />").text(cs));
    compiled.hide();
    
    handle = $("<div />").addClass("handle");
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