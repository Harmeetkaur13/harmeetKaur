<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

include ("config.php");

header('Content-Type: application/json; charset=UTF-8');
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$executionStartTime = microtime(true);

$locId = isset($_POST['locId']) ? intval($_POST['locId']) : null;

if ($locId === null) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "missing locId";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

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

$query = 'SELECT
    l.name AS locationName,
    COUNT(d.id) AS departmentCount
FROM
    location l
LEFT JOIN 
    department d ON d.locationID = l.id
WHERE 
    l.id = ?
GROUP BY
    l.name';

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $locId);
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
    $output['status']['description'] = "location not found";
    $output['data'] = [];
}

mysqli_close($conn);

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
echo json_encode($output);

?>