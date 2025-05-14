// 会議室画像クリックで選択状態を切り替え、フォームのプルダウンも連動
const roomImages = document.querySelectorAll('.room-image');
const roomSelect = document.getElementById('roomSelect');
let selectedRoom = 'A';

function update_room_selection(room) {
  selectedRoom = room;
  roomImages.forEach(img => {
    if (img.dataset.room === room) {
      img.classList.add('selected');
    } else {
      img.classList.remove('selected');
    }
  });
  roomSelect.value = room;
}

roomImages.forEach(img => {
  img.addEventListener('click', () => {
    update_room_selection(img.dataset.room);
  });
});

roomSelect.addEventListener('change', (e) => {
  update_room_selection(e.target.value);
});

// 30分単位の時刻リスト生成
function generate_time_options(select) {
  select.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      const value = `${hh}:${mm}`;
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
  }
}

generate_time_options(document.getElementById('startTime'));
generate_time_options(document.getElementById('endTime'));

// 予約データ格納用
let reservations = [];

function render_reservation_list() {
  const listDiv = document.getElementById('reservationList');
  if (!listDiv) return;
  if (reservations.length === 0) {
    listDiv.innerHTML = '<span>予約情報はありません。</span>';
    return;
  }
  let html = '<ul>';
  reservations.forEach((r, i) => {
    html += `<li>${i + 1}. [${r.room}] ${r.start} ～ ${r.end} / ${r.reserver}</li>`;
  });
  html += '</ul>';
  listDiv.innerHTML = html;
}

// 予約フォーム送信
const reserveForm = document.getElementById('reserveForm');
reserveForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const room = roomSelect.value;
  const startDate = document.getElementById('startDate').value;
  const startTime = document.getElementById('startTime').value;
  const endDate = document.getElementById('endDate').value;
  const endTime = document.getElementById('endTime').value;
  const reserver = document.getElementById('reserver').value.trim();

  if (!room || !startDate || !startTime || !endDate || !endTime || !reserver) {
    alert('すべての項目を入力してください。');
    return;
  }
  // 日付＋時刻を結合して比較
  const start = `${startDate}T${startTime}`;
  const end = `${endDate}T${endTime}`;
  if (start >= end) {
    alert('終了日時は開始日時より後にしてください。');
    return;
  }

  reservations.push({ room, start, end, reserver });
  alert('予約が完了しました！');
  reserveForm.reset();
  update_room_selection('A');
  render_reservation_list();
  // デフォルト値を再設定
  generate_time_options(document.getElementById('startTime'));
  generate_time_options(document.getElementById('endTime'));
});

// CSVダウンロード
function convert_to_csv(data) {
  const header = ['会議室','利用開始日時','利用終了日時','予約者名'];
  const rows = data.map(r => [r.room, r.start, r.end, r.reserver]);
  return [header, ...rows].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\r\n');
}

document.getElementById('downloadCsvBtn').addEventListener('click', function() {
  if (reservations.length === 0) {
    alert('予約データがありません。');
    return;
  }
  const csv = convert_to_csv(reservations);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reservations.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// 初期表示
render_reservation_list();

// 初期選択をA→Dも選択可能に
update_room_selection('A'); 