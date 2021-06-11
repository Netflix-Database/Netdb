<?php
$from = "support@netdb.ga";
$to = $_GET["to"];
$subject = $_GET["subject"];
$message = $_GET["message"];
$headers = "From:" . $from;
mail($to,$subject,$message, $headers);
echo "Test email sent";
?>