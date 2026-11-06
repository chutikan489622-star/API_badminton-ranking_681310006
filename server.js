const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// เสิร์ฟ React ที่ build แล้ว (client/dist) ก่อน แล้วค่อย fallback ไป public เดิม
const distDir = path.join(__dirname, 'client', 'dist');
app.use(express.static(distDir));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ---------------------------------------------------------
// 1. ข้อมูลจำลอง (เดิม) — อันดับทีมชาติ
// ---------------------------------------------------------
const mockData = [
    { id: 1, country: "Thailand", flag: "🇹🇭", matches: 120, wins: 85, winRate: 70.8, form: "W-W-L-W-W" },
    { id: 2, country: "Japan", flag: "🇯🇵", matches: 115, wins: 80, winRate: 69.5, form: "W-L-W-W-L" },
    { id: 3, country: "China", flag: "🇨🇳", matches: 130, wins: 88, winRate: 67.6, form: "L-W-W-W-W" },
    { id: 4, country: "South Korea", flag: "🇰🇷", matches: 110, wins: 80, winRate: 72.7, form: "W-W-W-L-W" },
    { id: 5, country: "Malaysia", flag: "🇲🇾", matches: 100, wins: 60, winRate: 60.0, form: "L-L-W-W-L" }
];

// ---------------------------------------------------------
// 1.1 ข้อมูลใหม่ — นักกีฬาและรายการแข่งขัน
// ⚠ ข้อมูลตัวอย่าง: ชื่อเป็นของจริง แต่คะแนน/สถิติเป็นค่าประมาณ
//   (ที่ยืนยันจากข่าว: Kunlavut 91,115 / Antonsen 90,105 อัปเดต 29 ก.ย. 2026, Jonatan 87,631 อัปเดต 25 ส.ค. 2026)
//   ตรวจและแก้ให้ตรงจาก https://bwfbadminton.com/rankings/ ก่อนส่งงาน
// photo = ไฟล์ใน client/public/players/<id>.jpg
// ---------------------------------------------------------
const DATA_NOTE = "ข้อมูลตัวอย่าง — ตรวจสอบ/อัปเดตจาก bwfbadminton.com";

const rawPlayers = [
    { id: "kunlavut",  name: "Kunlavut Vitidsarn", country: "Thailand",  flag: "🇹🇭", event: "MS", age: 25, points: 91115,  wins: 48, losses: 14, titles: 3, form: "W-W-W-L-W" },
    { id: "antonsen",  name: "Anders Antonsen",    country: "Denmark",   flag: "🇩🇰", event: "MS", age: 29, points: 90105,  wins: 45, losses: 15, titles: 2, form: "W-L-W-W-W" },
    { id: "jonatan",   name: "Jonatan Christie",   country: "Indonesia", flag: "🇮🇩", event: "MS", age: 28, points: 87631,  wins: 50, losses: 18, titles: 3, form: "L-W-W-L-W" },
    { id: "shiyuqi",   name: "Shi Yuqi",           country: "China",     flag: "🇨🇳", event: "MS", age: 30, points: 84200,  wins: 44, losses: 16, titles: 2, form: "W-W-L-W-L" },
    { id: "axelsen",   name: "Viktor Axelsen",     country: "Denmark",   flag: "🇩🇰", event: "MS", age: 32, points: 76500,  wins: 30, losses: 12, titles: 1, form: "W-L-L-W-W" },
    { id: "lakshya",   name: "Lakshya Sen",        country: "India",     flag: "🇮🇳", event: "MS", age: 25, points: 70300,  wins: 38, losses: 20, titles: 1, form: "L-W-L-W-W" },
    { id: "anseyoung", name: "An Se-young",        country: "South Korea", flag: "🇰🇷", event: "WS", age: 24, points: 108500, wins: 55, losses: 8,  titles: 7, form: "W-W-W-W-L" },
    { id: "wangzhiyi", name: "Wang Zhiyi",         country: "China",     flag: "🇨🇳", event: "WS", age: 25, points: 98000,  wins: 52, losses: 13, titles: 4, form: "W-W-L-W-W" },
    { id: "yamaguchi", name: "Akane Yamaguchi",    country: "Japan",     flag: "🇯🇵", event: "WS", age: 29, points: 90500,  wins: 46, losses: 15, titles: 3, form: "W-L-W-W-L" },
    { id: "sindhu",    name: "P. V. Sindhu",       country: "India",     flag: "🇮🇳", event: "WS", age: 31, points: 62000,  wins: 34, losses: 17, titles: 1, form: "L-W-W-L-W" }
];
const playersData = rawPlayers.map(p => ({
    ...p,
    matches: p.wins + p.losses,
    winRate: Math.round((p.wins / (p.wins + p.losses)) * 1000) / 10,
    photo: `/players/${p.id}.jpg`
}));

