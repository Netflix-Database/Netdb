var bt = document.getElementById("bt");
var nextEP = document.getElementById("nexteplink").innerHTML;
var nextS = document.getElementById("nextslink");
if (nextS != null){
    nextS = nextS.innerHTML;
}

setInterval(checkTimeAndSendUpdate, 5000);

function checkTimeAndSendUpdate(){
    let vid = document.getElementById("player");
    let left = vid.duration - vid.currentTime;
    if (left < 35) {
        let btn = "<btn onclick=\"window.location='";
        if (nextEP != "season" && nextEP != "none") {
            btn += nextEP + "';\">Next Episode</btn>";    
        }
        else if (nextEP == "season") {
            btn += nextS + "';\">Next Season</btn>";    
        }
        else {
            btn += "/';\">back to Hub</btn>";    
        }
        bt.innerHTML = btn;
    }
    else {
        bt.innerHTML = "";
    }
    var r = new XMLHttpRequest();
    r.open("GET", "watchtime.php?id=", true);
    r.send();
    console.log("update");
}