<?php
// Read country borders GeoJSON file
$countryData['data'] = json_decode(file_get_contents(__DIR__ . '/../files/countryBorders.geo.json'), true);

// Return country data as JSON
header('Content-Type: application/json');
echo json_encode($countryData);
?>