// แต้มของผู้ชนะ: ระดับรายการตามระบบแต้มของ BWF
const tournamentsData = [
    { id: "wc2026",     name: "BWF World Championships 2026", level: "World Championships", winnerPoints: 13000, city: "New Delhi",    country: "India",     month: "ส.ค. 2026", note: "รายการชิงแชมป์โลกประจำปี" },
    { id: "malaysia",   name: "Malaysia Open",       level: "Super 1000", winnerPoints: 12000, city: "Kuala Lumpur", country: "Malaysia",  month: "ม.ค." },
    { id: "allengland", name: "All England Open",    level: "Super 1000", winnerPoints: 12000, city: "Birmingham",   country: "England",   month: "มี.ค." },
    { id: "indonesia",  name: "Indonesia Open",      level: "Super 1000", winnerPoints: 12000, city: "Jakarta",      country: "Indonesia", month: "มิ.ย." },
    { id: "thailand",   name: "Thailand Open",       level: "Super 500",  winnerPoints: 9200,  city: "Bangkok",      country: "Thailand",  month: "พ.ค." }
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

    // ค้นแบบตรงตัวด้วย key (O(1) เฉลี่ย) — ใช้กับ id
    get(key) {
        const k = String(key).toLowerCase();
        const bucket = this.buckets[this.hash(k)] || [];
        for (const [storedKey, value] of bucket) {
            if (storedKey === k) return value;
        }
        return undefined;
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
mockData.forEach(data => countrySearchTable.insert(data.country, data));

const playerNameTable = new HashTable();   // ค้นหาด้วยชื่อ
const playerIdTable = new HashTable();     // ดึงรายคนด้วย id
playersData.forEach(p => { playerNameTable.insert(p.name, p); playerIdTable.insert(p.id, p); });

const tournamentTable = new HashTable();
tournamentsData.forEach(t => tournamentTable.insert(t.name, t));

// ใส่ rank ให้รายการที่เรียงแล้ว
const withRank = (list) => list.map((item, i) => ({ ...item, rank: i + 1 }));

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

// --- ใหม่: อันดับนักกีฬา (Merge Sort) — rank อิงตามคะแนนโลกเสมอ ---
function worldRanked(event) {
    const pool = event === 'MS' || event === 'WS' ? playersData.filter(p => p.event === event) : playersData;
    return withRank(mergeSort([...pool], 'points', 'desc'));
}

app.get('/api/players', (req, res) => {
    const allowed = ['points', 'wins', 'winRate', 'titles'];
    const event = req.query.event;
    const sortBy = allowed.includes(req.query.sort) ? req.query.sort : 'points';
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    const ranked = worldRanked(event);                       // ได้ rank โลกก่อน
    res.json({ note: DATA_NOTE, players: mergeSort(ranked, sortBy, order) });
});

app.get('/api/players/top', (req, res) => res.json({ note: DATA_NOTE, player: worldRanked()[0] }));

app.get('/api/players/:id', (req, res) => {
    const found = playerIdTable.get(req.params.id);          // Hash Table O(1)
    if (!found) return res.status(404).json({ error: 'player not found' });
    const rank = worldRanked(found.event).find(p => p.id === found.id).rank;
    res.json({ note: DATA_NOTE, player: { ...found, rank } });
});

app.get('/api/tournaments', (req, res) => {
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    res.json({ note: DATA_NOTE, tournaments: mergeSort([...tournamentsData], 'winnerPoints', order) });
});

// ข้อมูลหน้า Home รวมครั้งเดียว
app.get('/api/home', (req, res) => {
    res.json({
        note: DATA_NOTE,
        totals: { players: playersData.length, tournaments: tournamentsData.length, teams: mockData.length },
        topMS: worldRanked('MS').slice(0, 3),
        topWS: worldRanked('WS').slice(0, 3),
        topTeam: mergeSort([...mockData], 'wins', 'desc')[0],
        tournaments: mergeSort([...tournamentsData], 'winnerPoints', 'desc').slice(0, 3)
    });
});

// ค้นหารวม: นักกีฬา / ประเทศ / รายการแข่งขัน (Hash Table ทั้งหมด)
app.get('/api/search/all', (req, res) => {
    const q = req.query.q;
    if (typeof q !== 'string' || !q.trim()) return res.json({ players: [], countries: [], tournaments: [] });
    res.json({
        players: playerNameTable.search(q).slice(0, 5),
        countries: countrySearchTable.search(q).slice(0, 5),
        tournaments: tournamentTable.search(q).slice(0, 5)
    });
});

// API ที่ไม่มีอยู่จริง → 404 เป็น JSON
app.use('/api', (req, res) => res.status(404).json({ error: 'not found' }));

// SPA fallback: ให้ React Router จัดการ URL เช่น /players, /detail/jonatan
app.use((req, res, next) => {
    const indexFile = path.join(distDir, 'index.html');
    if (req.method === 'GET' && fs.existsSync(indexFile)) return res.sendFile(indexFile);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
