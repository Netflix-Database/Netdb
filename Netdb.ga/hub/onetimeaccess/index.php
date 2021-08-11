<?php
$servername = "127.0.0.1";
$username = "backend";
$password = "Geheimnis123!";
session_start();

if (isset($_GET["token"])) {
    $conn = new PDO("mysql:host=$servername;dbname=sys", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $req = "SELECT * FROM onetimeaccess WHERE token=:id;";
    $stmt = $conn->prepare($req);
    $stmt->execute([":id" => $_GET["token"]]);
    if ($row = $stmt->fetch()) {
        $time = $row["expires"];
        $now = date("Y/m/d h:i:sa");
        $cone = new DateTime($time);
        $ctwo = new DateTime($now);
        if ($row["expires"] == "" || $cone >= $ctwo) {
            $_SESSION["onetimeaccess"] = true;
            $_SESSION["moviebound"] = intval($row["movieId"]) != -1;
            $_SESSION["movieId"] = $row["movieId"];
            $req = "DELETE FROM onetimeaccess WHERE token=:id;";
            $stmt = $conn->prepare($req);
            $stmt->execute([":id" => $_GET["token"]]);
            ?>
            <script>
             window.onload = function() { window.location = "/"; };
            </script>
        <?php }
        else { 
            $req = "DELETE FROM onetimeaccess WHERE token=:id;";
            $stmt = $conn->prepare($req);
            $stmt->execute([":id" => $_GET["token"]]);
            ?>
                <h1>OneTimeAccess expired.</h1>
            <?php }
    } else { ?>
    <h1>OneTimeAccess Token invalid.</h1>
    <?php }
}
?>