<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4>Ringkasan Data</h4>
        <button class="btn btn-sm btn-outline-primary" onclick="loadDashboard()"><i class="bi bi-arrow-clockwise"></i>
            Segarkan</button>
    </div>

    <div id="loader-dashboard" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2">Mengambil data dari server...</p>
    </div>

    <div class="row g-4" id="dashboard-cards" style="display: none;">
        <!-- Card akan di-render oleh app.js -->
    </div>
</div>
