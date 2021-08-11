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

      displayNavandFooter();

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
      case 'https://assets.netdb.ga/html/profile/index.html':
      displayNavandFooter();
      window.history.pushState('profile', 'Netdb | Profile', '/profile/');
       initProfile();
        break;
     default:
        break;
    }
  }

function displayNavandFooter() {
  document.querySelector('nav').style.display = 'block';
  document.querySelector('footer').style.display = 'block';
}

  function initProfile() {
    if(!data) {
     changePage('https://assets.netdb.ga/html/login/index.html');
     return;
    }

    document.getElementById('p_name').innerHTML = data.Name;
    document.getElementById('p_email').innerHTML = data.Email;
    document.getElementById('p_avatar').src = data.Avatar;
    document.getElementById('validationServer03').value = data.Name;
    document.getElementById('validationServer04').value = data.Email;

    var permissions = ['Premium-User', 'Hub', 'Admin'];

    var badges = document.getElementById('badges');
    for (var i = 0; i < 3; i++) {
        if (data.Permissions[i] == 1) {
           badges.innerHTML += '<span class="badge bg-dark">' + permissions[i] + '</span>';
        }
        else {
          if (i == 0) {
            badges.innerHTML += '<span class="badge bg-dark">Basic-User</span>';
          }
        }
    }

    var linkaccounts = document.getElementById('accounts');

    if (data.SpotifyId == "") {
      let link = document.getElementById('spotifylink');
      linkaccounts.appendChild(link);
    }

    if (data.TwitchId == "") {
      let link = document.getElementById('twitchlink');
      linkaccounts.appendChild(link);
    }

    if (data.DiscordId == "") {
      let link = document.getElementById('discordlink');
      linkaccounts.appendChild(link);
    }

    var forms = document.getElementsByClassName('needs-validation');

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

          var formData = new FormData(form);

          if (data.Name != formData.get('name') || data.Name != formData.get('email')) {
            updateProfile(event);
          }
        }
        form.classList.add('was-validated');
      }, false);
    });
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
    var script=document.createElement('script');
    script.type='text/javascript';
    script.src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.3.2/chart.min.js';

    script.onload = () => {

    };

    document.getElementsByTagName('head')[0].appendChild(script);
  }

