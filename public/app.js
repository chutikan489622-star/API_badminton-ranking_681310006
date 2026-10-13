let currentSort = "wins";
let sortDirection = "desc";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".sort-button").forEach(button => {
        button.addEventListener("click", () => sortRankings(button.dataset.sort));
    });
    fetchRankings();
});

// ฟังก์ชันดึงข้อมูลจัดอันดับเริ่มต้น
async function fetchRankings(sortBy = currentSort, direction = sortDirection) {
    currentSort = sortBy;
    sortDirection = direction;
    updateSortIndicators();

    try {
        const response = await fetch(`/api/rankings?sort=${encodeURIComponent(sortBy)}&order=${direction}`);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function sortRankings(sortBy) {
    const direction = currentSort === sortBy && sortDirection === "desc" ? "asc" : "desc";
    fetchRankings(sortBy, direction);
}

function updateSortIndicators() {
    const activeButton = document.querySelector(`.sort-button[data-sort="${currentSort}"]`);
    const directionLabel = sortDirection === "asc" ? "ต่ำไปสูง" : "สูงไปต่ำ";
    document.getElementById("sortStatus").textContent =
        `กำลังเรียงตาม ${activeButton.dataset.label}: ${directionLabel}`;

    document.querySelectorAll(".sort-button").forEach(button => {
        const field = button.dataset.sort;
        const isActive = field === currentSort;
        const arrow = sortDirection === "asc" ? " ▲" : " ▼";
        button.textContent = button.dataset.label + (isActive ? arrow : "");
        button.closest("th").setAttribute("aria-sort", isActive
            ? (sortDirection === "asc" ? "ascending" : "descending")
            : "none");
    });
}

// ฟังก์ชันค้นหาประเทศ
async function searchCountry() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) {
        fetchRankings();
        return;
    }

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error("Error searching:", error);
    }
}

// ฟังก์ชันวาดตาราง HTML
function renderTable(data) {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>ไม่พบข้อมูล</td></tr>";
        return;
    }

    data.forEach((team, index) => {
        // ตกแต่งตัวอักษร W, L ให้เป็นป้ายสี
        const formHtml = team.form.split('-').map(res => 
            `<span class="form-badge form-${res}">${res}</span>`
        ).join(' ');

        const row = `
            <tr>
                <td><span class="rank-badge">#${index + 1}</span></td>
                <td style="font-size: 18px;">${team.flag} <strong>${team.country}</strong></td>
                <td>${team.matches}</td>
                <td>${team.wins}</td>
                <td class="win-rate">${team.winRate}%</td>
                <td>${formHtml}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}