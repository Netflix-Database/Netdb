var searchWrapper;
var inputBox;
var suggBox;
var icon;
let linkTag;
let webLink;
var space;

function init() {
  searchWrapper = document.querySelector(".searchbar");
  inputBox = searchWrapper.querySelector("input");
  suggBox = searchWrapper.querySelector(".autocom-box");
  icon = searchWrapper.querySelector("button");
  linkTag = searchWrapper.querySelector("a");
  space = document.getElementById('displayspace');

  inputBox.onkeyup = (e)=>{
      let userData = e.target.value; //user enetered data
      if(userData != "") {
        var obj = JSON.parse(sendGetRequest("/api/v1/search/" + userData));
        var suggestions = [];
        for(var i = 0;i < obj.items.length;i++)
        {
            suggestions.push(obj.items[i].Name_en);
        }
      }
      let emptyArray = [];
      if(userData){
          icon.onclick = ()=>{
              webLink = "https://www.google.com/search?q=" + userData;
              linkTag.setAttribute("href", webLink);
              console.log(webLink);
              linkTag.click();
          }
          emptyArray = suggestions.filter((data)=>{
              //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
              return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
          });
          emptyArray = emptyArray.map((data)=>{
              // passing return data inside li tag
              return data = '<li>'+ data +'</li>';
          });
          searchWrapper.classList.add("active"); //show autocomplete box
          showSuggestions(emptyArray);
          let allList = suggBox.querySelectorAll("li");
          for (let i = 0; i < allList.length; i++) {
              //adding onclick attribute in all li tag
              allList[i].setAttribute("onclick", "select(this)");
          }
      }else{
          searchWrapper.classList.remove("active"); //hide autocomplete box
      }
  };
}

function changePage(mode) {
  document.getElementById('displayspace').innerHTML = sendGetRequest(mode);

  switch (mode) {
  case 'https://netdb.ga/webapp/home/index.html':
	window.history.pushState('home', 'Netdb | Home', '/home');
	
  var obj = JSON.parse(sendGetRequest('/api/v1/info/'));
  document.getElementById("movies").innerHTML = obj.movies;
  document.getElementById("users").innerHTML = obj.users;
  document.getElementById("series").innerHTML = obj.series;
    init();

    break;
  case 'https://netdb.ga/webapp/news/index.html':
	window.history.pushState('news', 'Netdb | News', '/news');
    break;
  case 'https://netdb.ga/webapp/dc_bot/index.html':
	window.history.pushState('discordbot', 'Netdb | Discord Bot', '/discordbot');
    break;
  case 'https://netdb.ga/webapp/docs/index.html':
	window.history.pushState('docs', 'Netdb | Docs', '/docs');
    break;
  case 'https://netdb.ga/webapp/login/index.html':
	window.history.pushState('login', 'Netdb | Login', '/login');
    break;
   default:
      break;
}
}

function sendGetRequest(url) {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, false);
  oReq.send();
  return oReq.responseText;
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}

function login(){

var data = JSON.parse(sendGetRequest('/api/v1/login/' + document.cookie.split(';')[0].split('=')[1]));
console.log(data);

if(data['Name'] == null) {
 return;
}

document.getElementById('loginbtn').style.display= "none";
document.getElementById("username").innerHTML= data['Name']; 
document.getElementById("profilepicture").src= data['Avatar'];
document.getElementById("profile").style.display= "block"; 

}

function createacc(){
  document.getElementById("login").style.display= "none"; 
  document.getElementById("create").style.display= "block"; 
  document.getElementById("create").classList.add("show");
}
