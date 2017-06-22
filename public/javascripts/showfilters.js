function showFilters(context){
  htmlplace = document.getElementById(context);
  htmlplace.innerHTML="";
  var urlParams = new URLSearchParams(window.location.search);
  var entries = urlParams.entries();
  for(pair of entries) {
    htmlplace.innerHTML+="<a  href='javascript:void(0);' onClick=removeFilter('" + pair[0] + "')>[x]</a> " + pair[0] + ": " + pair[1] + "<br>";
  }

}

function removeFilter(parameter){
  var url=document.location.href;
  var urlparts= url.split('?');

 if (urlparts.length>=2)
 {
  var urlBase=urlparts.shift();
  var queryString=urlparts.join("?");

  var prefix = encodeURIComponent(parameter)+'=';
  var pars = queryString.split(/[&;]/g);
  for (var i= pars.length; i-->0;)
      if (pars[i].lastIndexOf(prefix, 0)!==-1)
          pars.splice(i, 1);
  url = urlBase+'?'+pars.join('&');
  window.history.pushState('',document.title,url); // added this line to push the new url directly to url bar .

}
location.reload();
}
