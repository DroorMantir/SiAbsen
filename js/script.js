/* ==========================================================================
   1. Konfigurasi & Utilitas
   ========================================================================== */
const K = { m: 'siabsen.mhs', a: 'siabsen.att', d: 'siabsen.dosen' };
const MK = ['Pemrograman Web', 'Basis Data', 'Algoritma'];
const KLS = ['TI-1A', 'TI-1B', 'TI-2A'];
const ST = { H: 'Hadir', I: 'Izin', S: 'Sakit', A: 'Alpa' };
const MENU = [
  ['dashboard', 'Dashboard'],
  ['mahasiswa', 'Mahasiswa'],
  ['absensi', 'Absensi'],
  ['rekap', 'Rekap']
];

const $ = s => document.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9);
const iso = d => d.toISOString().slice(0, 10);
const fd = s => new Date(s + 'T00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const opts = (arr, all) => (all ? `<option value="">${all}</option>` : '') + arr.map(v => `<option>${v}</option>`).join('');

/* ==========================================================================
   2. Penyimpanan & State Global
   ========================================================================== */
const storage = (api, k, val, json = true) => {
  try {
    if (val === undefined) {
      const raw = api.getItem(k);
      return json ? JSON.parse(raw) : raw;
    }
    val === null ? api.removeItem(k) : api.setItem(k, json ? JSON.stringify(val) : val);
  } catch {}
  return null;
};

const store = (k, val) => storage(localStorage, k, val, true);
const sessStore = (k, val) => storage(sessionStorage, k, val, false);

const mhs0 = ['Andi Pratama', 'Bunga Lestari', 'Citra Dewi', 'Dimas Saputra', 'Eka Wulandari', 'Fajar Nugroho', 'Gita Permata', 'Hasan Basri']
  .map((nama, i) => ({ id: 'm' + i, nim: '2024' + (1001 + i), nama, kelas: KLS[i % 3] }));

const att0 = [14, 7, 0].map((o, s) => ({
  id: 'a' + s,
  date: iso(new Date(Date.now() - o * 864e5)),
  matkul: MK[s],
  records: Object.fromEntries(mhs0.map((m, i) => [
    m.id,
    (i * 3 + s * 5) % 7 === 0 ? 'A' : (i + s) % 6 === 0 ? 'I' : (i * 2 + s) % 9 === 0 ? 'S' : 'H'
  ]))
}));

let mhs = store(K.m) || mhs0;
let att = store(K.a) || att0;
const dosen = store(K.d) || { username: 'dosen', password: 'dosen123', nama: 'Sir. Regi Nayoan' };
const save = () => { store(K.m, mhs); store(K.a, att); };

let cur = {};
let editM = null;
let onYes = null;
let chart;

/* ==========================================================================
   3. Komponen UI (Toast & Modal Konfirmasi)
   ========================================================================== */
function toast(msg) {
  const el = Object.assign(document.createElement('div'), { className: 't', textContent: msg });
  $('#toast').append(el);
  setTimeout(() => el.remove(), 2600);
}

function ask(msg, fn, label = 'Hapus') {
  $('#cm').textContent = msg;
  $('#cy').textContent = label;
  onYes = fn;
  $('#dc').showModal();
}

/* ==========================================================================
   4. Login & Inisialisasi Shell Aplikasi
   ========================================================================== */
const PAGE = document.body.dataset.page;
const isLogged = () => sessStore('siabsen.login') === '1';

function initLogin() {
  if (isLogged()) return location.replace('dashboard.html');

  $('#lf').onsubmit = e => {
    e.preventDefault();
    const u = $('#lu').value.trim();
    const p = $('#lp').value;

    $('#eu').textContent = u ? '' : 'Username wajib diisi.';
    $('#ep').textContent = p ? '' : 'Password wajib diisi.';
    if (!u || !p) return;
    if (u !== dosen.username || p !== dosen.password) return ($('#ep').textContent = 'Username atau password salah.');

    sessStore('siabsen.login', '1');
    sessStore('siabsen.flash', 'Selamat datang, ' + dosen.nama);
    location.href = 'dashboard.html';
  };
}

function initApp() {
  if (!isLogged()) return location.replace('index.html');

  $('.app').insertAdjacentHTML('afterbegin', `
    <nav aria-label="Navigasi utama">
      <div class="logo">Si<span>Absen</span></div>
      <div class="who">${esc(dosen.nama)}</div>
      ${MENU.map(([v, label]) => `<a href="${v}.html" class="${PAGE === v ? 'on' : ''}">${label}</a>`).join('')}
      <button class="lo" id="out">Keluar</button>
    </nav>
  `);

  document.body.insertAdjacentHTML('beforeend', `
    <div id="toast" aria-live="polite"></div>
    <dialog id="dc">
      <p id="cm"></p>
      <div class="acts" style="justify-content: flex-end;">
        <button class="ghost" id="cn">Batal</button>
        <button class="dn" id="cy">Hapus</button>
      </div>
    </dialog>
  `);

  document.body.hidden = false;
  $('#out').onclick = () => ask('Keluar dari akun?', () => { sessStore('siabsen.login', null); location.href = 'index.html'; }, 'Keluar');
  $('#cn').onclick = () => $('#dc').close();
  $('#cy').onclick = () => { $('#dc').close(); onYes?.(); };

  const flashMsg = sessStore('siabsen.flash');
  if (flashMsg) { toast(flashMsg); sessStore('siabsen.flash', null); }

  ({ dashboard: initDash, mahasiswa: initMhs, absensi: initAbs, rekap: initRekap })[PAGE]?.();
}

/* ==========================================================================
   5. Halaman Dashboard
   ========================================================================== */
function pct(m, mk) {
  const list = att.filter(a => (!mk || a.matkul === mk) && a.records[m.id]);
  if (!list.length) return null;
  return Math.round((list.filter(a => a.records[m.id] === 'H').length / list.length) * 100);
}

function initDash() {
  const ps = mhs.map(m => pct(m)).filter(p => p !== null);
  const avg = ps.length ? Math.round(ps.reduce((a, b) => a + b, 0) / ps.length) : 0;
  const low = mhs.filter(m => (pct(m) ?? 100) < 75);

  $('#stats').innerHTML = [
    ['Total mahasiswa', mhs.length, ''],
    ['Total pertemuan', att.length, 'y'],
    ['Rata-rata hadir', avg + '%', ''],
    ['Perlu perhatian', low.length, 'y']
  ].map(([l, v, c]) => `<div class="card stat ${c}"><small>${l}</small><b>${v}</b></div>`).join('');

  $('#warn').innerHTML = !ps.length
    ? `<div class="empty">
        <b>Belum ada data kehadiran</b><br>
        <small>Tambahkan data mahasiswa dan input absensi untuk mulai memantau kehadiran.</small>
      </div>`
    : low.length
      ? low.map(m => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd)">
            <span>${esc(m.nama)}<br><small style="color:var(--mut)">${esc(m.nim)}</small></span>
            <span class="tag">${pct(m)}%</span>
          </div>
        `).join('')
      : `<div class="empty ok">
          <b>Aman! Tidak ada mahasiswa di bawah 75%</b><br>
          <small>Seluruh mahasiswa memenuhi batas minimal kehadiran.</small>
        </div>`;

  if (typeof Chart === 'undefined') return;
  chart?.destroy();

  const recent = [...att].sort((a, b) => a.date.localeCompare(b.date)).slice(-8);
  Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--mut').trim();
  chart = new Chart($('#c1'), {
    type: 'bar',
    data: {
      labels: recent.map(a => `${a.date.slice(5)} ${a.matkul.split(' ')[0]}`),
      datasets: [{
        data: recent.map(a => {
          const v = Object.values(a.records);
          return v.length ? Math.round((v.filter(x => x === 'H').length / v.length) * 100) : 0;
        }),
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }]
    },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }
  });
}

/* ==========================================================================
   6. Halaman CRUD Mahasiswa
   ========================================================================== */
function initMhs() {
  $('#mk').innerHTML = opts(KLS, 'Semua kelas');
  $('#mkl').innerHTML = opts(KLS);

  const render = () => {
    const q = $('#mq').value.trim().toLowerCase();
    const k = $('#mk').value;
    const filtered = mhs.filter(m => (!q || (m.nama + m.nim).toLowerCase().includes(q)) && (!k || m.kelas === k));

    $('#mrows').innerHTML = filtered.map(m => `
      <tr>
        <td>${esc(m.nim)}</td>
        <td>${esc(m.nama)}</td>
        <td><span class="tag">${esc(m.kelas)}</span></td>
        <td>
          <div class="acts">
            <button class="ghost sm" data-e="${m.id}">Ubah</button>
            <button class="dn sm" data-d="${m.id}">Hapus</button>
          </div>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="4" class="empty">Tidak ada data.</td></tr>';
  };

  const openModal = id => {
    editM = id;
    const m = mhs.find(x => x.id === id);
    $('#mt').textContent = m ? 'Ubah Mahasiswa' : 'Tambah Mahasiswa';
    $('#mn').value = m?.nim || '';
    $('#mnm').value = m?.nama || '';
    $('#mkl').value = m?.kelas || KLS[0];
    $('#e1').textContent = $('#e2').textContent = '';
    $('#dm').showModal();
  };

  $('#mq').oninput = $('#mk').oninput = render;
  $('#madd').onclick = () => openModal(null);
  $('#mc').onclick = () => $('#dm').close();

  $('#mrows').onclick = e => {
    const { e: editId, d: delId } = e.target.closest('button')?.dataset || {};
    if (editId) return openModal(editId);
    if (!delId) return;

    const m = mhs.find(x => x.id === delId);
    ask(`Hapus mahasiswa "${m.nama}"?`, () => {
      mhs = mhs.filter(x => x.id !== m.id);
      att.forEach(a => delete a.records[m.id]);
      save();
      render();
      toast('Mahasiswa dihapus');
    });
  };

  $('#mf').onsubmit = e => {
    e.preventDefault();
    const nim = $('#mn').value.trim();
    const nama = $('#mnm').value.trim();
    const kelas = $('#mkl').value;

    const e1 = !/^\d{5,12}$/.test(nim) ? 'NIM harus 5–12 digit angka.' : mhs.some(m => m.nim === nim && m.id !== editM) ? 'NIM sudah terdaftar.' : '';
    const e2 = nama.length < 3 ? 'Nama minimal 3 karakter.' : '';
    $('#e1').textContent = e1;
    $('#e2').textContent = e2;
    if (e1 || e2) return;

    editM ? Object.assign(mhs.find(x => x.id === editM), { nim, nama, kelas }) : mhs.push({ id: uid(), nim, nama, kelas });
    save();
    $('#dm').close();
    render();
    toast(editM ? 'Data diperbarui' : 'Mahasiswa ditambahkan');
  };

  render();
}

