<div class="container-fluid">
    <div class="card shadow-sm border-0 mx-auto mt-4" style="max-width: 500px;">
        <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0 text-primary"><i class="bi bi-gear me-2"></i>Pengaturan Sekolah</h5>
        </div>
        <div class="card-body">
            <form id="form-pengaturan">
                <div class="mb-4 text-center">
                    <img src="<?= function_exists('formatLogoUrl') ? formatLogoUrl($sekolahInfo['logo_url']) : 'https://via.placeholder.com/100' ?>"
                        alt="Logo Preview" class="img-thumbnail mb-2"
                        style="width: 120px; height: 120px; object-fit: contain;" id="preview-logo">
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Nama Sekolah</label>
                    <input type="text" class="form-control" name="namaSekolah"
                        value="<?= htmlspecialchars($sekolahInfo['nama_sekolah']) ?>" required>
                </div>
                <div class="mb-4">
                    <label class="form-label fw-bold">URL Tautan Logo (Opsional)</label>
                    <!-- Input dirubah menjadi URL / Text -->
                    <input type="text" class="form-control" name="logoSekolah" id="logo-url"
                        value="<?= htmlspecialchars($sekolahInfo['logo_url']) ?>"
                        placeholder="https://contoh.com/logo.png">
                    <small class="text-muted">Tempelkan link langsung dari gambar logo, atau link Google Drive.</small>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2" id="btn-save-pengaturan">Simpan
                    Perubahan</button>
            </form>
        </div>
    </div>
</div>

<script>
    // Live preview jika user mengetik link baru
    document.getElementById('logo-url').addEventListener('input', function (e) {
        let url = this.value;
        if (url.includes('drive.google.com/file/d/')) {
            const match = url.match(/d\/([a-zA-Z0-9_-]+)/);
            if (match) url = 'https://drive.google.com/uc?export=view&id=' + match[1];
        }
        document.getElementById('preview-logo').src = url || 'https://via.placeholder.com/100';
    });

    document.getElementById('form-pengaturan').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-save-pengaturan');
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Menyimpan...';
        btn.disabled = true;

        try {
            const nama = e.target.namaSekolah.value;
            const logoUrl = document.getElementById('logo-url').value;

            // Kirim logoUrl langsung sebagai string
            const res = await apiRequest('updateSettings', {
                namaSekolah: nama,
                logoUrl: logoUrl
            });

            if (res.status === 'success') {
                Swal.fire({
                    icon: 'success', title: 'Berhasil!',
                    text: 'Pengaturan sekolah telah diperbarui. Sistem akan mengeluarkan Anda untuk memperbarui data tampilan.',
                    confirmButtonText: 'Oke, Login Ulang'
                }).then(() => {
                    window.location.href = 'logout.php';
                });
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            Swal.fire('Gagal!', error.message, 'error');
            btn.innerHTML = 'Simpan Perubahan'; btn.disabled = false;
        }
    });
</script>
