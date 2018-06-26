function fonte(e) {
    var elemento = $(".acessibilidade");
    var fonte = elemento.css('font-size');
    if (e == 'a') {
        elemento.css("fontSize", parseInt(fonte) + 1);
    } else if ('d') {
        elemento.css("fontSize", parseInt(fonte) - 1);
    }
}

/** CONSTANTS **/
var ENTER_KEY = 13;

var greetUser = function (str) {
    document.getElementById("greeting").textContent = str;
};

var makeNameCase = function (str) {
    return (str.charAt(0).toUpperCase() +
            str.substring(1, str.length).toLowerCase());
};

// When input receives focus,
// add a CSS class that highlights it
$("input:text").on("focus", function () {

    $(this).removeClass("lowlight");
    $(this).addClass("highlight");
});

// When input loses focus (blurs),
// revert class names to original
$("input:text").on("blur", function () {

    $(this).removeClass("highlight");
    $(this).removeClass("key-up");
    $(this).removeClass("key-down");
    $(this).addClass("lowlight");
});

// When keypress event is triggered and
//  the key is the enter key,
//  clear the input and display name greeting
$("input:text").on("keypress", function (key) {

    if (key.keyCode === ENTER_KEY)
    {
        greetUser("Hello, " + makeNameCase($(this).val()) + "!");
        $(this).val("");
        $(this).blur();
    }
});

// When keydown event is triggered, change classes
$("input:text").on("keydown", function (key) {

    $(this).removeClass("activelight");
    $(this).removeClass("highlight");
    $(this).removeClass("key-up");
    $(this).addClass("key-down");
});

// When keyup event is triggered, change classes
$("input:text").on("keyup", function (key) {

    $(this).removeClass("key-down");
    $(this).addClass("key-up");
});