/* ==========================================================================
   7. Halaman Input Absensi
   ========================================================================== */
function initAbs() {
  $('#am').innerHTML = opts(MK);
  const getSess = () => att.find(a => a.matkul === $('#am').value && a.date === $('#ad').value);

  const render = () => {
    $('#arows').innerHTML = mhs.map(m => `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 0;border-bottom:1px solid var(--bd)">
        <span><b>${esc(m.nama)}</b><br><small style="color:var(--mut)">${esc(m.nim)} · ${esc(m.kelas)}</small></span>
        <div class="seg">
          ${Object.entries(ST).map(([k, v]) => `<button class="${cur[m.id] === k ? 'on' : ''}" data-id="${m.id}" data-s="${k}">${v}</button>`).join('')}
        </div>
      </div>
    `).join('') || '<div class="empty">Tambahkan mahasiswa dulu.</div>';
  };

  const load = () => {
    const s = getSess();
    cur = s ? { ...s.records } : {};
    $('#ainfo').textContent = s ? 'Absensi sudah ada — menyimpan akan memperbarui data.' : 'Pertemuan baru.';
    render();
  };

  $('#arows').onclick = e => {
    const { id, s } = e.target.closest('button')?.dataset || {};
    if (!id) return;
    cur[id] = s;
    $('#aerr').textContent = '';
    render();
  };

  $('#aall').onclick = () => { mhs.forEach(m => (cur[m.id] = 'H')); render(); };
  $('#am').onchange = $('#ad').onchange = load;

  $('#asave').onclick = () => {
    if (!$('#ad').value) return ($('#aerr').textContent = 'Tanggal wajib diisi.');
    if (!mhs.length) return ($('#aerr').textContent = 'Belum ada mahasiswa.');

    const missing = mhs.filter(m => !cur[m.id]).length;
    if (missing) return ($('#aerr').textContent = `Masih ${missing} mahasiswa belum ditandai.`);

    const s = getSess();
    const records = Object.fromEntries(mhs.map(m => [m.id, cur[m.id]]));
    s ? (s.records = records) : att.push({ id: uid(), date: $('#ad').value, matkul: $('#am').value, records });

    save();
    sessStore('siabsen.flash', s ? 'Absensi diperbarui' : 'Absensi disimpan');
    location.href = 'rekap.html';
  };

  const params = new URLSearchParams(location.search);
  $('#ad').value = params.get('tanggal') || iso(new Date());
  if (params.get('matkul')) $('#am').value = params.get('matkul');
  load();
}

