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

// 予約データ格納用
let reservations = [];

// 予約フォーム送信
const reserveForm = document.getElementById('reserveForm');
reserveForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const room = roomSelect.value;
  const start = document.getElementById('startTime').value;
  const end = document.getElementById('endTime').value;
  const reserver = document.getElementById('reserver').value.trim();

  if (!room || !start || !end || !reserver) {
    alert('すべての項目を入力してください。');
    return;
  }
  if (start >= end) {
    alert('終了日時は開始日時より後にしてください。');
    return;
  }

  reservations.push({ room, start, end, reserver });
  alert('予約が完了しました！');
  reserveForm.reset();
  update_room_selection('A');
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

// 初期選択
update_room_selection('A'); 