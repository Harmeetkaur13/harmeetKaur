<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

include ("config.php");

header('Content-Type: application/json; charset=UTF-8');
/////////////to ensure it does not show chache data
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json; charset=UTF-8');
/////////////////

$executionStartTime = microtime(true);

// Retrieve and sanitize the locationId from the AJAX request
$deptId = isset($_POST['deptId']) ? intval($_POST['deptId']) : null;

if ($deptId === null) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "missing deptId";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Establish a database connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check database connection
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

// Check for dependencies in the department table
$query = 'SELECT
    d.name AS departmentName,
    COUNT(p.id) as personnelCount
 FROM
   department d LEFT JOIN 
   personnel p ON (p.departmentID = d.id)
 WHERE d.id = ?';

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $deptId);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stmt->close();

$output = [];
if ($row) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data'] = [$row];
} else {
    $output['status']['code'] = "404";
    $output['status']['name'] = "not found";
    $output['status']['description'] = "department not found";
    $output['data'] = [];
}

mysqli_close($conn);

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
echo json_encode($output);

?>