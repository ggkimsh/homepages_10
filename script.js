// DOM 요소 선택
const memoTitle = document.getElementById('memo-title');
const memoContent = document.getElementById('memo-content');
const saveBtn = document.getElementById('save-btn');
const memoList = document.querySelector('.memo-list');
const currentTimeElement = document.getElementById('current-time');
const notification = document.getElementById('notification');

// 알림 메시지 표시 함수
function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    // 3초 후 알림 메시지 숨기기
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

// 현재 시간 표시 함수
function updateCurrentTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    currentTimeElement.textContent = now.toLocaleString('ko-KR', options);
}

// 1초마다 현재 시간 업데이트
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); // 초기 시간 표시

// 로컬 스토리지에서 메모 가져오기
let memos = JSON.parse(localStorage.getItem('memos')) || [];

// 메모 내용 토글 함수
function toggleMemoContent(id) {
    const contentElement = document.getElementById(`memo-content-${id}`);
    const allContents = document.querySelectorAll('.memo-content');
    
    // 다른 모든 메모 내용을 닫기
    allContents.forEach(content => {
        if (content !== contentElement) {
            content.classList.remove('show');
        }
    });
    
    // 클릭한 메모 내용 토글
    contentElement.classList.toggle('show');
}

// 메모 저장 함수
function saveMemo() {
    const title = memoTitle.value.trim();
    const content = memoContent.value.trim();
    
    if (!title || !content) {
        showNotification('제목과 내용을 모두 입력해주세요.', 'error');
        return;
    }

    const now = new Date();
    const memo = {
        id: Date.now(),
        title,
        content,
        date: now.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
    };

    memos.push(memo);
    localStorage.setItem('memos', JSON.stringify(memos));
    
    displayMemos();
    resetForm();
    showNotification('메모가 성공적으로 저장되었습니다.', 'success');
}

// 메모 삭제 함수
function deleteMemo(id, event) {
    event.stopPropagation(); // 이벤트 버블링 방지
    if (confirm('정말로 이 메모를 삭제하시겠습니까?')) {
        memos = memos.filter(memo => memo.id !== id);
        localStorage.setItem('memos', JSON.stringify(memos));
        displayMemos();
        showNotification('메모가 삭제되었습니다.', 'success');
    }
}

// 메모 표시 함수
function displayMemos() {
    memoList.innerHTML = '';
    
    memos.forEach(memo => {
        const memoElement = document.createElement('div');
        memoElement.className = 'memo-item';
        memoElement.innerHTML = `
            <div class="memo-title" onclick="toggleMemoContent(${memo.id})">
                ${memo.title}
                <button class="delete-btn" onclick="deleteMemo(${memo.id}, event)">삭제</button>
            </div>
            <div id="memo-content-${memo.id}" class="memo-content">
                <p>${memo.content}</p>
                <div class="memo-date">작성 시간: ${memo.date}</div>
            </div>
        `;
        memoList.appendChild(memoElement);
    });
}

// 입력 폼 초기화
function resetForm() {
    memoTitle.value = '';
    memoContent.value = '';
}

// 이벤트 리스너
saveBtn.addEventListener('click', saveMemo);

// 초기 메모 표시
displayMemos(); 