<?php
function rand_string( $length ) {  
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";  
    $size = strlen( $chars );  
    $str = "nth";
    for( $i = 0; $i < $length; $i++ ) {  
    $strr= $chars[ random_int( 0, $size - 1 ) ];  
    $str .= $strr;
    }  
    return $str;
}  

  $servername = "127.0.0.1";
  $username = "backend";
  $password = "Geheimnis123!";
  session_start();
  if(isset($_COOKIE["token"]) || isset($_SESSION["onetimeaccess"])) {
    $conn = new PDO("mysql:host=$servername;dbname=sys", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $req = "SELECT * FROM users WHERE token='";
    $req .= $_COOKIE["token"];
    $req .= "';";
    $stmt = $conn->query($req);
    if($row = $stmt->fetch()) {
        if (substr($row["permissions"], 1, 1) == "1") {
            $req = "INSERT INTO onetimeaccess (token,expires,movieId) VALUES (:token,:expires,:movieId);";
            $stmt = $conn->prepare($req);
            $token = rand_string(32);
            $expires = date("Y/m/d h:i:sa");
            $minutes_to_add = 5;
            $date = new DateTime($expires);
            $date->add(new DateInterval('PT' . $minutes_to_add . 'M'));
            $expires = $date->format('Y/m/d h:i:sa');
            $movieId = -1;
            $stmt->execute([":token" => $token, ":expires" => $expires, ":movieId" => $movieId]);
            if ($stmt->rowCount()) { ?>
                <input type="text" style="width:30%;" value="https://hub.netdb.ga/onetimeaccess/view/?token=<?php echo $token; ?>" readonly>
            <?php } else { ?>
                <h1>failed</h1>
            <?php }
        }
    } else {
        echo "<h1>not logged in</h1>";
    }
}