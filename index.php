<?php
require_once 'config.php';

// Validasi Sesi
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}

$user = $_SESSION['user'];
$sekolahInfo = $_SESSION['sekolah'] ?? ['nama_sekolah' => 'SDN Kebon Pala 02 Pagi', 'logo_url' => ''];
$view = $_GET['v'] ?? 'dashboard';

// Daftar modul yang diizinkan
$allowed_views = ['dashboard', 'informasi', 'jadwal', 'kehadiran_siswa', 'kehadiran_guru', 'tamu', 'pelanggaran', 'uks', 'pembiasaan', 'users', 'pengaturan', 'data_siswa'];
if (!in_array($view, $allowed_views)) {
    $view = 'dashboard';
}
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?= APP_NAME ?> -
        <?= htmlspecialchars($sekolahInfo['nama_sekolah']) ?>
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="assets/style.css">
</head>

<body>

    <?php include 'views/sidebar.php'; ?>

    <div class="main-content" id="main-content">
        <?php include 'views/header.php'; ?>

        <main class="container-fluid pt-4">
            <?php
            if ($view === 'dashboard' || $view === 'pengaturan') {
                include "views/{$view}.php";
            } else {
                // Semua menu berupa tabel akan menggunakan file ini
                include "views/table_view.php";
            }
            ?>
        </main>

        <?php include 'views/footer.php'; ?>
    </div>

    <!-- Bagian Modal untuk Form Dinamis -->
    <div class="modal fade" id="dataModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content" id="modal-content-container">
                <!-- Form dirender via AJAX/JS di sini -->
            </div>
        </div>
    </div>

    <!-- Scripts Inti -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

    <!-- State Global untuk Javascript -->
    <script>
        const CURRENT_USER = <?= json_encode($user) ?>;
        const SEKOLAH_INFO = <?= json_encode($sekolahInfo) ?>;
    </script>
    <script src="assets/app.js?v=<?= time() ?>"></script>
</body>

</html>
