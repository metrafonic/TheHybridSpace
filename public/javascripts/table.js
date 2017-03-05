var page= 0;
var page2=0;
function nextPage(x){
        page=page+1;
        $("#pagenumber").html(page+1);

  updateData();
}
function previousPage(x){
        page=page-1;
        $("#pagenumber").html(page2+1);

    updateData();
}

function setTable(a, table, text, eventtext, eventfunction, eventkey, page, nextButton, previousButton){
  var perpage=15;
  var pagestart=page*perpage;
  var pageend=pagestart+perpage;
    $(table).html("");
    $(text).html("<b>Status: </b>" + a.message);
    if (a.data.length>pageend){
      document.getElementById(nextButton).disabled = false;
    }else{
      document.getElementById(nextButton).disabled = true;
    }
    if (page==0){
      document.getElementById(previousButton).disabled = true;
    }else{
      document.getElementById(previousButton).disabled = false;
    }
    if (a.data.length>=(page*perpage) && a.data.length>0){
      $(table).append("<tr></tr>");
      $.each(a.data[0], function(key, value){
        $(table + " tbody tr:last").append("<th>" + key + "</th>" );
      });

      var item=0;
      $.each(a.data, function(i, field){
        if (item>=pagestart && item<pageend){
          $(table).append("<tr></tr>");
          var eventitem;
          var eventable=0;
          $.each(field, function(i, field){
            if (i == eventkey){
              eventitem=field;
              eventable=1;
            }
            $(table + " tbody tr:last").append("<td>" + field + "</td>");
          });
          if (eventable){
            $(table + " tbody tr:last")
            .append("<td><a onclick='" + eventfunction + "(" + eventitem + ")' href='javascript:void(0);'>" + eventtext + "</a></td>");
          }
        }
        item++;

      });
      $("#evaluationnumbers").html(item);
    }else{
      $(table).append("<tr><td><center>No data</center></td></tr>" );
    }

}
