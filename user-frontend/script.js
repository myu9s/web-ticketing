document.getElementById('ticketForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/.netlify/functions/register-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        const waMessage = `Halo, saya ingin mendaftar tiket "Arah Menuju Temaram":
Nama: ${data.name}
WA: ${data.whatsapp}
Jadwal: ${data.performanceDate}
Jumlah Tiket: ${data.ticketCount}
Kode Tiket: ${result.ticketId}`;

        window.location.href = `https://wa.me/6282119380588?text=${encodeURIComponent(waMessage)}`;
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal mendaftar tiket');
    }
});