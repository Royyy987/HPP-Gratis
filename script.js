// Fungsi Format Rupiah
const formatRp = (num) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(num);
};

// Fungsi Tambah Baris
function tambahBarisAnimated() {
    const container = document.getElementById('ingredients-container');
    const div = document.createElement('div');
    div.className = 'ingredient-row item'; 
    // Struktur HTML baris baru harus SAMA PERSIS dengan di index.html
    div.innerHTML = `
        <div class="input-group">
            <input type="text" placeholder="Nama Bahan" class="input-name">
        </div>
        <div class="input-group">
            <input type="number" placeholder="Rp" class="input-buy-price" oninput="hitungOtomatis()">
        </div>
        <div class="combined-input">
            <input type="number" placeholder="0" class="input-buy-qty" oninput="hitungOtomatis()">
            <select class="select-buy-unit" onchange="hitungOtomatis()">
                <option value="1000">Kg</option>
                <option value="1">Gram</option>
                <option value="1000">Liter</option>
                <option value="1">ml</option>
                <option value="1">Pcs</option>
            </select>
        </div>
        <div class="combined-input">
            <input type="number" placeholder="0" class="input-use-qty" oninput="hitungOtomatis()">
            <select class="select-use-unit" onchange="hitungOtomatis()">
                <option value="1">Gram</option>
                <option value="1000">Kg</option>
                <option value="1">ml</option>
                <option value="1000">Liter</option>
                <option value="1">Pcs</option>
            </select>
        </div>
        <div class="input-group">
            <input type="text" value="Rp 0" class="input-row-total input-readonly" readonly tabindex="-1">
        </div>
        <button type="button" class="btn-del" onclick="hapusBarisAnimated(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hapusBarisAnimated(btn) {
    const items = document.getElementsByClassName('item');
    if (items.length > 1) {
        const row = btn.closest('.ingredient-row');
        row.classList.add('removing');
        setTimeout(() => { row.remove(); hitungOtomatis(); }, 300);
    } else {
        alert("Minimal sisakan satu bahan.");
    }
}

function animateValue(id, endValue) {
    const obj = document.getElementById(id);
    obj.innerText = formatRp(endValue);
}

// --- LOGIKA UTAMA (Sistem Konversi) ---
function hitungOtomatis() {
    let totalBahan = 0;
    const rows = document.getElementsByClassName('item');

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        const buyPrice = parseFloat(row.querySelector('.input-buy-price').value) || 0;
        const buyQtyInput = parseFloat(row.querySelector('.input-buy-qty').value) || 0;
        const buyUnitFactor = parseFloat(row.querySelector('.select-buy-unit').value) || 1; // Nilai 1000 untuk Kg, 1 untuk Gram
        
        const useQtyInput = parseFloat(row.querySelector('.input-use-qty').value) || 0;
        const useUnitFactor = parseFloat(row.querySelector('.select-use-unit').value) || 1;

        // 1. Hitung Total Qty Beli dalam satuan terkecil (Gram/ml)
        // Contoh: Beli 1 Kg = 1 * 1000 = 1000 gram
        const totalBuyInBaseUnit = buyQtyInput * buyUnitFactor;

        // 2. Hitung Total Qty Pakai dalam satuan terkecil
        // Contoh: Pakai 200 Gram = 200 * 1 = 200 gram
        const totalUseInBaseUnit = useQtyInput * useUnitFactor;

        let costPerItem = 0;

        // 3. Rumus Proporsi
        if (totalBuyInBaseUnit > 0) {
            costPerItem = (buyPrice / totalBuyInBaseUnit) * totalUseInBaseUnit;
        }

        row.querySelector('.input-row-total').value = formatRp(costPerItem);
        totalBahan += costPerItem;
    }

    const overhead = parseFloat(document.getElementById('overhead').value) || 0;
    const marginPercent = parseFloat(document.getElementById('margin').value) || 0;
    const jumlahPorsi = parseFloat(document.getElementById('porsi').value) || 1;

    const totalHpp = totalBahan + overhead;
    const hppPerPorsi = jumlahPorsi > 0 ? totalHpp / jumlahPorsi : 0;
    const profitAmount = hppPerPorsi * (marginPercent / 100);
    const hargaJual = hppPerPorsi + profitAmount;

    animateValue('total-hpp', totalHpp);
    animateValue('hpp-porsi', hppPerPorsi);
    animateValue('profit-value', profitAmount);
    animateValue('final-price', hargaJual);
}