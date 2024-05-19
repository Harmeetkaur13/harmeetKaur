<?php
// Read country borders GeoJSON file
$countryco = json_decode(file_get_contents(__DIR__ . '/../files/countries_coordinates.json'), true);

// Return country data as JSON
header('Content-Type: application/json');
echo json_encode($countryco);
// if (isset($_GET['country'])) {
//     $country = $_GET['country'];
//     if (array_key_exists($country, $countryco)) {
//         echo json_encode($countryco[$country]);
//     } else {
//         echo json_encode(["error" => "Country not found"]);
//     }
// } else {
//     echo json_encode(["error" => "No country specified"]);
// }
?>