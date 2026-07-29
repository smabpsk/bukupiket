// --- Komunikasi API ---
async function apiRequest(action, data = {}) {
    data.action = action;
    try {
        const response = await fetch('ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        return { status: 'error', message: 'Koneksi terputus ke server lokal.' };
    }
}

// --- Toggle & Inisialisasi ---
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.style.transform = sidebar.style.transform === 'translateX(0px)' ? 'translateX(-100%)' : 'translateX(0px)';
        });
    }

    const viewInput = document.getElementById('current-view');
    if (viewInput) {
        if (viewInput.value === 'dashboard') loadDashboard();
        else if (TABLE_CONFIG[viewInput.value]) loadTableData(viewInput.value);
    }
});

// --- KONFIGURASI TABEL ---
const TABLE_CONFIG = {
    'data_siswa': { sheet: 'datasiswa', title: 'Data Siswa', headers: ['NISN', 'Nama Siswa', 'Kelas', 'L/P'], cols: ['nisn', 'nama_siswa', 'kelas', 'jk'] },
    'kehadiran_siswa': { sheet: 'kehadiransiswa', title: 'Kehadiran Siswa', headers: ['Tanggal', 'Kelas', 'Nama Siswa', 'Kehadiran', 'Tindak Lanjut', 'Petugas Piket'], cols: ['tanggal', 'kelas', 'nama_siswa', 'kehadiran', 'tindak_lanjut', 'petugas_piket'] },
    'kehadiran_guru': { sheet: 'kehadiranguru', title: 'Kehadiran Guru', headers: ['Tanggal', 'Nama Guru', 'Alasan', 'Kelas / Jam Ke', 'Guru Pengganti', 'Petugas Piket'], cols: ['tanggal', 'nama_guru', 'alasan', 'kelasjamke', 'guru_pengganti', 'petugas_piket'] },
    'tamu': { sheet: 'tamu', title: 'Buku Tamu', headers: ['Tanggal', 'Nama Tamu', 'Alamat/Instansi', 'Maksud/Tujuan', 'Catatan', 'Petugas Piket', 'Foto'], cols: ['tanggal', 'nama_tamu', 'alamat_instansi', 'maksud_tujuan', 'catatan_kunjungan', 'petugas_piket', 'foto'] },
    'pelanggaran': { sheet: 'pelanggaransiswa', title: 'Pelanggaran Siswa', headers: ['Tanggal', 'Kelas', 'Nama Siswa', 'Pelanggaran', 'Kejadian', 'Tindak Lanjut', 'Petugas Piket', 'Foto'], cols: ['tanggal', 'kelas', 'nama_siswa', 'pelanggaran', 'kejadian', 'tindak_lanjut', 'petugas_piket', 'foto'] },
    'uks': { sheet: 'catatanuks', title: 'Catatan UKS', headers: ['Tanggal', 'Kelas', 'Nama Siswa', 'Kejadian', 'Tindak Lanjut', 'Petugas Piket', 'Foto'], cols: ['tanggal', 'pilih_kelas', 'nama_siswa', 'kejadian', 'tindak_lanjut', 'petugas_piket', 'foto'] },
    'pembiasaan': { sheet: 'pembiasaanpagi', title: 'Pembiasaan Pagi', headers: ['Tanggal', 'Pembiasaan', 'Guru Pendamping', 'Kegiatan', 'Petugas Piket', 'Foto'], cols: ['tanggal', 'pembiasaan', 'guru_pendamping', 'kegiatan', 'petugas_piket', 'foto'] },
    'users': { sheet: 'users', title: 'Manajemen User', headers: ['Username', 'Nama Lengkap', 'Role', 'Kelas Binaan'], cols: ['username', 'nama_lengkap', 'role', 'kelas_binaan'] },

    // DUA MENU INI YANG SEBELUMNYA TERTINGGAL:
    'informasi': { sheet: 'informasi', title: 'Informasi Piket', headers: ['Judul', 'Deskripsi'], cols: ['judul', 'deskripsi'] },
    'jadwal': { sheet: 'jadwal', title: 'Jadwal Piket', headers: ['Hari', 'Petugas Piket'], cols: ['hari', 'petugas'] }
};

window.RAW_DATA = [];
window.CURRENT_TABLE_DATA = [];

