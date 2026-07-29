<?php
require_once 'config.php';
require_once 'api_helper.php';

if (isset($_SESSION['user'])) {
    header("Location: index.php");
    exit;
}

$error_msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $response = callGASApi('login', ['username' => $username, 'password' => $password]);

    if (isset($response['status']) && $response['status'] === 'success') {
        $_SESSION['user'] = $response['user'];
        $settings = callGASApi('getSettings');
        $_SESSION['sekolah'] = $settings['data'] ?? ['nama_sekolah' => 'SDN Kebon Pala 02 Pagi', 'logo_url' => ''];
        header("Location: index.php");
        exit;
    } else {
        $error_msg = $response['message'] ?? 'Gagal menghubungi server.';
    }
}

if (!isset($_SESSION['sekolah_login_cache'])) {
    $settings = callGASApi('getSettings');
    $_SESSION['sekolah_login_cache'] = $settings['data'] ?? ['nama_sekolah' => 'SDN Kebon Pala 02 Pagi', 'logo_url' => ''];
}
$sekolahInfo = $_SESSION['sekolah_login_cache'];

function formatLogoUrl($url)
{
    if (empty($url))
        return 'https://via.placeholder.com/100';
    if (preg_match('/id=([a-zA-Z0-9_-]+)/', $url, $m) || preg_match('/d\/([a-zA-Z0-9_-]+)/', $url, $m)) {
        return 'https://drive.google.com/uc?export=view&id=' . $m[1];
    }
    return htmlspecialchars($url);
}
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?= APP_NAME ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        .login-card {
            width: 100%;
            max-width: 400px;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
            background: white;
            text-align: center;
        }

        .login-logo {
            max-width: 100px;
            margin-bottom: 1rem;
            object-fit: contain;
        }
    </style>
</head>

<body>
    <div class="login-card">
        <img src="<?= formatLogoUrl($sekolahInfo['logo_url']) ?>" class="login-logo" alt="Logo Sekolah">
        <h4 class="mb-1"><?= htmlspecialchars($sekolahInfo['nama_sekolah']) ?></h4>
        <p class="text-muted mb-4">Sistem Informasi & Buku Piket Digital</p>

        <?php if ($error_msg): ?>
            <div class="alert alert-danger text-start py-2"><?= htmlspecialchars($error_msg) ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="mb-3 text-start">
                <label class="form-label">Username / NIP</label>
                <input type="text" class="form-control" name="username" required>
            </div>
            <div class="mb-3 text-start">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Masuk</button>
        </form>
    </div>
</body>

</html>