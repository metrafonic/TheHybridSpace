function addQueryField(parent){
  text=document.createElement("input");
  text.innerHTML="Add query field";
  text = parent.appendChild(text);
}

function setFilter(context, callback) {
    var parent = document.getElementById(context);
    console.log(context);
    buttonAdd=document.createElement("button");
    buttonAdd.innerHTML="Add query field";
    buttonSearch=document.createElement("button");
    buttonSearch.innerHTML="Search";
    buttonAdd = parent.appendChild(buttonAdd);
    buttonSearch = parent.appendChild(buttonSearch);


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
