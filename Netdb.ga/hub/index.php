<?php
  $servername = "127.0.0.1";
  $username = "netdb-backend";
  $password = "m7SfTQOIhLe29pHu";
  session_start();
  if(isset($_COOKIE["token"]) || isset($_SESSION["onetimeaccess"])) {
    $conn = new PDO("mysql:host=$servername;dbname=netdb", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $req = "SELECT * FROM users WHERE token=:tok;";
    $stmt = $conn->prepare($req);
    $stmt->execute([":tok" => $_COOKIE["token"]]);
    $onetime = false;
    if ($_SESSION["onetimeaccess"]) { 
      if ($_SESSION["moviebound"]) {
        if ($_SESSION["movieId"] == $_GET["id"]){
          $onetime = true;
        }
      } else{
        $onetime = true;
      }
    }
    if($row = $stmt->fetch()) {
      if (substr($row["permissions"], 1, 1) == "1" || $onetime) {
      $req = "SELECT * FROM streammovies ORDER BY id DESC;";
      $stmt = $conn->query($req);
    ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <html lang="en">
  <meta name="description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta name="keywords" content="Netflix, API, Netdb, Hub">
  <meta name="author" content="Yannick Fuereder">
  <meta name="theme-color" content="#ff9900">
  <meta name="google" value="notranslate">

 <!-- Primary Meta Tags -->
  <title>Netdb Hub</title>
  <meta name="title" content="Netdb Hub">
  <meta name="description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://hub.netdb.ga/">
  <meta property="og:title" content="NetdbHub">
  <meta property="og:description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta property="og:image" content="https://assets.netdb.ga/hub/content/HUB.png">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://hub.netdb.ga/">
  <meta property="twitter:title" content="NetdbHub">
  <meta property="twitter:description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta property="twitter:image" content="https://assets.netdb.ga/hub/content/HUB.png">

  <link rel="icon" href="https://assets.netdb.ga/content/hubfavicon.png" type="image/x-icon"/>
  <link rel="shortcut icon" href="https://assets.netdb.ga/content/hubfavicon.png" type="image/x-icon"/>

  <link rel="preload" as="image" href="https://assets.netdb.ga/hub/HUB.png"/>
  <link rel="preload" as="style" href="https://assets.netdb.ga/css/hub.css"/>
        <script src="main.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://assets.netdb.ga/hub/css/hub.css">
  </head>
  <body>
<div class="intro">
  <div class="center">
	<h1 class="text">Netdb</h1>
	<div class="fadetext"></div>
	<img class="logo" src="https://assets.netdb.ga/hub/content/HUB_icononly.png" width="200"></img>
  </div>
</div>
    <nav class="navbar navbar-expand-lg navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="https://hub.netdb.ga"><img src="https://assets.netdb.ga/hub/content/HUB.png" alt="" width="90"></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" onclick="showMovies()">Movies</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" onclick="showSeries()">Shows</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">My List</a>
        </li>
      </ul>
      <div class="d-flex">
        <input class="form-control me-2" id="search" placeholder="Search">
      </div>
    </div>
  </div>
</nav>
<div id="content">
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner large">
      <?php
      for ($i = 0; $i<3; $i++) {
        if ($row = $stmt->fetch()) {
      ?>
        <div class="carousel-item<?php if ($i == 0) { echo " active"; }?>" data-bs-interval="6000">
          <div class="large-cover">
          <img style="width:100%;" src="<?php echo $row["desktopImg"];?>" alt="<?php echo $row["name"];?>"> </img>
          </div>
          <div class="carousel-caption d-none d-md-block">
            <div class="title">
            <img src="<?php echo $row["titleImg_en"];?>" alt="<?php echo $row["name"];?>"> </img>
            </div>
            <div class="tags">
              <span class="badge bg-dark"><?php echo $row["releasedate"]; ?></span>
              <span class="badge bg-dark"><?php echo $row["age"]; ?>+</span>
              <span class="badge bg-dark"><?php echo $row["length"]; ?></span>
              <span class="badge bg-dark"><?php echo $row["topGenre"]; ?></span>
            </div>
            <div class="play">
            <button onclick="window.location='/watch/?id=<?php echo $row["movieId"]; ?>';" type="button" name="Play" class="btn btn-secondary"><img src="https://assets.netdb.ga/hub/content/playwhitethick.png" alt="" width="15">  Play</button>              <button type="button" name="Play" class="btn btn-light">More Info</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        <?php
      }}
        ?>
  <?php } else { ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <html lang="en">
  <meta name="description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta name="keywords" content="Netflix, API, Netdb, Hub">
  <meta name="author" content="Yannick Fuereder">
  <meta name="theme-color" content="#ff9900">
  <meta name="google" value="notranslate">

 <!-- Primary Meta Tags -->
  <title>Netdb Hub</title>
  <meta name="title" content="Netdb Hub">
  <meta name="description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://hub.netdb.ga/">
  <meta property="og:title" content="NetdbHub">
  <meta property="og:description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta property="og:image" content="https://assets.netdb.ga/hub/content/HUB.png">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://hub.netdb.ga/">
  <meta property="twitter:title" content="NetdbHub">
  <meta property="twitter:description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta property="twitter:image" content="https://assets.netdb.ga/hub/content/HUB.png">

  <link rel="icon" href="https://assets.netdb.ga/content/hubfavicon.png" type="image/x-icon"/>
  <link rel="shortcut icon" href="https://assets.netdb.ga/content/hubfavicon.png" type="image/x-icon"/>
  </head>

    <script>
      window.onload = function() { window.location = "https://hub.netdb.ga/login/"; };
    </script>
  <?php }
  } else { ?>
    <h1>Hub permission missing</h1>
  <?php }
}
else {
  ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <html lang="en">
  <meta name="description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta name="keywords" content="Netflix, API, Netdb, Hub">
  <meta name="author" content="Yannick Fuereder">
  <meta name="theme-color" content="#ff9900">
  <meta name="google" value="notranslate">

 <!-- Primary Meta Tags -->
  <title>Netdb Hub</title>
  <meta name="title" content="Netdb Hub">
  <meta name="description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://hub.netdb.ga/">
  <meta property="og:title" content="NetdbHub">
  <meta property="og:description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta property="og:image" content="https://assets.netdb.ga/hub/content/HUB.png">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://hub.netdb.ga/">
  <meta property="twitter:title" content="NetdbHub">
  <meta property="twitter:description" content="Netdb is an unofficial API for all movies and shows provided by Netflix">
  <meta property="twitter:image" content="https://assets.netdb.ga/hub/content/HUB.png">

  <link rel="icon" href="https://assets.netdb.ga/content/hubfavicon.png" type="image/x-icon"/>
  <link rel="shortcut icon" href="https://assets.netdb.ga/content/hubfavicon.png" type="image/x-icon"/>
  </head>

    <script>
      window.onload = function() { window.location = "/login"; };
    </script>
  <?php
}
?>