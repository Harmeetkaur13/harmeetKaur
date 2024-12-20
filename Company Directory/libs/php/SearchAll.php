<?php

// example use from browser
// http://localhost/companydirectory/libs/php/searchAll.php?txt=<txt>

// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include ("config.php");

header('Content-Type: application/json; charset=UTF-8');
/////////////to ensure it does not show chache data
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json; charset=UTF-8');
/////////////////

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

	$output['status']['code'] = "300";
	$output['status']['name'] = "failure";
	$output['status']['description'] = "database unavailable";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;

}

// first query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
// $_REQUEST used for development / debugging. Remember to change to $_POST for production

$query = $conn->prepare('SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, `d`.`id` as `departmentID`, `d`.`name` AS `department`, `l`.`id` as `locationID`, `l`.`name` AS `location` FROM `personnel` `p` LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`) WHERE `p`.`firstName` LIKE ? OR `p`.`lastName` LIKE ? OR `p`.`email` LIKE ? OR `p`.`jobTitle` LIKE ? OR `d`.`name` LIKE ? OR `l`.`name` LIKE ? ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`');

$likeText = "%" . $_REQUEST['txt'] . "%";

$query->bind_param("ssssss", $likeText, $likeText, $likeText, $likeText, $likeText, $likeText);

$query->execute();

if (false === $query) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;

}

$result = $query->get_result();

$found = [];

while ($row = mysqli_fetch_assoc($result)) {

	array_push($found, $row);

}
if (count($found) === 0) {
	$output['status']['code'] = "404";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "No Match Found!!";
	$output['data'] = [];
} else {
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['data'] = $found;
}


$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";


mysqli_close($conn);
echo json_encode($output);

?>