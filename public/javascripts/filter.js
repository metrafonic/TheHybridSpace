function setFilter(data1, data2, context, callback) {
    var parent = document.getElementById(context);
    if (parent.getAttribute('loaded') == undefined) {
        parent.setAttribute("loaded", 1);
        parent.innerHTML = "";
        var aselect = document.createElement("select");
        var select = parent.appendChild(aselect);
        var option = document.createElement("option");
        option.setAttribute("value", "None");
        option.innerHTML = "None";
        select.appendChild(option);
        $.each(data1.data, function(i, field) {

            var option = document.createElement("option");
            option.setAttribute("value", field.collection);
            option.innerHTML = field.collection;
            select.appendChild(option);

        });
        select.addEventListener("click", function(e) {
            choice = select.options[select.options.selectedIndex].value;
            if (choice == 'None') {
                callback("");
            } else {
                callback("?collection=" + choice);
            }
        });
    }
}
