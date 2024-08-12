<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $apiKey = 'af7dd32b1b474dadbf3e55063a2fed53';
    $url = 'https://openexchangerates.org/api/currencies.json?app_id=' . $apiKey;

    // Initialize cURL session
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }

    curl_close($ch);

    // Output the response
    header('Content-Type: application/json; charset=UTF-8');
    echo $result;
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>