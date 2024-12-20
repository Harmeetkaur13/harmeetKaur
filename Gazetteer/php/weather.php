<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['city'])) {
        $city = $_POST['city'];
        ini_set('display_errors', 'On');
        error_reporting(E_ALL);
        $executionStartTime = microtime(true);
        $url = 'http://api.weatherapi.com/v1/forecast.json?key=5a591c8bad8140c8b68163507243105&q=' . $city . '&days=4&aqi=no&alerts=no';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);

        $result = curl_exec($ch);

        curl_close($ch);

        $decode = json_decode($result, true);

        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = $decode;

        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode($output);

    } else {
        echo "City is not set.";
    }
} else {
    echo "Invalid request method.";
}
?>