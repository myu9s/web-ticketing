// Fungsi untuk mengecek token
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = 'index.html';
      return false;
    }
    return token;
  }
  
  // Fungsi fetch tiket dengan filter
  async function fetchTickets() {
    const token = checkAuth();
    if (!token) return;
  
    // Ambil filter
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
  
    // Bangun query string
    const queryParams = new URLSearchParams();
    if (statusFilter) queryParams.append('status', statusFilter);
    if (dateFilter) queryParams.append('performanceDate', dateFilter);
  
    try {
      const response = await fetch(`/.netlify/functions/get-tickets?${queryParams}`, {
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
        <div class="ticket ${ticket.status}">
          <div class="ticket-header">
            <span class="ticket-code">${ticket.uniqueCode}</span>
            <span class="ticket-status">${ticket.status}</span>
          </div>
          <div class="ticket-body">
            <p><strong>Nama:</strong> ${ticket.formData.name}</p>
            <p><strong>WA:</strong> ${ticket.formData.whatsapp}</p>
            <p><strong>Jadwal:</strong> ${ticket.formData.performanceDate}</p>
            <p><strong>Jumlah Tiket:</strong> ${ticket.formData.ticketCount}</p>
          </div>
          <div class="ticket-actions">
            <button onclick="updateTicketStatus('${ticket._id}', 'active')" 
                    ${ticket.status === 'active' ? 'disabled' : ''}>
              Aktifkan
            </button>
            <button onclick="updateTicketStatus('${ticket._id}', 'non-active')" 
                    ${ticket.status === 'non-active' ? 'disabled' : ''}>
              Non-aktifkan
            </button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat tiket');
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
      alert('Gagal mengupdate status tiket');
    }
  }
  
  // Event listener untuk filter
  document.getElementById('status-filter').addEventListener('change', fetchTickets);
  document.getElementById('date-filter').addEventListener('change', fetchTickets);
  
  // Panggil fetchTickets saat halaman dimuat
  document.addEventListener('DOMContentLoaded', fetchTickets);