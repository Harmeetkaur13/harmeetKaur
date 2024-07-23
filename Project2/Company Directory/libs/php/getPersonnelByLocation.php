<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include ("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Retrieve and sanitize locationId from the query string or AJAX request
$locationId = isset($_GET['locationId']) ? intval($_GET['locationId']) : null;

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

// Prepare SQL query with filtering by locationId
$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name AS department, l.name AS location
          FROM personnel p
          LEFT JOIN department d ON d.id = p.departmentID
          LEFT JOIN location l ON l.id = d.locationID
          WHERE l.id = ?
          ORDER BY p.lastName, p.firstName, d.name, l.name';

if ($stmt = $conn->prepare($query)) {
    // Bind the locationId parameter
    $stmt->bind_param("i", $locationId);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "query preparation failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Check if the query execution was successful
if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Fetch the results
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output);

?>