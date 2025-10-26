document.addEventListener('DOMContentLoaded', function() {
            // Search functionality
            const searchInput = document.getElementById('searchInput');
            const tableRows = document.querySelectorAll('.courses-table tbody tr');
            
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                let visibleCount = 0;
                
                tableRows.forEach(row => {
                    const rowText = row.textContent.toLowerCase();
                    if (rowText.includes(searchTerm)) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                document.getElementById('showingCount').textContent = visibleCount;
            });
            
            // Status filter functionality
            const statusFilter = document.getElementById('statusFilter');
            
            statusFilter.addEventListener('change', function() {
                const filterValue = this.value.toLowerCase();
                let visibleCount = 0;
                
                tableRows.forEach(row => {
                    const statusCell = row.querySelector('.status-badge').textContent.toLowerCase();
                    if (filterValue === '' || statusCell.includes(filterValue)) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                document.getElementById('showingCount').textContent = visibleCount;
            });
            
            // Simple table sorting (for demonstration)
            const tableHeaders = document.querySelectorAll('.courses-table th');
            tableHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const columnIndex = this.cellIndex;
                    const table = this.closest('table');
                    const tbody = table.querySelector('tbody');
                    const rows = Array.from(tbody.querySelectorAll('tr'));
                    
                    // Toggle sorting direction
                    const isAscending = !this.classList.contains('asc');
                    tableHeaders.forEach(h => h.classList.remove('asc', 'desc'));
                    this.classList.add(isAscending ? 'asc' : 'desc');
                    
                    rows.sort((a, b) => {
                        const aText = a.cells[columnIndex].textContent.trim();
                        const bText = b.cells[columnIndex].textContent.trim();
                        
                        // Numeric sorting for fee and max students
                        if (columnIndex === 4 || columnIndex === 5) {
                            const aNum = parseFloat(aText.replace(/[^0-9.]/g, ''));
                            const bNum = parseFloat(bText.replace(/[^0-9.]/g, ''));
                            return isAscending ? aNum - bNum : bNum - aNum;
                        }
                        
                        // Date sorting for date created
                        if (columnIndex === 7 && aText !== 'N/A' && bText !== 'N/A') {
                            return isAscending 
                                ? new Date(aText) - new Date(bText)
                                : new Date(bText) - new Date(aText);
                        }
                        
                        // Default text sorting
                        return isAscending 
                            ? aText.localeCompare(bText)
                            : bText.localeCompare(aText);
                    });
                    
                    // Re-append sorted rows
                    rows.forEach(row => tbody.appendChild(row));
                });
            });
        });