var currentUser;

LoginManager.isLoggedIn().then(async (e) => {
  if (!e) {
    window.location.href = 'https://login.netdb.at';
    return;	
  }

  const token = LoginManager.getCookie("token");

  const req = await fetch("https://api.login.netdb.at/user", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if(req.status == 401) {
    window.location.href = 'https://login.netdb.at';
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  const user = res.data;
  currentUser = user;

  document.getElementById("username").value = user.username;
  document.getElementById("firstname").value = user.firstname;
  document.getElementById("lastname").value = user.lastname;
  document.getElementById("pi_email").value = user.email;
  document.getElementById("cp_email").value = user.email;
  document.getElementById("country").value = user.country;
  document.getElementById("preferredlang").value = user.preferredLang;

  if (user.discordId !== null)
    document.getElementById("ca_discord").classList.add("connected");

  if (user.sporifyId !== null)
    document.getElementById("ca_spotify").classList.add("connected");

  if (user.twitchId !== null)
    document.getElementById("ca_twitch").classList.add("connected");

  // if (user.githubId !== null)
  //   document.getElementById("ca_github").classList.add("connected");

  // if (user.googleId !== null)
  //   document.getElementById("ca_google").classList.add("connected");

  // if (user.appleId !== null)
  //   document.getElementById("ca_apple").classList.add("connected");

  if (user["2fa"] && user["2faType"] == "App")
    document.getElementById("cp_2fa").classList.remove("d-none");
});

document.getElementById("pi_save").addEventListener("click", savePersonalInformation);
document.getElementById("cp_save").addEventListener("click", changePassword);


async function savePersonalInformation() {
  const req = await fetch("https://api.login.netdb.at/user", {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + LoginManager.getCookie("token"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      firstname: document.getElementById("firstname").value,
      lastname: document.getElementById("lastname").value,
      country: document.getElementById("country").value,
      preferredLang: document.getElementById("preferredlang").value,
      username: document.getElementById("username").value,
    })
  });

  if(req.status == 401) {
    window.location.href = 'https://login.netdb.at';
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }
}

async function changePassword() { 
  //move to /user/password
  // TODO: validate new pw
  const req = await fetch("https://api.login.netdb.at/resetpassword", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + LoginManager.getCookie("token"),
      "Content-Type": "application/json"
    },
    body: {
      OldPassword: document.getElementById("oldpassword").value,
      Email: document.getElementById("cp_email").value,
      Password: document.getElementById("newpassword").value,
      TwoFaToken: currentUser["2fa"] ? document.getElementById("cp_2fa").value : null
    }
  });

  if(req.status == 401) {
    window.location.href = 'https://login.netdb.at';
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  window.location.href = 'https://login.netdb.at/?redirect=' + encodeURIComponent(window.location.href);
}