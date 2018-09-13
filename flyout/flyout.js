var toggle = function () {

    $(this).parent().children().toggle();
    $(this).toggle();

};

var caretSwitch = function () {
    $(this).toggleClass("up");
}

var flyoutHide = function () {
    $(".flyout").toggleClass("flyout--hide");
}

$(".tog").click(toggle);
$(".tog").click(caretSwitch);
$(".tog").each(toggle);
$(".nav--jobs").click(flyoutHide).click(caretSwitch);