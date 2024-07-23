<?php


ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include ("config.php");

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
$query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');

$query->bind_param("sssssi", $_POST['first'], $_POST['last'], $_POST['job'], $_POST['email'], $_POST['depID'], $_POST['id']);
// $query = 'UPDATE personnel SET firstName = ' . $_POST['first'] . ', lastName = ' . $_POST['last'] . ', email = ' . $_POST['email'] . ', jobTitle = ' . $_POST['job'] . ', departmentID = ' . $_POST['depID'] . ' WHERE id = ' . $_POST['id'];


$result = $query->execute();

if (!$result) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";


header('Content-Type: application/json; charset=UTF-8');

mysqli_close($conn);

echo json_encode($output);

?>