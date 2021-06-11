  var searchWrapper;
  var inputBox;
  var suggBox;
  var icon;
  let linkTag;
  let webLink;
  var space;
  var data;
  let userData;
  var apps;

  function changePage(mode) {
    document.getElementById('displayspace').innerHTML = sendGetRequest(mode);

    switch (mode) {
    case 'https://assets.netdb.ga/html/home/index.html':
  	window.history.pushState('home', 'Netdb | Home', '/home/');
      initHome();
      break;
    case 'https://assets.netdb.ga/html/news/index.html':
  	window.history.pushState('news', 'Netdb | News', '/news/');
      break;
    case 'https://assets.netdb.ga/html/dc_bot/index.html':
  	window.history.pushState('discordbot', 'Netdb | Discord Bot', '/discordbot/');
      break;
    case 'https://assets.netdb.ga/html/docs/index.html':
  	window.history.pushState('docs', 'Netdb | Docs', '/docs/');
      break;
    case 'https://assets.netdb.ga/html/login/index.html':
  	window.history.pushState('login', 'Netdb | Login', '/login/');
      break;
    case 'https://assets.netdb.ga/html/dashboard/index.html':
    window.history.pushState('dashboard', 'Netdb | Dashboard', '/dashboard/');
     initDashboard();
      break;
     default:
        break;
    }
  }

  function initDashboard() {

    if(!data) {
     changePage('https://assets.netdb.ga/html/login/index.html');
     return;
    }

    document.getElementById('d_username').innerHTML = data.Name;
    document.getElementById('d_profilepicture').src = data.Avatar;
    document.getElementById('acccreationdate').innerHTML = data.AccCreated;

    loadApps();
    initform();
  }

