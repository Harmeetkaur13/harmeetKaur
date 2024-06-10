<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['countrycode'])) {
        $countryCode = $_GET['countrycode']; // Correctly get the country code from the GET parameter

        // Your GeoNames username
        $username = 'harmeetkaur';

        // Construct the API URL
        $apiUrl = "http://api.geonames.org/searchJSON?formatted=true&country=$countryCode&featureClass=P&maxRows=10&username=$username";

        // Initialize cURL session
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $apiUrl);

        // Execute cURL request
        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            echo json_encode(['error' => curl_error($ch)]);
            curl_close($ch);
            exit;
        }
        curl_close($ch);

        // Decode the JSON response
        $decodedResult = json_decode($result, true);

        // Output the airport data
        header('Content-Type: application/json');
        echo json_encode($decodedResult);
    } else {
        echo json_encode(['error' => 'Missing countrycode parameter']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>