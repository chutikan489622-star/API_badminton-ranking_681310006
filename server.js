const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ---------------------------------------------------------
// 1. จำลองข้อมูลที่ได้จากการดึงและประมวลผลจาก API
// ---------------------------------------------------------
const mockData = [
    { id: 1, country: "Thailand", flag: "🇹🇭", matches: 120, wins: 85, winRate: 70.8, form: "W-W-L-W-W" },
    { id: 2, country: "Japan", flag: "🇯🇵", matches: 115, wins: 80, winRate: 69.5, form: "W-L-W-W-L" },
    { id: 3, country: "China", flag: "🇨🇳", matches: 130, wins: 88, winRate: 67.6, form: "L-W-W-W-W" },
    { id: 4, country: "South Korea", flag: "🇰🇷", matches: 110, wins: 80, winRate: 72.7, form: "W-W-W-L-W" },
    { id: 5, country: "Malaysia", flag: "🇲🇾", matches: 100, wins: 60, winRate: 60.0, form: "L-L-W-W-L" }
];

// ---------------------------------------------------------
// 2. DSA: Merge Sort (เรียงลำดับข้อมูล) - เขียนเอง ไม่ใช้ built-in
// ---------------------------------------------------------
function mergeSort(arr, sortBy = 'wins', order = 'desc') {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), sortBy, order);
    const right = mergeSort(arr.slice(mid), sortBy, order);
    return merge(left, right, sortBy, order);
}

function merge(left, right, sortBy, order) {
    let result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        const leftValue = left[i][sortBy];
        const rightValue = right[j][sortBy];
        const leftComesFirst = order === 'asc'
            ? leftValue <= rightValue
            : leftValue >= rightValue;
        if (leftComesFirst) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}

// ---------------------------------------------------------
// 3. DSA: Hash Table (สำหรับระบบค้นหา) - เขียนเอง
// ---------------------------------------------------------
class HashTable {
    constructor(size = 50) {
        this.buckets = new Array(size);
    }

    hash(key) {
        let hashValue = 0;
        for (let i = 0; i < key.length; i++) {
            hashValue += key.charCodeAt(i);
        }
        return hashValue % this.buckets.length;
    }

    insert(key, value) {
        let index = this.hash(key.toLowerCase());
        if (!this.buckets[index]) {
            this.buckets[index] = [];
        }
        // เลี่ยงข้อมูลซ้ำด้วยการอัปเดตถ้ามี key อยู่แล้ว
        let found = false;
        for (let i = 0; i < this.buckets[index].length; i++) {
            if (this.buckets[index][i][0] === key.toLowerCase()) {
                this.buckets[index][i][1] = value;
                found = true;
                break;
            }
        }
        if (!found) this.buckets[index].push([key.toLowerCase(), value]);
    }

    search(key) {
        const normalizedKey = key.trim().toLowerCase();
        if (!normalizedKey) return [];

        const exactBucket = this.buckets[this.hash(normalizedKey)] || [];
        for (const [storedKey, value] of exactBucket) {
            if (storedKey === normalizedKey) return [value];
        }

        const matches = [];
        for (const bucket of this.buckets) {
            if (!bucket) continue;
            for (const [storedKey, value] of bucket) {
                if (storedKey.includes(normalizedKey)) matches.push(value);
            }
        }
        return matches;
    }
}

// เตรียมข้อมูลใส่ Hash Table เพื่อให้ค้นหาได้ไว O(1) - O(n)
const countrySearchTable = new HashTable();
mockData.forEach(data => {
    countrySearchTable.insert(data.country, data);
});


// ---------------------------------------------------------
// 4. API Endpoints
// ---------------------------------------------------------

// Endpoint: ดึงข้อมูลที่เรียงลำดับแล้ว (ใช้งาน Merge Sort)
app.get('/api/rankings', (req, res) => {
    const allowedSortFields = ['wins', 'matches', 'winRate'];
    const sortBy = allowedSortFields.includes(req.query.sort) ? req.query.sort : 'wins';
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    const sortedData = mergeSort([...mockData], sortBy, order);
    res.json(sortedData);
});

// Endpoint: ค้นหาประเทศ (ใช้งาน Hash Table)
app.get('/api/search', (req, res) => {
    const query = req.query.q;
    if (typeof query !== 'string' || !query.trim()) return res.json([]);

    res.json(countrySearchTable.search(query));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});