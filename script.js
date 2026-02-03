const formatRp = (num) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
    }).format(num);
};

function tambahBaris() {
    const container = document.getElementById('ingredients-container');
    const firstRow = document.querySelector('.ingredient-row').cloneNode(true);
    // Reset nilai input di baris baru
    firstRow.querySelectorAll('input').forEach(input => input.value = '');
    firstRow.querySelector('.input-row-total').value = 'Rp 0';
    container.appendChild(firstRow);
}

function hapusBaris(btn) {
    if (document.querySelectorAll('.item').length > 1) {
        btn.closest('.ingredient-row').remove();
        hitungOtomatis();
    }
}

function hitungOtomatis() {
    let totalBiayaBahan = 0;
    const rows = document.querySelectorAll('.item');

    rows.forEach(row => {
        const price = parseFloat(row.querySelector('.input-buy-price').value) || 0;
        const bQty = parseFloat(row.querySelector('.input-buy-qty').value) || 0;
        const bUnit = parseFloat(row.querySelector('.select-buy-unit').value) || 1;
        const uQty = parseFloat(row.querySelector('.input-use-qty').value) || 0;
        const uUnit = parseFloat(row.querySelector('.select-use-unit').value) || 1;

        const totalBeliBase = bQty * bUnit;
        const totalPakaiBase = uQty * uUnit;

        let biaya = totalBeliBase > 0 ? (price / totalBeliBase) * totalPakaiBase : 0;
        row.querySelector('.input-row-total').value = formatRp(biaya);
        totalBiayaBahan += biaya;
    });

    const overhead = parseFloat(document.getElementById('overhead').value) || 0;
    const labor = parseFloat(document.getElementById('labor').value) || 0;
    const marginPercent = parseFloat(document.getElementById('margin').value) || 0;
    const porsi = parseFloat(document.getElementById('porsi').value) || 1;

    // 1. Hitung Total Modal
    const totalModal = totalBiayaBahan + overhead + labor;
    const modalPerPorsi = totalModal / porsi;

    // 2. Hitung Harga Jual Raw (Rumus Margin: HPP / (1 - Margin%))
    const marginDecimal = marginPercent / 100;
    let hargaJualRaw = marginDecimal < 1 ? modalPerPorsi / (1 - marginDecimal) : modalPerPorsi;

    // 3. PEMBULATAN CERDAS (Rounding to nearest 500 or 1000)
    // Jika harga di bawah 10rb, bulatkan ke 500 terdekat. Di atas itu, ke 1000 terdekat.
    let pembulatan = hargaJualRaw < 10000 ? 500 : 1000;
    let hargaJualFinal = Math.ceil(hargaJualRaw / pembulatan) * pembulatan;

    // 4. Update UI
    document.getElementById('hpp-porsi').innerText = formatRp(modalPerPorsi);
    document.getElementById('final-price').innerText = formatRp(hargaJualFinal);
    document.getElementById('profit-value').innerText = formatRp(hargaJualFinal - modalPerPorsi);
}
