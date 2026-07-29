<?php
function callGASApi($action, $data = [])
{
    $data['action'] = $action;
    $payload = json_encode($data);

    // Konfigurasi Stream HTTP bawaan PHP (Lebih stabil untuk Google)
    $options = [
        'http' => [
            'header' => "Content-Type: application/json\r\n",
            'method' => 'POST',
            'content' => $payload,
            'ignore_errors' => true,      // Tetap tangkap pesan jika error
            'follow_location' => 1,       // Ikuti redirect Google otomatis
            'max_redirects' => 5
        ],
        'ssl' => [
            'verify_peer' => false,       // Bypass SSL untuk Localhost
            'verify_peer_name' => false
        ]
    ];

    $context = stream_context_create($options);

    // Eksekusi request tanpa menggunakan cURL
    $result = file_get_contents(GAS_API_URL, false, $context);

    if ($result === false) {
        return ['status' => 'error', 'message' => 'Gagal menghubungi server Google. Pastikan koneksi internet stabil.'];
    }

    $json_response = json_decode($result, true);

    // Debugging jika Google masih membalas dengan HTML
    if ($json_response === null) {
        die("<h3>Response API Bukan JSON. Berikut balasan dari Google:</h3><textarea style='width:100%; height:300px;'>" . htmlspecialchars($result) . "</textarea>");
    }

    return $json_response;
}
?>