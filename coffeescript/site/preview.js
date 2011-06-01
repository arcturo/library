jQuery(function($) {
  return $("pre").each(function() {
    if ($(this).prev().find(".noconvert")[0]) return;
    
    var cs, wrap;
    try {
      cs = CoffeeScript.compile($(this).text(), {bare: true});
    } catch(e) { return }
          
    wrap = $("<div />").addClass("wrap");
    wrap.append($(this).clone())
    wrap.append($("<pre />").append($("<code />").text(cs)));
    $(this).replaceWith(wrap);
  });
});