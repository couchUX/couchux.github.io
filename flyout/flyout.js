var toggle = function () {

    $(this).parent().children().toggle();
    $(this).toggle();

};

$(".tog").click(toggle);
$(".tog").each(toggle);