/* ==========================================================================
   8. Halaman Rekapitulasi & Export CSV
   ========================================================================== */
function initRekap() {
  $('#rm').innerHTML = opts(MK, 'Semua mata kuliah');

  const render = () => {
    const q = $('#rq').value.trim().toLowerCase();
    const mk = $('#rm').value;

    $('#rrows').innerHTML = mhs.filter(m => !q || m.nama.toLowerCase().includes(q)).map(m => {
      const c = { H: 0, I: 0, S: 0, A: 0 };
      att.forEach(a => { if ((!mk || a.matkul === mk) && a.records[m.id]) c[a.records[m.id]]++; });
      const p = pct(m, mk);

      return `
        <tr>
          <td>${esc(m.nama)}</td>
          <td>${c.H}</td>
          <td>${c.I}</td>
          <td>${c.S}</td>
          <td>${c.A}</td>
          <td>
            <div style="display:flex;gap:8px;align-items:center">
              <div class="pb"><i class="${p !== null && p < 75 ? 'lo' : ''}" style="width:${p || 0}%"></i></div>
              ${p === null ? '-' : p + '%'}
            </div>
          </td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="6" class="empty">Tidak ada data.</td></tr>';

    $('#hrows').innerHTML = [...att].filter(a => !mk || a.matkul === mk).sort((a, b) => b.date.localeCompare(a.date)).map(a => {
      const v = Object.values(a.records);
      return `
        <tr>
          <td>${fd(a.date)}</td>
          <td>${esc(a.matkul)}</td>
          <td>${v.filter(x => x === 'H').length}/${v.length}</td>
          <td>
            <div class="acts">
              <button class="ghost sm" data-e="${a.id}">Ubah</button>
              <button class="dn sm" data-d="${a.id}">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="4" class="empty">Belum ada pertemuan.</td></tr>';
  };

  $('#rq').oninput = $('#rm').oninput = render;

  $('#hrows').onclick = e => {
    const { e: editId, d: delId } = e.target.closest('button')?.dataset || {};
    const a = att.find(x => x.id === (editId || delId));
    if (!a) return;
    if (editId) return (location.href = `absensi.html?matkul=${encodeURIComponent(a.matkul)}&tanggal=${a.date}`);

    ask(`Hapus absensi ${a.matkul} (${fd(a.date)})?`, () => {
      att = att.filter(x => x.id !== a.id);
      save();
      render();
      toast('Pertemuan dihapus');
    });
  };

  $('#csv').onclick = () => {
    const rows = [['Tanggal', 'Mata Kuliah', 'NIM', 'Nama', 'Status']];
    [...att].sort((a, b) => a.date.localeCompare(b.date)).forEach(a =>
      mhs.forEach(m => a.records[m.id] && rows.push([a.date, a.matkul, m.nim, m.nama, ST[a.records[m.id]]]))
    );
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'rekap-absensi.csv'
    }).click();
    toast('CSV diunduh');
  };

  render();
}

/* ==========================================================================
   9. Mulai Aplikasi
   ========================================================================== */
PAGE === 'login' ? initLogin() : initApp();
