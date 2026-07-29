<?php
require_once 'config.php';
require_once 'api_helper.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Sesi berakhir, silakan login ulang.']);
    exit;
}

// Ambil input JSON dari AJAX Frontend
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if (!$action) {
    echo json_encode(['status' => 'error', 'message' => 'Action kosong.']);
    exit;
}

// Teruskan request ke Google Apps Script API
$response = callGASApi($action, $input);
echo json_encode($response);
?>