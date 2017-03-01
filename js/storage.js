function save() {
    var site = $(".container").html();
    localStorage.setItem("textTitle", site);
    alert("save succeed");
}

function load() {
    var textTitle = localStorage.key(0);
    var site = localStorage.getItem(textTitle);
    $(".load_container").html(site);
}

$("document").ready(function() {
    $(".save_submit").click(function() {
        save();
    });
    $(".load_submit").click(function() {
        load();
    });

})