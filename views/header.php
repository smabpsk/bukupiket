<header class="top-header d-flex align-items-center justify-content-between px-3"
    style="height: 60px; background: #fff; border-bottom: 1px solid #dee2e6; position: sticky; top: 0; z-index: 1000;">
    <div class="d-flex align-items-center gap-3">
        <button class="btn btn-light d-lg-none" id="sidebar-toggle"><i class="bi bi-list"></i></button>
        <h5 class="mb-0 d-none d-md-block text-capitalize">
            <?= str_replace('_', ' ', $view) ?>
        </h5>
    </div>
    <div class="d-flex align-items-center gap-2">
        <span class="badge bg-light text-dark border p-2">
            <i class="bi bi-person-circle text-primary me-1"></i>
            <?= htmlspecialchars($user['nama_lengkap']) ?>
        </span>
        <a href="logout.php" class="btn btn-sm btn-outline-danger"><i class="bi bi-box-arrow-right"></i> Keluar</a>
    </div>
</header>