// --- FUNGSI READ API & FILTER (INSTAN) ---
async function loadTableData(viewId) {
    const conf = TABLE_CONFIG[viewId];
    if (!conf) return;

    const tbody = document.getElementById('table-body');
    const thead = document.getElementById('table-head');

    thead.innerHTML = `<tr><th style="width: 50px;">No</th>${conf.headers.map(h => `<th>${h}</th>`).join('')}<th style="width: 100px;">Aksi</th></tr>`;
    tbody.innerHTML = `<tr><td colspan="${conf.headers.length + 2}" class="text-center py-4"><div class="spinner-border text-primary spinner-border-sm me-2"></div> Menarik data dari Spreadsheet...</td></tr>`;

    // Dropdown Filter
    if (['data_siswa', 'kehadiran_siswa', 'pelanggaran', 'uks', 'kehadiran_guru', 'pembiasaan'].includes(viewId)) {
        const opts = await apiRequest('getDropdowns');
        const fKelas = document.getElementById('filter-kelas');
        const fGuru = document.getElementById('filter-guru');

        if (fKelas && opts.kelas) fKelas.innerHTML = '<option value="">Semua Kelas</option>' + opts.kelas.map(k => `<option value="${k}">${k}</option>`).join('');
        if (fGuru && opts.guru) fGuru.innerHTML = '<option value="">Semua Guru</option>' + opts.guru.map(g => `<option value="${g}">${g}</option>`).join('');

        // Kunci filter kelas untuk User Guru
        if (CURRENT_USER.role === 'Guru' && fKelas) {
            fKelas.value = CURRENT_USER.kelas_binaan;
            fKelas.disabled = true;
        }
    }

    const res = await apiRequest('getData', { sheetName: conf.sheet });

    if (res.status === 'success') {
        window.RAW_DATA = Array.isArray(res.data) ? res.data.reverse() : [];
        applyFilters(viewId);
    } else {
        tbody.innerHTML = `<tr><td colspan="${conf.headers.length + 2}" class="text-danger text-center">Gagal memuat data.</td></tr>`;
    }
}

// Logika Filter Instan & Syarat Khusus Menu Kehadiran Siswa
function applyFilters(viewId) {
    let data = [...window.RAW_DATA];

    const sSearch = document.getElementById('filter-search')?.value.toLowerCase() || '';
    const sKelas = document.getElementById('filter-kelas')?.value || '';
    const sGuru = document.getElementById('filter-guru')?.value || '';
    const sBulan = document.getElementById('filter-bulan')?.value || '';
    const sTahun = document.getElementById('filter-tahun')?.value || '';

    // KHUSUS MENU KEHADIRAN SISWA: Minta Filter Kelas Terlebih Dahulu
    if (viewId === 'kehadiran_siswa') {
        const kelasValue = CURRENT_USER.role === 'Guru' ? CURRENT_USER.kelas_binaan : sKelas;
        if (!kelasValue) {
            document.getElementById('table-body').innerHTML = `<tr><td colspan="${TABLE_CONFIG[viewId].headers.length + 2}" class="text-center text-primary fw-bold py-4"><i class="bi bi-info-circle me-2"></i>Silakan pilih Filter Kelas terlebih dahulu untuk menampilkan data siswa.</td></tr>`;
            return;
        }
    }

    // Otomatis Filter Kelas Binaan Khusus Guru (Keamanan Ganda)
    if (CURRENT_USER.role === 'Guru' && ['data_siswa', 'kehadiran_siswa', 'pelanggaran', 'uks'].includes(viewId)) {
        data = data.filter(row => row.kelas === CURRENT_USER.kelas_binaan || row.pilih_kelas === CURRENT_USER.kelas_binaan);
    }

    // Eksekusi Filter UI
    if (sSearch) data = data.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(sSearch)));
    if (sKelas) data = data.filter(row => row.kelas === sKelas || row.pilih_kelas === sKelas || row.kelasjamke === sKelas);
    if (sGuru) data = data.filter(row => row.nama_guru === sGuru || row.guru_pendamping === sGuru);
    if (sBulan) data = data.filter(row => row.tanggal && String(row.tanggal).includes(sBulan));
    if (sTahun) data = data.filter(row => row.tanggal && String(row.tanggal).includes(sTahun));

    window.CURRENT_TABLE_DATA = data;
    renderTable(viewId, data, TABLE_CONFIG[viewId]);
}

