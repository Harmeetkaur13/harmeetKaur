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
$locationId = isset($_POST['locationId']) ? intval($_POST['locationId']) : null;

if ($locationId === null) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "missing locationId";
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
$query = 'SELECT COUNT(*) AS count FROM department WHERE locationID = ?';
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $locationId);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stmt->close();

if ($row['count'] > 0) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "dependency";
    $output['status']['description'] = "cannot delete location with dependencies";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);
    exit;
}

// No dependencies found, proceed with deletion
$query = 'DELETE FROM location WHERE id = ?';
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $locationId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data'] = [];
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "no rows affected";
    $output['data'] = [];
}

$stmt->close();
mysqli_close($conn);

echo json_encode($output);

?>