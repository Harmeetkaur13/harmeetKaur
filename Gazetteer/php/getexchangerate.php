<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['base']) && isset($_GET['target'])) {
        $apiKey = 'af7dd32b1b474dadbf3e55063a2fed53'; // Replace with your actual API key
        $baseCurrency = $_GET['base'];
        $targetCurrency = $_GET['target'];
        $url = "https://openexchangerates.org/api/latest.json?app_id=$apiKey";

        // Initialize cURL session
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            echo json_encode(['error' => curl_error($ch)]);
            curl_close($ch);
            exit;
        }
        curl_close($ch);

        // Decode the JSON response
        $decodedResult = json_decode($result, true);

        if (isset($decodedResult['rates'][$targetCurrency])) {
            $exchangeRate = $decodedResult['rates'][$targetCurrency];
            $response = [
                'base' => $baseCurrency,
                'target' => $targetCurrency,
                'rate' => $exchangeRate
            ];
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($response);
        } else {
            echo json_encode(['error' => 'Exchange rate not found']);
        }
    } else {
        echo json_encode(['error' => 'Missing base or target currency parameters']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>