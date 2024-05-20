<?php
header('Content-Type: application/json');

// if (isset($_REQUEST['countryCode'])) {
//     $countryCode = $_REQUEST['countryCode'];
$countryCode = 'IN';
$file = fopen('Gazzeteer\files\airports.dat', "r");

$airports = [];

while (($line = fgetcsv($file)) !== FALSE) {
    // CSV columns: Airport ID, Name, City, Country, IATA, ICAO, Latitude, Longitude, Altitude, Timezone, DST, Tz database time zone, Type, Source
    list($id, $name, $city, $country, $iata, $icao, $latitude, $longitude, $altitude, $timezone, $dst, $tz, $type, $source) = $line;

    if ($country === $countryCode) {
        $airports[] = [
            'name' => $name,
            'city' => $city,
            'latitude' => $latitude,
            'longitude' => $longitude
        ];
    }
}

fclose($file);

echo json_encode($airports);
// } else {
//     echo json_encode([
//         'status' => 'error',
//         'message' => 'Missing countryCode parameter'
//     ]);
// }
?>