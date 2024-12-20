<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getAllDepartments.php

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

// SQL does not accept parameters and so is not prepared

// $query = 'SELECT id, name, locationID FROM department';
$query = 'SELECT department.id, department.name , department.locationID,location.name AS locationName
FROM department
JOIN location ON department.locationID = location.id
ORDER BY department.name';

$result = $conn->query($query);

if (!$result) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;

}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {

	array_push($data, $row);

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output);

?>