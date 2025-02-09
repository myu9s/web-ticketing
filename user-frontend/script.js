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
        
        const waMessage = `Halo, saya ingin mendaftar tiket. 
Kode Tiket: ${result.ticketId}
Nama: ${data.name}`;

        window.location.href = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;
    } catch (error) {
        console.error('Error:', error);
    }
});