window.onload = function () {
    document.getElementById("search").onkeyup = searchKey;
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function showMovies() {
    var oReq = new XMLHttpRequest();
    oReq.onload = function () {
        var res = JSON.parse(this.responseText);
        displayResults(res);
    };
    oReq.open("GET", "/view.php?type=Movie&PHPSESSID=" + getCookie("PHPSESSID") + "&token=" + getCookie("token"), true);
    document.getElementById("content").innerHTML =  "";
    oReq.send();
}

function showSeries() {
    var oReq = new XMLHttpRequest();
    oReq.onload = function () {
        var res = JSON.parse(this.responseText);
        displayResults(res);
    };
    oReq.open("GET", "/view.php?type=TVSeries&PHPSESSID="  + getCookie("PHPSESSID") + "&token=" + getCookie("token"), true);
    document.getElementById("content").innerHTML =  "";
    oReq.send();
}

function displayResults(res) {
    for (var i = 0; i < res.result.length; i++) {
        let content = document.getElementById("content");
        let div = document.createElement("div");
        let img = document.createElement("img");
        img.src = res.result[i].desktopImg;
        img.style.width = "100%";
        img.style.height = "100%";
        div.append(img);
        div.style.width = "30%";
        div.style.height = "20%";
        content.append(div);
    }
}

function searchKey(ev){
    console.log(ev.code);
    if (ev.keyCode == 13) {
        var oReq = new XMLHttpRequest();
        oReq.onload = function () {
            var res = JSON.parse(this.responseText);
            displayResults(res);
        };
        oReq.open("GET", "/view.php?query=" + document.getElementById("search").value + "&PHPSESSID=" + getCookie("PHPSESSID") + "&token=" + getCookie("token"), true);
        document.getElementById("content").innerHTML =  "";
        oReq.send();
    }
}