<?php
// fetch_news.php

$apiKey = 'ce073b145b0543bb8b3c86bf2a15148b';
$url = "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=$apiKey";

// User-Agent string to identify your application
$userAgent = 'Gazetteer/1.0'; // Replace with your project name and version

// Use cURL to fetch data from the News API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "User-Agent: $userAgent"
]);
$response = curl_exec($ch);
curl_close($ch);

// Output the response
header('Content-Type: application/json');
echo $response;
?>