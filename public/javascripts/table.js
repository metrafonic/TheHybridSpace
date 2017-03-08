function setTable(a, context, uniquekey, perpage, callbackText, callback) {
    var parent = document.getElementById(context);
    var nextbutton = parent.getElementsByClassName('nextbutton')[0];
    var previousbutton = parent.getElementsByClassName('previousbutton')[0];
    var pagetext = parent.getElementsByClassName('pagetext')[0];
    var table = parent.getElementsByClassName('table')[0];
    page = parseInt(pagetext.innerHTML);
    pagemin = (page - 1) * perpage;
    pagemax = pagemin + perpage;

    visibility="hidden"
    if (a.data.length>perpage){
      visibility="visible";
    }
    nextbutton.style.visibility = visibility;
    previousbutton.style.visibility = visibility;
    pagetext.style.visibility = visibility;

    nextbutton.addEventListener("click", function() {
        console.log(pagemax, pagemin, page, a.data.length);
        if (pagemax < a.data.length) {
            pagetext.innerHTML = parseInt(pagetext.innerHTML) + 1;
            fillTable(a, context, uniquekey, perpage, callbackText, callback);
        }
    });
    previousbutton.addEventListener("click", function() {
        if (page > 1) {
            pagetext.innerHTML = parseInt(pagetext.innerHTML) - 1;
            fillTable(a, context, uniquekey, perpage, callbackText, callback);
        }
    });
    fillTable(a, context, uniquekey, perpage, callbackText, callback);

    function fillTable(a, context, uniquekey, perpage, callbackText, callback) {
      page = parseInt(pagetext.innerHTML);
      pagemin = (page - 1) * perpage;
      pagemax = pagemin + perpage;
        table.innerHTML = "";

        var tbody = table.createTBody();
        var thead= tbody.insertRow();
        //Set header
        $.each(a.data[0], function(key, value) {
            thead.insertCell().outerHTML = "<th>" + key + "</th>"
        });
        i = 0;
        z = 0;
        $.each(a.data, function(i, field) {
            if (pagemin <= i && i < pagemax) {
                var bodyrow = tbody.insertRow();
                j = 0;
                $.each(field, function(i, field) {
                    if (i == uniquekey) {
                        z = j
                    }
                    bodyrow.insertCell().innerHTML = field;
                    j++;
                });
                var button = document.createElement("button");
                button.innerHTML = callbackText;
                button.addEventListener("click", function() {
                    callback(bodyrow.cells[z].innerHTML);
                    console.log(bodyrow.cells[z]);
                });
                bodyrow.insertCell().appendChild(button);

                i++;
            }
        });

    }
}
