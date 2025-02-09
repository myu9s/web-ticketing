// Fungsi untuk mengecek token
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login.html';
      return false;
    }
    return token;
  }
  
  // Fungsi fetch tiket
  async function fetchTickets() {
    const token = checkAuth();
    if (!token) return;
  
    try {
      const response = await fetch('/.netlify/functions/get-tickets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Gagal mengambil tiket');
      }
  
      const tickets = await response.json();
      
      const ticketList = document.getElementById('ticket-list');
      ticketList.innerHTML = tickets.map(ticket => `
        <div class="ticket">
          <p>Kode: ${ticket.uniqueCode}</p>
          <p>Nama: ${ticket.formData.name}</p>
          <p>WA: ${ticket.formData.whatsapp}</p>
          <p>Jadwal: ${ticket.formData.performanceDate}</p>
          <p>Jumlah Tiket: ${ticket.formData.ticketCount}</p>
          <p>Status: ${ticket.status}</p>
          <button onclick="updateTicketStatus('${ticket._id}', 'active')">Aktifkan</button>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Fungsi update status tiket
  async function updateTicketStatus(ticketId, newStatus) {
    const token = checkAuth();
    if (!token) return;
  
    try {
      const response = await fetch('/.netlify/functions/update-ticket-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticketId, newStatus })
      });
  
      if (!response.ok) {
        throw new Error('Gagal update status');
      }
  
      // Refresh daftar tiket
      fetchTickets();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Panggil fetchTickets saat halaman dashboard dimuat
  document.addEventListener('DOMContentLoaded', fetchTickets);