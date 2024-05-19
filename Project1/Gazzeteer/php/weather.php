<?php

// remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);
const apiKey = '5f3d65b1608a791d1d7629b27ff497fb';
$executionStartTime = microtime(true);
echo ($_REQUEST['country']);
$url = 'https://api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST['country'] . '&appid=${apiKey}';

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

?>



// Extract relevant weather information
<!-- const temperature = data.main.temp;
const weatherDescription = data.weather[0].description; -->

// Display the weather information on your website
<!-- document.getElementById('temperature').textContent = temperature;
document.getElementById('weatherDescription').textContent = weatherDescription;
})
.catch(error => {
// Handle errors
console.error('Error fetching weather data:', error);
});
} -->

// Example usage: Fetch weather data for a city
fetchWeather('London');