function initform()
{
var forms = document.getElementsByClassName('needs-validation');

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

var myModal;

if (form.id == 'd_createApp') {
   myModal = bootstrap.Modal.getInstance(document.getElementById('createApp'));
}
else {
   myModal = bootstrap.Modal.getInstance(document.getElementById('editApp'));
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

      clearApps();

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

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function loginAsync() {

    if (getCookie('token') == null) {
      return;
    }

  const req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', 'https://api.netdb.ga/login');
  req.setRequestHeader('token', getCookie('token'));
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

    if (getCookie('token') == null) {
      return;
    }

    var oReq = new XMLHttpRequest();
    oReq.open("GET", 'https://api.netdb.ga/login', false);
    oReq.setRequestHeader('token', getCookie('token'));
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

    document.cookie = "token=; expires=Wed, 29 Sept 2004 00:00:00 UTC;Domain=.netdb.ga; path=/;SameSite=Strict; Secure";

    changePage('https://assets.netdb.ga/html/home/index.html');

    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.netdb.ga/login/revoke', true);
    request.setRequestHeader('token', data.Token);
    request.onload = function() {
      console.log('login revoked');
      data = null;
    };

    request.send();
  }

function deleteApp(id) {
  var url = "https://api.netdb.ga/app/delete?clientId=" + id;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader('token', data.Token);
  request.onload = function() { // request successful
  // we can use server response to our request now
    console.log('app deleted');
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
    var url = "https://api.netdb.ga/app/update";
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    request.setRequestHeader('token', data.Token);
    request.onload = function() {
      console.log(request.responseText);
      loadApps();
      form.target.classList.remove('was-validated');
    };

    request.onerror = function() {
      console.log('geht ned');
    };

    request.send(urlencodeFormData(new FormData(event.target)) + '&clientid=' + clientid.replace('deleteApp(\'','').replace('\');','')); // create FormData from form that triggered event
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

   changePage('https://assets.netdb.ga/html/home/searchresults.html');

   var request = new XMLHttpRequest();
   request.responseType = 'json';
   request.open('GET', 'https://api.netdb.ga/search/?type=simple&query=' + query, true);
   request.onload = function() {

   var element = document.getElementById('searchresults');
   element.innerHTML = '';

   for(var i = 0;i < 20;i++)
   {
     var result = document.querySelector('#s_result').cloneNode(true);

     result.querySelector('#s_cover').src = 'https://hub.netdb.ga/assets/image-not-found.jpg';
     result.querySelector('#s_title').innerHTML = request.response.items[i].Name_en;
     result.querySelector('#s_description').innerHTML = 'exampledescription';
     result.querySelector('#s_id').innerHTML = request.response.items[i].Id;

     element.appendChild(result);
   }

   var loading = document.getElementById('loading');
   element.appendChild(loading);
   };

   request.send();
  }

  function initDashboardAppStats(clientid){
      for (var i = 0; i < apps.Apps.length; i++) {
        if (apps.Apps[i].ClientId == clientid) {
          document.getElementById('d_Stats_Name').innerHTML = apps.Apps[i].Name;
          document.getElementById('d_Stats_Description').innerHTML = apps.Apps[i].Description;
          document.getElementById('d_Stats_clientId').innerHTML = apps.Apps[i].ClientId;
          document.getElementById('d_Stats_clientSecret').innerHTML = apps.Apps[i].ClientSecret;

          Chart.helpers.each(Chart.instances, function(instance){
               instance.destroy();
          })

          var ctx = document.getElementById('Chart').getContext('2d');

          var xValues = ['00:00','01:00','02:00','03:00','04:00', '05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
          var yValues = [7,8,8,9,9,9,10,11,14,14,15];

          var myChart = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: xValues,
                  datasets: [{
                    data: yValues,
                    fill: false,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderColor: "rgba(0,0,0,0.1)",
                  }]
              },
              options: {
                plugins:{
             legend: {
              display: false
             }
           },
                  scales: {
            y: {
                        gridLines: {
                          show: false
                        }
                      }
                    }
              }
          });
        }
      }
  }

function toggleClientSecret() {
  if (document.getElementById('d_togglebutton').innerHTML == 'Show client secret') {
    document.querySelector('.d_clientSecret').style.display = 'block';
    document.getElementById('d_togglebutton').innerHTML = 'Hide client secret';
  }
  else {
    document.querySelector('.d_clientSecret').style.display = 'none';
    document.getElementById('d_togglebutton').innerHTML = 'Show client secret';
  }

  }

  function resetClientSecret() {
    var request = new XMLHttpRequest();
    request.open('POST', 'https://api.netdb.ga/app/reset', true);
    request.setRequestHeader('token', data.Token);
    request.onload = function() {
        loadApps();

        document.querySelector('.d_clientSecret').style.display = 'none';
        document.getElementById('d_togglebutton').innerHTML = 'Show client secret';

        let myModal = bootstrap.Modal.getInstance(document.getElementById('appStats'));

        myModal.hide();
    };

    request.send('clientId=' + document.getElementById('d_Stats_clientId').innerHTML + '&' + 'clientSecret=' + document.getElementById('d_Stats_clientSecret').innerHTML);
  }

  function deleteAccount() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.netdb.ga/user/delete', true);
    request.setRequestHeader('token', data.Token);
    request.onload = function() {
      logout();
    };

    request.send();
  }

function updateProfile(form) {
  var request = new XMLHttpRequest();
  request.open('POST', 'https://api.netdb.ga/user/update', true);
  request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  request.setRequestHeader('token', data.Token);
  request.onload = function() {
    console.log(request.responseText);
    form.target.classList.remove('was-validated');
    login();

    document.getElementById('p_name').innerHTML = data.Name;
    document.getElementById('p_email').innerHTML = data.Email;
    document.getElementById('p_avatar').src = data.Avatar;
    document.getElementById('validationServer03').value = data.Name;
    document.getElementById('validationServer04').value = data.Email;
  };

  request.onerror = function() {
    console.log('geht ned');
  };

  request.send(urlencodeFormData(new FormData(event.target))); // create FormData from form that triggered event
  event.preventDefault();
  event.stopPropagation();
}

function linkAccount() {
  var linktoken = getCookie('linkacc');
  var type = getCookie('linktype');

  if (linktoken == null) {
    return;
  }

  var oReq = new XMLHttpRequest();
  oReq.open("POST", 'https://api.netdb.ga/link', false);
  oReq.setRequestHeader('token', data.Token);
  oReq.send('type=' + type + '&token=' + linktoken);

  document.cookie = "linkacc=; expires=Wed, 29 Sept 2004 00:00:00 UTC;Domain=.netdb.ga; path=/;SameSite=Strict; Secure";
  document.cookie = "linktype=; expires=Wed, 29 Sept 2004 00:00:00 UTC;Domain=.netdb.ga; path=/;SameSite=Strict; Secure";

  login();
}
