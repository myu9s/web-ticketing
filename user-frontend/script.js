document.getElementById('ticketForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/tickets/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        // Redirect to WhatsApp with form data
        const waMessage = `Halo, saya ingin mendaftar tiket pertunjukan Arah Menuju Temaram. 
Nama: ${data.name}
WhatsApp: ${data.whatsapp}
Jumlah Tiket: ${data.ticketCount}`;

        window.location.href = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;
    } catch (error) {
        console.error('Error:', error);
    }
});