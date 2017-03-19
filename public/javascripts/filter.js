function addQueryField(parent, data){
  div=document.createElement("div");
  div=parent.appendChild(div);
  select=document.createElement("select");
  input=document.createElement("input");
  input.style.width="50px";
  text=document.createElement("text");
  text.innerHTML=" = ";
  select = div.appendChild(select);
  $.each(data[0], function(key, value) {
      console.log(key, value);
      option=document.createElement("option");
      option.innerHTML=key;
      select.appendChild(option);
  });
  div.appendChild(text);
  div.appendChild(input);
  div.appendChild(br);
}

function setFilter(context, callback, data) {
    var parent = document.getElementById(context);
    buttonAdd=document.createElement("button");
    br=document.createElement("br");
    buttonAdd.innerHTML="Add query field";
    buttonSearch=document.createElement("button");
    buttonSearch.innerHTML="Search";
    buttonAdd = parent.appendChild(buttonAdd);
    buttonSearch = parent.appendChild(buttonSearch);
    parent.appendChild(document.createElement("hr"));


    buttonAdd.addEventListener("click", function(){
      addQueryField(parent, data);
    });
    buttonSearch.addEventListener("click", function(){
      returnstring="?";
      callback("?collection=Ving68");
      div = parent.getElementsByTagName('div');
      for (index = 0; index < div.length; ++index) {
        inputs = div[index].getElementsByTagName('input');
        selects = div[index].getElementsByTagName('select');
        options = div[index].getElementsByTagName('option');
          console.log(options[selects[0].selectedIndex].innerHTML);
          text= options[selects[0].selectedIndex].innerHTML + "=" + inputs[0].value + "&";
          returnstring=returnstring + text;
      }
      callback(returnstring);
    });

}
