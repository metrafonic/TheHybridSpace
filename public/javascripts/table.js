
function setTable(a, context, uniquekey, perpage, callbackText, callback) {
    var parent = document.getElementById(context);
    if (parent.getAttribute('page') == undefined){
      parent.setAttribute("page", 0);
    }
    page = parent.getAttribute('page');
    pagemin = page*perpage;
    pagemax =pagemin+perpage;
    parent.innerHTML = "";
    var anextbutton = document.createElement("button");
    var apreviousbutton = document.createElement("button");
    var atable = document.createElement("TABLE");
    anextbutton.innerHTML = "Next";
    apreviousbutton.innerHTML = "Previous";
    atable.setAttribute("class", "table table-bordered table-hover table-striped");
    var parent = document.getElementById(context);
    var table = parent.appendChild(atable);
    var table = parent.getElementsByClassName('table')[0];

    var pagetext = parent.getElementsByClassName('pagetext')[0];
    var table = parent.getElementsByClassName('table')[0];

    if (page>0){
      var previousbutton = parent.appendChild(apreviousbutton);
      previousbutton.addEventListener("click", function(){
        console.log(page);
        parent.setAttribute("page", parseInt(page)-1);
        updateData();
      });
    }
    if(a.data.length>pagemax){
      var nextbutton = parent.appendChild(anextbutton);
      nextbutton.addEventListener("click", function(){
        console.log(page);
        parent.setAttribute("page", parseInt(page)+1);
        updateData();
      });
    }


    table.innerHTML = "";

        var tbody = table.createTBody();
        var thead= tbody.insertRow();
        //Set header
        $.each(a.data[0], function(key, value) {
          if (key != uniquekey) {
            thead.insertCell().outerHTML = "<th>" + key + "</th>"
          }
        });
        i = 0;
        z = 0;
        $.each(a.data, function(i, field) {
            if (pagemin <= i && i < pagemax) {
                var bodyrow = tbody.insertRow();
                j = 0;
                $.each(field, function(i, field) {
                    if (i == uniquekey) {
                        z = j;
                        bodyrow.id=field;
                    }else{
                      var newcell = bodyrow.insertCell();
                      newcell.innerHTML = field;
                    }
                    j++;
                });
                var button = document.createElement("button");
                button.innerHTML = callbackText;
                button.addEventListener("click", function() {
                    callback(bodyrow.id);
                });
                if (callback!= undefined){
                  bodyrow.insertCell().appendChild(button);
                }

                i++;
            }
        });

}
