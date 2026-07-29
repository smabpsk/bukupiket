<div class="container-fluid">
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0 text-capitalize text-primary" id="table-title">
                <i class="bi bi-table me-2"></i><?= str_replace('_', ' ', $view) ?>
            </h5>
            <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" onclick="loadTableData('<?= $view ?>')"><i
                        class="bi bi-arrow-clockwise"></i> Refresh</button>
                <?php if ($user['role'] === 'Admin' || $view !== 'users'): ?>
                    <button class="btn btn-primary" onclick="openFormModal('<?= $view ?>')"><i
                            class="bi bi-plus-circle"></i> Tambah</button>
                <?php endif; ?>
                <button class="btn btn-danger" onclick="printData('<?= $view ?>')"><i class="bi bi-printer"></i> Cetak
                    PDF</button>
            </div>
        </div>
        <div class="card-body">
            <!-- Filter Dinamis -->
            <div id="filter-container" class="row g-2 mb-3 bg-light p-2 rounded">
                <div class="col-md-3">
                    <input type="text" id="filter-search" class="form-control form-control-sm"
                        placeholder="Cari bebas di seluruh kolom...">
                </div>
                <?php if ($view !== 'users' && $view !== 'informasi' && $view !== 'jadwal'): ?>
                    <div class="col-md-2">
                        <select id="filter-kelas" class="form-select form-select-sm">
                            <option value="">Semua Kelas</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <select id="filter-guru" class="form-select form-select-sm">
                            <option value="">Semua Guru</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <select id="filter-bulan" class="form-select form-select-sm">
                            <option value="">Semua Bulan</option>
                            <option value="Januari">Januari</option>
                            <option value="Februari">Februari</option>
                            <option value="Maret">Maret</option>
                            <option value="April">April</option>
                            <option value="Mei">Mei</option>
                            <option value="Juni">Juni</option>
                            <option value="Juli">Juli</option>
                            <option value="Agustus">Agustus</option>
                            <option value="September">September</option>
                            <option value="Oktober">Oktober</option>
                            <option value="November">November</option>
                            <option value="Desember">Desember</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <select id="filter-tahun" class="form-select form-select-sm">
                            <option value="">Semua Tahun</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Tabel Data -->
            <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">
                    <thead class="table-light" id="table-head">
                        <tr>
                            <th>Memuat header...</th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        <tr>
                            <td class="text-center py-4">
                                <div class="spinner-border text-primary spinner-border-sm me-2"></div>
                                Mengambil data dari Database...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<input type="hidden" id="current-view" value="<?= $view ?>">
