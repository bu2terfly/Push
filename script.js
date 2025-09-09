$(document).ready(function(){
  $("#sendmessage input").focus(function(){
    if($(this).val() == "Send message..."){ $(this).val(""); }
  }).focusout(function(){
    if($(this).val() == ""){ $(this).val("Send message..."); }
  });

  $(".friend").click(function(){
    var name = $(this).find("p strong").text();
    var email = $(this).find("p span").text();
    var img = $(this).find("img").attr("src");

    $("#profile p").text(name);
    $("#profile span").text(email);
    $(".message").not(".right").find("img").attr("src", img);

    $('#friendslist').fadeOut();
    $('#chatview').fadeIn();
  });

  $('#close').click(function(){
    $('#chatview').fadeOut();
    $('#friendslist').fadeIn();
  });
});