// Listener untuk eksekusi filter otomatis saat input berubah
document.addEventListener('input', (e) => {
    if (e.target.id && e.target.id.startsWith('filter-')) {
        const viewInput = document.getElementById('current-view');
        if (viewInput) applyFilters(viewInput.value);
    }
});

function renderTable(viewId, data, conf) {
    const tbody = document.getElementById('table-body');
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${conf.headers.length + 2}" class="text-center text-muted">Tidak ada data.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((row, idx) => `
        <tr>
            <td class="text-center">${idx + 1}</td>
            ${conf.cols.map(col => `
                <td class="wrap-text">
                    ${col === 'foto' && row[col] ? `<a href="${row[col]}" target="_blank" class="badge bg-primary text-decoration-none"><i class="bi bi-image"></i> Lihat</a>` :
            (col === 'password' ? '***' : (row[col] || '-'))}
                </td>
            `).join('')}
            <td>
                <div class="btn-group btn-group-sm">
                    ${CURRENT_USER.role === 'Admin' || (CURRENT_USER.role === 'Guru' && viewId !== 'data_siswa') ? `
                    <button class="btn btn-outline-warning" title="Edit" onclick="editData('${viewId}', '${row.id}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-outline-danger" title="Hapus" onclick="confirmDelete('${viewId}', '${row.id}', '${row.fileId || ''}')"><i class="bi bi-trash"></i></button>
                    ` : `<button class="btn btn-outline-secondary" disabled><i class="bi bi-lock"></i></button>`}
                </div>
            </td>
        </tr>
    `).join('');
}

// --- FUNGSI CREATE & UPDATE DENGAN CASCADING DROPDOWN ---
async function openFormModal(viewId, rowId = null) {
    const conf = TABLE_CONFIG[viewId];
    let data = {};
    if (rowId) data = window.CURRENT_TABLE_DATA.find(r => r.id == rowId) || {};

    let formHtml = `<div class="modal-header"><h5 class="modal-title">${rowId ? 'Edit' : 'Tambah'} ${conf.title}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
    <div class="modal-body"><form id="data-form" class="row g-3">
        <input type="hidden" name="id" value="${data.id || ''}">
        <input type="hidden" name="sheetName" value="${conf.sheet}">
        <input type="hidden" name="fileId" value="${data.fileId || ''}">`;

    const dOpts = await apiRequest('getDropdowns');
    const klsOpts = (dOpts.kelas || []).map(k => `<option value="${k}">${k}</option>`).join('');
    const petugasOpts = (dOpts.petugas || []).map(p => `<option value="${p}">${p}</option>`).join('');

    if (viewId === 'users') {
        formHtml += `
            <div class="col-md-6"><label class="form-label">Username</label><input type="text" class="form-control" name="username" value="${data.username || ''}" required></div>
            <div class="col-md-6"><label class="form-label">Password (Abaikan jika tidak diubah)</label><input type="password" class="form-control" name="password" value="${data.password || ''}"></div>
            <div class="col-md-12"><label class="form-label">Nama Lengkap</label><input type="text" class="form-control" name="nama_lengkap" value="${data.nama_lengkap || ''}" required></div>
            <div class="col-md-6"><label class="form-label">Role</label><select class="form-select" name="role"><option>Guru</option><option>Admin</option></select></div>
            <div class="col-md-6"><label class="form-label">Kelas Binaan</label><input type="text" class="form-control" name="kelas_binaan" value="${data.kelas_binaan || ''}"></div>`;
    } else {
        conf.cols.forEach(col => {
            if (col === 'tanggal') return;
            if (col === 'foto') {
                formHtml += `<div class="col-md-12"><label class="form-label text-capitalize">Upload Foto</label><input type="file" class="form-control" id="file-upload" accept="image/*"></div>`;
            } else if (col === 'kelas' || col === 'pilih_kelas') {
                formHtml += `<div class="col-md-6"><label class="form-label text-capitalize">${col.replace('_', ' ')}</label><select class="form-select form-select-kelas" name="${col}"><option value="">-- Pilih --</option>${klsOpts}</select></div>`;
            } else if (col === 'petugas_piket') {
                formHtml += `<div class="col-md-6"><label class="form-label text-capitalize">${col.replace('_', ' ')}</label><select class="form-select" name="${col}">${petugasOpts}</select></div>`;
            } else if (col === 'jk') {
                formHtml += `<div class="col-md-6"><label class="form-label text-capitalize">Jenis Kelamin</label><select class="form-select" name="${col}"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>`;
            } else if (col === 'nama_siswa') {
                // Jika Data Siswa (Master), input biasa. Jika form Laporan, Dropdown dinamis.
                if (viewId === 'data_siswa') {
                    formHtml += `<div class="col-md-12"><label class="form-label text-capitalize">Nama Siswa</label><input type="text" class="form-control" name="${col}" value="${data[col] || ''}" required></div>`;
                } else {
                    formHtml += `<div class="col-md-12"><label class="form-label text-capitalize">Nama Siswa</label><select class="form-select" name="${col}" id="form-nama-siswa" required><option value="">Pilih Kelas Dahulu</option></select></div>`;
                }
            } else {
                formHtml += `<div class="col-md-6"><label class="form-label text-capitalize">${col.replace('_', ' ')}</label><input type="text" class="form-control" name="${col}" value="${data[col] || ''}"></div>`;
            }
        });
    }

    formHtml += `</form></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button><button type="button" class="btn btn-primary" onclick="submitForm('${viewId}')" id="btn-save">Simpan</button></div>`;

    document.getElementById('modal-content-container').innerHTML = formHtml;
    const formEl = document.getElementById('data-form');

    // Mengisi Value Input / Select jika mode Edit
    if (rowId && viewId !== 'users') {
        conf.cols.forEach(col => {
            if (formEl[col] && formEl[col].tagName === 'SELECT' && col !== 'nama_siswa') formEl[col].value = data[col] || '';
        });
    }

    // LOGIKA CASCADING DROPDOWN (Kelas -> Nama Siswa)
    const kelasSelect = formEl.querySelector('.form-select-kelas');
    const siswaSelect = document.getElementById('form-nama-siswa');

    if (kelasSelect && siswaSelect && viewId !== 'data_siswa') {
        const fetchSiswa = async (kelasVal, selectedSiswa = '') => {
            siswaSelect.innerHTML = '<option value="">Memuat data...</option>';
            siswaSelect.disabled = true;
            const resSiswa = await apiRequest('getSiswa', { kelas: kelasVal });

            if (resSiswa.status === 'success') {
                siswaSelect.innerHTML = '<option value="">-- Pilih Siswa --</option>' + resSiswa.data.map(s => `<option value="${s}" ${s === selectedSiswa ? 'selected' : ''}>${s}</option>`).join('');
            } else {
                siswaSelect.innerHTML = '<option value="">Gagal memuat siswa</option>';
            }
            siswaSelect.disabled = false;
        };

        // Kunci Dropdown kelas jika user adalah Guru
        if (CURRENT_USER.role === 'Guru') {
            kelasSelect.value = CURRENT_USER.kelas_binaan;
            kelasSelect.style.pointerEvents = 'none';
            kelasSelect.classList.add('bg-light');
            fetchSiswa(CURRENT_USER.kelas_binaan, data.nama_siswa);
        } else {
            kelasSelect.addEventListener('change', (e) => {
                if (e.target.value) fetchSiswa(e.target.value);
                else siswaSelect.innerHTML = '<option value="">Pilih Kelas Dahulu</option>';
            });
            // Auto fetch jika mode edit (Admin)
            if (kelasSelect.value) fetchSiswa(kelasSelect.value, data.nama_siswa);
        }
    }

    new bootstrap.Modal(document.getElementById('dataModal')).show();
}

function editData(viewId, rowId) { openFormModal(viewId, rowId); }

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => resolve({ name: file.name, mimeType: file.type, data: reader.result.split(',')[1] });
    reader.onerror = error => reject(error);
});

async function submitForm(viewId) {
    const btn = document.getElementById('btn-save');
    const form = document.getElementById('data-form');
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Menyimpan...';
    btn.disabled = true;

    try {
        const payload = Object.fromEntries(new FormData(form).entries());
        let fileData = null;
        const fileInput = document.getElementById('file-upload');
        if (fileInput && fileInput.files[0]) fileData = await getBase64(fileInput.files[0]);

        const res = await apiRequest('saveData', { payload: payload, file: fileData });
        if (res.status === 'success') {
            Swal.fire('Berhasil!', res.message, 'success');
            bootstrap.Modal.getInstance(document.getElementById('dataModal')).hide();
            loadTableData(viewId);
        } else throw new Error(res.message);
    } catch (e) {
        Swal.fire('Gagal!', e.message, 'error');
    } finally {
        btn.innerHTML = 'Simpan'; btn.disabled = false;
    }
}

// --- FUNGSI DELETE ---
function confirmDelete(viewId, id, fileId) {
    Swal.fire({
        title: 'Hapus Data?', text: "Data yang dihapus tidak bisa dikembalikan!", icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#d33', cancelButtonText: 'Batal', confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: 'Menghapus...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const res = await apiRequest('deleteData', { sheetName: TABLE_CONFIG[viewId].sheet, id: id, fileId: fileId });
            if (res.status === 'success') {
                Swal.fire('Terhapus!', res.message, 'success');
                loadTableData(viewId);
            } else Swal.fire('Gagal!', res.message, 'error');
        }
    });
}

// --- FUNGSI CETAK PDF ---
function printData(viewId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    const conf = TABLE_CONFIG[viewId];
    const namaSekolah = SEKOLAH_INFO.nama_sekolah || 'Buku Piket Digital';

    const tableRows = document.querySelectorAll('#table-body tr');
    let bodyData = [];
    tableRows.forEach(tr => {
        let rowData = [];
        const tds = tr.querySelectorAll('td');
        tds.forEach((td, idx) => {
            if (idx < tds.length - 1) rowData.push(td.innerText);
        });
        if (rowData.length > 0 && !rowData[0].includes('Tidak ada data') && !rowData[0].includes('Menarik data')) {
            bodyData.push(rowData);
        }
    });

    if (bodyData.length === 0) {
        Swal.fire('Info', 'Tidak ada data untuk dicetak.', 'info'); return;
    }

    doc.autoTable({
        head: [['No', ...conf.headers]],
        body: bodyData,
        margin: { top: 30 },
        didDrawPage: function (data) {
            doc.setFontSize(14);
            doc.text(`Laporan ${conf.title} - ${namaSekolah}`, 14, 20);
        }
    });
    doc.save(`Laporan_${conf.title.replace(' ', '_')}.pdf`);
}

// --- Dashboard ---
async function loadDashboard() {
    const loader = document.getElementById('loader-dashboard');
    const container = document.getElementById('dashboard-cards');
    if (!loader || !container) return;
    loader.style.display = 'block'; container.style.display = 'none';

    const res = await apiRequest('getDashboard');
    loader.style.display = 'none';
    if (res.status === 'success') {
        const d = res.data;
        const cards = [
            { id: 'kehadiransiswa', title: 'Kehadiran Siswa', bg: 'primary', icon: 'person-check', count: d.kehadiransiswa || 0 },
            { id: 'kehadiranguru', title: 'Kehadiran Guru', bg: 'info', icon: 'person-video3', count: d.kehadiranguru || 0 },
            { id: 'tamu', title: 'Buku Tamu', bg: 'success', icon: 'people', count: d.tamu || 0 },
            { id: 'pelanggaransiswa', title: 'Pelanggaran', bg: 'danger', icon: 'exclamation-triangle', count: d.pelanggaransiswa || 0 },
            { id: 'catatanuks', title: 'Catatan UKS', bg: 'warning', icon: 'bandaid', count: d.catatanuks || 0 },
            { id: 'pembiasaanpagi', title: 'Pembiasaan', bg: 'secondary', icon: 'sunrise', count: d.pembiasaanpagi || 0 }
        ];
        container.innerHTML = cards.map(c => `
            <div class="col-xl-4 col-md-6">
                <div class="card text-white bg-${c.bg} shadow-sm border-0 h-100" style="transition: 0.3s;">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div><h2 class="display-5 fw-bold mb-0">${c.count}</h2><p class="mb-0">${c.title}</p></div>
                        <i class="bi bi-${c.icon}" style="font-size: 3rem; opacity: 0.5;"></i>
                    </div>
                </div>
            </div>
        `).join('');
        container.style.display = 'flex';
    } else Swal.fire('Gagal!', res.message, 'error');
}