function initform()
{
var forms = document.getElementsByClassName('needs-validation');

var myModal = new bootstrap.Modal(document.getElementById('createApp'));
// Loop over them and prevent submission
var validation = Array.prototype.filter.call(forms, function(form) {
  form.addEventListener('submit', function(event) {
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else {
      event.preventDefault();
      event.stopPropagation();
if (form.id == 'd_createApp') {
  createApp(event);
}
else {
  updateApp(event);
}
      myModal.hide();
    }
    form.classList.add('was-validated');
  }, false);
});
}

  function loadApps() {
    const req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', 'https://api.netdb.ga/app/get');
    req.setRequestHeader('token', data.Token);
    req.onload = () => {
    console.log(req.response);
      apps = req.response;

      var col = 1;
      for (var i = 0; i < apps.Apps.length; i++) {

      if (col == 4) {
      col = 1;
      }

      var app = document.querySelector('#d_AppTemplate').cloneNode(true);
      app.id = 'd_App';
      app.classList.add(apps.Apps[i].Color);
      app.querySelector('button').setAttribute( "onclick", "initDashboardAppStats('" + apps.Apps[i].ClientId + "');" );
      app.querySelector('a').setAttribute( "onclick", "initEditApp('" + apps.Apps[i].ClientId + "');" );
      app.querySelector('#d_AppTitle').innerHTML = apps.Apps[i].Name;
      app.querySelector('#d_AppDescription').innerHTML = apps.Apps[i].Description;
      app.querySelector('#d_ClientId').innerHTML = apps.Apps[i].ClientId;
      app.style.display = 'block';
      var element = document.getElementById('d_app_' + col);
      element.appendChild(app);

      col++;
      }

      if (col == 4) {
      col = 1;
      }

      if (apps.Count < apps.Max) {
        var createBtn = document.querySelector('#d_createBtn').cloneNode(true);
        createBtn.style.display = 'block';
        var element = document.getElementById('d_app_' + col);
        element.appendChild(createBtn);
      }
    };

    req.send();
  }

  function initEditApp(id) {
    for (var i = 0; i < apps.Apps.length; i++) {
      if (apps.Apps[i].ClientId == id) {
        var modal = document.getElementById('editApp');
        modal.querySelector('#validationServer03').value = apps.Apps[i].Name;
        modal.querySelector('#validationTextarea').value = apps.Apps[i].Description;
        modal.querySelector('#validationServer04').value = apps.Apps[i].Color.charAt(0).toUpperCase() + apps.Apps[i].Color.slice(1);
        modal.querySelector('#d_deleteApp').setAttribute( "onclick", "deleteApp('" + apps.Apps[i].ClientId + "');" );
      }
    }
  }

  function initHome() {
    searchWrapper = document.querySelector(".searchbar");
    inputBox = searchWrapper.querySelector("input");
    suggBox = searchWrapper.querySelector(".autocom-box");
    icon = searchWrapper.querySelector("button");
    linkTag = searchWrapper.querySelector("a");
    space = document.getElementById('displayspace');

    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.open('GET', 'https://api.netdb.ga/info', true);
    request.onload = function() { // request successful

          document.getElementById("movies").innerHTML = request.response.movies;
          document.getElementById("users").innerHTML = request.response.users;
          document.getElementById("series").innerHTML = request.response.series;
    };

    request.send();

    inputBox.onkeyup = (e)=>{
        userData = e.target.value; //user enetered data
        if(userData != "") {
          sendGetAsyncRequest("https://api.netdb.ga/search/?type=simple&query=" + userData);
        }else{
            searchWrapper.classList.remove("active"); //hide autocomplete box
        }
    };
  inputBox.onkeydown = (e)=>{

        if (e.key == 'Enter'){
  	SearchMovie();
  	}
    };

  }

  function sendGetRequest(url) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, false);
    oReq.send();
    return oReq.responseText;
  }

  var oReq;
  function sendGetAsyncRequest(url) {
    oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.onload = searchBarReqAsync;
    oReq.onerror = searchBarReqError;
    oReq.send();
  }

  function searchBarReqAsync (e) {
    if (oReq.readyState === 4) {
      if (oReq.status === 200) {
        doSomething(oReq.responseText);
      } else {
        console.error(oReq.statusText);
      }
    }
  }

  function searchBarReqError(e) {
    console.error(oReq.statusText);
  }

  function doSomething(req){
    var obj = JSON.parse(req);
    var suggestions = [];

    for(var i = 0;i < obj.items.length;i++)
    {
        suggestions.push(obj.items[i].Name_en);
    }

    let emptyArray = [];

    if(userData){
      icon.onclick = ()=>{
              }

      emptyArray = suggestions.filter((data)=>{
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
          allList[i].setAttribute("onclick", "AutoCompleteClick(this.innerHTML)");
      }
  }
  }

  function sus(event) {
      if(event.key === 'Enter') {
  alert('search');
          SearchMovie();
      }
  }

  function AutoCompleteClick(val){
    document.getElementById('searchquery').value = val;
  }

  function showSuggestions(list) {
      let listData;
      if(!list.length){
          userValue = inputBox.value;
          listData = '<li>'+ userValue +'</li>';
      }else{
          listData = list.join('');
      }
      suggBox.innerHTML = listData;
  }

  function loginAsync() {

    if (!document.cookie) {
      return;
    }

  const req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', 'https://api.netdb.ga/login');
  req.setRequestHeader('token', document.cookie.split(';')[0].split('=')[1]);
  req.onload = () => {
    data = req.response;

    console.log(data);

    if(data['Name'] == null) {
      data = false;
     return;
    }

    document.getElementById('nav_loginbtn').style.display= "none";
    document.getElementById('nav_username').innerHTML= data['Name'];
    document.getElementById('nav_profilepicture').src= data['Avatar'];
    document.getElementById('nav_profile').style.display= "block";
  };

  req.send();
  }

  function login() {

    if (!document.cookie) {
      return;
    }

    var oReq = new XMLHttpRequest();
    oReq.open("GET", 'https://api.netdb.ga/login', false);
    oReq.setRequestHeader('token', document.cookie.split(';')[0].split('=')[1]);
    oReq.send();
    data = JSON.parse(oReq.responseText);
    console.log(data);

    if(data['Name'] == null) {
      data = false;
     return;
    }

    document.getElementById('nav_loginbtn').style.display= "none";
    document.getElementById('nav_username').innerHTML= data['Name'];
    document.getElementById('nav_profilepicture').src= data['Avatar'];
    document.getElementById('nav_profile').style.display= "block";
  }

  function logout() {
    document.getElementById('nav_profile').style.display= "none";
    document.getElementById('nav_loginbtn').style.display= "block";

    document.cookie = "token=; expires=Wed, 29 Sept 2004 00:00:00 UTC; path=/;SameSite=Strict; Secure";

    changePage('https://assets.netdb.ga/html/home/index.html');

    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.netdb.ga/login/revoke', true);
    request.setRequestHeader('token', data.Token);
    request.onload = function() { // request successful
      console.log('login revoke');
      data = null;
    };

    request.send();
  }

function deleteApp(id) {
  var url = "https://api.netdb.ga/app/delete/" + id;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader('token', data.Token);
  request.onload = function() { // request successful
  // we can use server response to our request now
    console.log('app deleted');
    clearApps();
    loadApps();
  };

request.send();

var myModalEl = document.getElementById('editApp');
let myModal = bootstrap.Modal.getInstance(myModalEl);

myModal.hide();
myModalEl.querySelector('form').classList.remove('was-validated');
}

  function updateApp(form) {
    var clientid = form.target.querySelector('#d_deleteApp').getAttribute('onclick');
    var url = "https://api.netdb.ga/app/update/" + clientid.replace('deleteApp(\'','').replace('\');','');
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    request.setRequestHeader('token', data.Token);
    request.onload = function() {
      console.log(request.responseText);
      clearApps();
      loadApps();
      form.target.classList.remove('was-validated');
    };

    request.onerror = function() {
      console.log('geht ned');
    };

    request.send(urlencodeFormData(new FormData(event.target))); // create FormData from form that triggered event
    event.preventDefault();
    event.stopPropagation();
  }

  function createApp(form) {
    var url = "https://api.netdb.ga/app/create";
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    request.setRequestHeader('token', data.Token);
    request.onload = function() {
      console.log(request.responseText);
      clearApps();
      loadApps();
      form.target.reset();
      form.target.classList.remove('was-validated');
    };

    request.onerror = function() {
      console.log('geht ned');
    };

    request.send(urlencodeFormData(new FormData(event.target))); // create FormData from form that triggered event
    event.preventDefault();
    event.stopPropagation();
  }

  function clearApps() {
    for (var i = 1; i <= 3; i++) {
      const myNode = document.getElementById("d_app_" + i);
      myNode.innerHTML = '';
    }
  }

  function urlencodeFormData(fd){
      var s = '';
      function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
      for(var pair of fd.entries()){
          if(typeof pair[1]=='string'){
              s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
          }
      }
      return s;
  }

  function SearchMovie(){
   var query = document.getElementById('searchquery').value;
   var obj = JSON.parse(sendGetRequest('https://api.netdb.ga/search/?type=simple&query=' + query));
   changePage('https://assets.netdb.ga/html/home/searchresults.html');
    var text = "";
    for(var i = 0;i < obj.items.length;i++)
    {
        text = AddSearchResult(text, obj.items[i].Name_en);
    }
  console.log(text);
    document.getElementById('results').innerHTML = text;
  }

  function AddSearchResult(text, name){
    text += "<div class=\"container\"><h2>" + name + "</h2><hr></div>";
    return text;
  }

  function initDashboardAppStats(clientid){
      for (var i = 0; i < apps.Apps.length; i++) {
        if (apps.Apps[i].ClientId == clientid) {
          document.getElementById('d_Stats_Name').innerHTML = apps.Apps[i].Name;
          document.getElementById('d_Stats_Description').innerHTML = apps.Apps[i].ClientId;
        }
      }
  }
