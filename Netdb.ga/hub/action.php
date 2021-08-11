<?php
$servername = "127.0.0.1";
$username = "netdb-backend";
$password = "m7SfTQOIhLe29pHu";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function getCurrentTime() {
    $nowTemp = DateTime::createFromFormat('U.u', microtime(true));
    return $nowTemp;
}

function getCurrentTimeString() {
    $nowTempp = DateTime::createFromFormat('U.u', microtime(true));
    return $nowTempp->format("m-d-Y H:i:s.u");
}

session_start();

$party_session_id = $_GET["party_id"];
$event = $_GET["event"];

$con = new PDO("mysql:host=$servername;dbname=watchparty", $username, $password);
$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
echo "here";
$req = "SELECT * FROM party_members WHERE party_session_id = :party AND member_session_id = :member;";
$stmt = $con->prepare($req);
$stmt->execute([":party" => $party_session_id, ":member" => session_id()]);
if ($stmt->fetch()) {
    $req = "INSERT INTO party_events (party_session_id, member_session_id, event) VALUES (:party, :member, :event);";
    $stmt = $con->prepare($req);
    $stmt->execute([":party" => $party_session_id, ":member" => session_id(), ":event" => $event]);
    die("Event triggered.");
}
else {
    die("Permission denied.");
}
?>