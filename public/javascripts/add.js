var mathCanvas = document.getElementById("tools_sketch");
var ctx = mathCanvas.getContext("2d");
var el = mathCanvas.target || mathCanvas.srcElement;


var img = new Image();
img.src = "/images/dot.png";
mathCanvas.onclick = function(event) {
    ctx.clearRect(0, 0, mathCanvas.width, mathCanvas.height);
    var realx = (Math.round(event.offsetX) - 250)/2.5;
    var realy = -(Math.round(event.offsetY) - 250)/2.5;
    var x = Math.round(event.offsetX - img.width / 2);
    var y = Math.round(event.offsetY - img.height / 2);
    ctx.drawImage(img, x, y);
    console.log(realx, realy);
    document.getElementById("x").value = realx;
    document.getElementById("y").value = realy;

};

// wait for the DOM to be loaded
$(document).ready(function() {
    // bind 'myForm' and provide a simple callback function
    $('#dataform').ajaxForm({
        success: function() {
            $.notify("Successfully added data", {
                position: "bottom right",
                className: "bootstrap"
            });

        },
        error: function(response) {
          console.log(response.responseText);
            $.notify(response.responseText, {
                position: "bottom right",
                className: "error"
            });

        },

    });
});
