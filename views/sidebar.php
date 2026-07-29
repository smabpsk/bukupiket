<?php
$role = $user['role'];
$menus = [
    'dashboard' => ['icon' => 'grid-1x2-fill', 'title' => 'Dashboard', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'informasi' => ['icon' => 'info-circle', 'title' => 'Informasi Piket', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'jadwal' => ['icon' => 'calendar-week', 'title' => 'Jadwal Piket', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'data_siswa' => ['icon' => 'people-fill', 'title' => 'Data Siswa', 'roles' => ['Admin']], // Menu Baru Admin
    'kehadiran_siswa' => ['icon' => 'person-check', 'title' => 'Kehadiran Siswa', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'kehadiran_guru' => ['icon' => 'person-video3', 'title' => 'Kehadiran Guru', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'tamu' => ['icon' => 'people', 'title' => 'Tamu', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'pelanggaran' => ['icon' => 'exclamation-triangle', 'title' => 'Pelanggaran Siswa', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'uks' => ['icon' => 'bandaid', 'title' => 'Catatan UKS', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'pembiasaan' => ['icon' => 'sunrise', 'title' => 'Pembiasaan Pagi', 'roles' => ['Admin', 'Guru', 'Guru Mapel']],
    'users' => ['icon' => 'person-badge', 'title' => 'Manajemen User', 'roles' => ['Admin']],
    'pengaturan' => ['icon' => 'gear', 'title' => 'Pengaturan Sekolah', 'roles' => ['Admin']]
];

function formatLogoUrl($url)
{
    if (empty($url))
        return 'https://via.placeholder.com/80';
    if (preg_match('/id=([a-zA-Z0-9_-]+)/', $url, $m) || preg_match('/d\/([a-zA-Z0-9_-]+)/', $url, $m)) {
        return 'https://drive.google.com/uc?export=view&id=' . $m[1];
    }
    return htmlspecialchars($url);
}
?>
<div class="sidebar bg-dark text-light d-flex flex-column" id="sidebar"
    style="position: fixed; top: 0; left: 0; width: 250px; height: 100vh; overflow-y: auto; transition: 0.3s; z-index: 1020;">
    <div class="text-center p-3 border-bottom border-secondary">
        <!-- Dihapus class rounded-circle -->
        <img src="<?= formatLogoUrl($sekolahInfo['logo_url']) ?>" alt="Logo" class="img-fluid mb-2"
            style="width: 70px; height: 70px; object-fit: contain; background: transparent;">
        <h6 class="mb-0 fw-bold"><?= APP_NAME ?></h6>
        <small class="text-light opacity-75"><?= htmlspecialchars($sekolahInfo['nama_sekolah']) ?></small>
        <div class="mt-2"><span class="badge bg-primary"><?= htmlspecialchars($role) ?></span></div>
    </div>

    <!-- Menu Utama -->
    <ul class="nav flex-column py-2 flex-grow-1">
        <?php foreach ($menus as $key => $m): ?>
            <?php if (in_array($role, $m['roles'])): ?>
                <li class="nav-item">
                    <a class="nav-link text-light <?= $view === $key ? 'bg-primary fw-bold' : '' ?>" href="?v=<?= $key ?>"
                        style="padding: 12px 20px;">
                        <i class="bi bi-<?= $m['icon'] ?> me-2"></i> <?= $m['title'] ?>
                    </a>
                </li>
            <?php endif; ?>
        <?php endforeach; ?>
    </ul>

    <!-- Menu Logout di paling bawah -->
    <ul class="nav flex-column mt-auto mb-3">
        <li class="nav-item">
            <a class="nav-link text-danger" href="logout.php"
                style="padding: 12px 20px; border-top: 1px solid #495057;">
                <i class="bi bi-box-arrow-left me-2"></i> Keluar
            </a>
        </li>
    </ul>
</div>
