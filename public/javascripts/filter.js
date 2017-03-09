function addQueryField(parent){
  br=document.createElement("br");
  text=document.createElement("input");
  text.innerHTML="Add query field";
  text = parent.appendChild(text);
  parent.appendChild(br);
}

function setFilter(context, callback) {
    var parent = document.getElementById(context);
    console.log(context);
    buttonAdd=document.createElement("button");
    br=document.createElement("br");
    buttonAdd.innerHTML="Add query field";
    buttonSearch=document.createElement("button");
    buttonSearch.innerHTML="Search";
    buttonAdd = parent.appendChild(buttonAdd);
    buttonSearch = parent.appendChild(buttonSearch);
    parent.appendChild(br);


    buttonAdd.addEventListener("click", function(){
      addQueryField(parent);
    });
    buttonSearch.addEventListener("click", function(){
      returnstring="?";
      callback("?collection=Ving68");
      inputs = parent.getElementsByTagName('input');
      for (index = 0; index < inputs.length; ++index) {
          console.log(inputs[index].value);
          text= inputs[index].value + "&";
          returnstring=returnstring + text;
      }
      callback(returnstring);
    });
}
