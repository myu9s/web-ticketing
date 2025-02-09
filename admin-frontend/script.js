async function fetchTickets() {
    try {
        const response = await fetch('/.netlify/functions/get-tickets');
        const tickets = await response.json();
        
        const ticketList = document.getElementById('ticket-list');
        ticketList.innerHTML = tickets.map(ticket => `
            <div class="ticket">
                <p>Kode: ${ticket.uniqueCode}</p>
                <p>Nama: ${ticket.formData.name}</p>
                <p>Status: ${ticket.status}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}

fetchTickets();