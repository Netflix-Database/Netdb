<?php
//
// Player State Enum:
// 0 = paused
// 1 = playing
//
$servername = "127.0.0.1";
$username = "netdb-backend";
$password = "m7SfTQOIhLe29pHu";

$lastViewedEventId = 0;

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

function generateRandomString($length = 10) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, $charactersLength - 1)];
	}
	return $randomString;
}

function sendEvent($data) {
	echo "data: " . json_encode($data) . "\n\n";
	flush();
}

function sendEventMessage($data) {
	$eventDataTemp = (object) [
		'type' => 'message',
		'value' => $data
	];
	echo "data: " . json_encode($eventDataTemp) . "\n\n";
	flush();
}

function sendPing() {
	$eventDataTemp = (object) [
		'type' => 'ping',
	];
	echo "data: " . json_encode($eventDataTemp) . "\n\n";
	flush();
}

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
ignore_user_abort(1);

session_start();

//permission check

$session_id = session_id();

session_abort();

sendEventMessage("Connected.");

ob_end_flush();

if (isset($_GET["action"])) {
	$con = new PDO("mysql:host=$servername;dbname=watchparty", $username, $password);
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if ($_GET["action"] == "create") {
		$party_session_id = generateRandomString(16);
		$now = DateTime::createFromFormat('U.u', microtime(true));
		$start_time = $now->format("m-d-Y H:i:s.u");
		$req = "INSERT INTO partys (session_id) VALUES (:session_id);";
		$stmt = $con->prepare($req);
		$stmt->execute([":session_id" => $party_session_id]);

		$req = "INSERT INTO party_members (member_session_id, party_session_id) VALUES (:member_session_id, :party_session_id);";
		$stmt = $con->prepare($req);
		$stmt->execute([":member_session_id" => $session_id, ":party_session_id" => $party_session_id]);

		$eventDataTemp = (object) [
			'type' => "party_data",
			'id' => $party_session_id,
		];

		sendEventMessage("Created party.");
		sendEvent($eventDataTemp);
	}
	else if ($_GET["action"] == "join") {
		$party_session_id = $_GET["party_id"];
		$req = "INSERT INTO party_members (member_session_id, party_session_id) VALUES (:member_session_id, :party_session_id);";
		$stmt = $con->prepare($req);
		$stmt->execute([":member_session_id" => $session_id, ":party_session_id" => $party_session_id]);
		
		$req = "INSERT INTO party_events (party_session_id, member_session_id, event) VALUES (:party, :member, :event);";
		$stmt = $con->prepare($req);
		$stmt->execute([":party" => $party_session_id, ":member" => $session_id, ":event" => "User joined!"]);

		sendEventMessage("Joined party!");
	}

	$specialSchedule = 0;

	while (!connection_aborted()) {
		
		$req = "SELECT * FROM party_events WHERE party_session_id = :party_session_id AND id > :lastViewedEventId ORDER BY id ASC;";
		$stmt = $con->prepare($req);
		$stmt->execute([":party_session_id" => $party_session_id, ":lastViewedEventId" => $lastViewedEventId]);

		while ($row = $stmt->fetch()) {
			$eventDataTemp = (object) [
				'type' => "event",
				'value' => $row["event"],
			];
			sendEvent($eventDataTemp);
			$lastViewedEventId = $row["id"];
		}

		$specialSchedule++;

		if ($specialSchedule > 4) {
			$specialSchedule = 0;

			sendPing();

			$req = "SELECT * FROM partys WHERE session_id = :party_id;";
			$stmt = $con->prepare($req);
			$stmt->execute([":party_id" => $party_session_id]);
			if (!($row = $stmt->fetch())) {
				$req = "DELETE FROM partys WHERE session_id = :party_id;";
				$stmt = $con->prepare($req);
				$stmt->execute([":party_id" => $party_session_id]);

				$req = "DELETE FROM party_members WHERE party_session_id = :party_id;";
				$stmt = $con->prepare($req);
				$stmt->execute([":party_id" => $party_session_id]);
				sendEventMessage("Party deleted.");
				die("Party deleted.");
			}
		}

		usleep(500000);
	}

	$req = "DELETE FROM party_members WHERE member_session_id = :member_id;";
	$stmt = $con->prepare($req);
	$stmt->execute([":member_id" => session_id()]);

	$req = "INSERT INTO party_events (party_session_id, member_session_id, event) VALUES (:party, :member, :event);";
	$stmt = $con->prepare($req);
	$stmt->execute([":party" => $party_session_id, ":member" => $session_id, ":event" => "User left!"]);

	$req = "SELECT * FROM party_members WHERE party_session_id = :party_id;";
	$stmt = $con->prepare($req);
	$stmt->execute([":party_id" => $party_session_id]);
	if (!($row = $stmt->fetch())) {
		$req = "DELETE FROM partys WHERE session_id = :party_id;";
		$stmt = $con->prepare($req);
		$stmt->execute([":party_id" => $party_session_id]);

		$req = "DELETE FROM party_members WHERE party_session_id = :party_id;";
		$stmt = $con->prepare($req);
		$stmt->execute([":party_id" => $party_session_id]);
	}
}
?>
