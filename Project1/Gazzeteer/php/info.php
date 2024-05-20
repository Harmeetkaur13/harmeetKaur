<?php
header('Content-Type: application/json');

if (isset($_GET['countryCode'])) {
    $countryCode = $_GET['countryCode'];
    $username = 'harmeetkaur'; // Replace with your GeoNames username
    $url = "http://api.geonames.org/countryInfoJSON?formatted=true&country=$countryCode&username=$username&style=full";

    // Use file_get_contents to fetch the data from the API
    $response = file_get_contents($url);

    if ($response === FALSE) {
        // Handle error
        echo json_encode([
            'status' => 'error',
            'message' => 'Unable to fetch data from GeoNames API'
        ]);
    } else {
        // Output the fetched data
        echo $response;
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing countryCode parameter'
    ]);
}
?>