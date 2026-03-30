// ===== 로그인 기능 =====

// 테스트 계정 (실제로는 서버에서 확인)
const testAccounts = [
    { id: 'db.yu@caring.co.kr', password: 'gkfnql123!' },
];

// 페이지 로드 시 로그인 상태 확인
window.addEventListener('load', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');
    
    if (isLoggedIn === 'true' && userData) {
        showMainPage(JSON.parse(userData));
    } else {
        showLoginPage();
    }
});

// 로그인 페이지 표시
function showLoginPage() {
    document.getElementById('login-page').classList.add('active');
}

// 메인 페이지 표시
function showMainPage(user) {
    document.getElementById('login-page').classList.remove('active');
    initializeMainPage(user);
}

// 로그인 폼 핸들링
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = document.getElementById('login-id').value;
    const password = document.getElementById('login-password').value;
    
    // 계정 확인
    const account = testAccounts.find(acc => acc.id === userId && acc.password === password);
    
    if (account) {
        // 로그인 성공
        const userData = {
            id: userId,
            name: userId.split('@')[0].toUpperCase()
        };
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // 로그인 상태 업데이트 및 메인 페이지 표시
        document.getElementById('user-name').textContent = userData.name;
        showMainPage(userData);
    } else {
        // 로그인 실패
        alert('❌ 아이디나 비밀번호가 틀렸습니다.\n\n테스트 계정:\nabc@company.com / 1234');
        document.getElementById('login-id').value = '';
        document.getElementById('login-password').value = '';
    }
});

// 로그아웃
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        document.getElementById('login-form').reset();
        showLoginPage();
    }
});

// ===== 메인 페이지 초기화 =====
function initializeMainPage(user) {
    document.getElementById('user-name').textContent = user.name;
    renderEmployeesTable();
    renderSalaryTable();
    renderVacationTable();
    updateDashboard();
}


const employees = [
    {
        id: 'E001',
        name: '김철수',
        department: '개발팀',
        position: '과장',
        email: 'chulsu.kim@company.com',
        hire_date: '2020-01-15',
        phone: '010-1234-5678',
        salary: { base: 4000000, bonus: 800000, allowance: 200000 }
    },
    {
        id: 'E002',
        name: '이영희',
        department: '영업팀',
        position: '대리',
        email: 'younghee.lee@company.com',
        hire_date: '2021-06-20',
        phone: '010-2345-6789',
        salary: { base: 3500000, bonus: 700000, allowance: 150000 }
    },
    {
        id: 'E003',
        name: '박민수',
        department: '개발팀',
        position: '사원',
        email: 'minsu.park@company.com',
        hire_date: '2022-03-10',
        phone: '010-3456-7890',
        salary: { base: 2800000, bonus: 500000, allowance: 100000 }
    },
    {
        id: 'E004',
        name: '정수진',
        department: '인사팀',
        position: '과장',
        email: 'sujin.jung@company.com',
        hire_date: '2019-11-05',
        phone: '010-4567-8901',
        salary: { base: 3800000, bonus: 750000, allowance: 180000 }
    },
    {
        id: 'E005',
        name: '최동욱',
        department: '영업팀',
        position: '사원',
        email: 'donguk.choi@company.com',
        hire_date: '2023-01-02',
        phone: '010-5678-9012',
        salary: { base: 2500000, bonus: 400000, allowance: 80000 }
    }
];

const vacations = [
    {
        id: 1,
        employee_name: '김철수',
        type: '연차',
        start_date: '2026-04-01',
        end_date: '2026-04-03',
        days: 3,
        status: '진행중'
    },
    {
        id: 2,
        employee_name: '이영희',
        type: '병가',
        start_date: '2026-03-28',
        end_date: '2026-03-30',
        days: 2,
        status: '진행중'
    },
    {
        id: 3,
        employee_name: '박민수',
        type: '연차',
        start_date: '2026-05-10',
        end_date: '2026-05-12',
        days: 3,
        status: '승인대기'
    }
];

// 탭 전환 기능
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // 활성 버튼 변경
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 활성 탭 변경
        const tabId = btn.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// 사원 테이블 렌더링
function renderEmployeesTable() {
    const tbody = document.getElementById('employees-table');
    tbody.innerHTML = employees.map(emp => `
        <tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.position}</td>
            <td>${emp.email}</td>
            <td>${emp.hire_date}</td>
            <td>
                <button class="btn btn-small btn-edit" onclick="editEmployee('${emp.id}')">수정</button>
                <button class="btn btn-small btn-delete" onclick="deleteEmployee('${emp.id}')">삭제</button>
            </td>
        </tr>
    `).join('');
}

// 급여 테이블 렌더링
function renderSalaryTable() {
    const tbody = document.getElementById('salary-table');
    tbody.innerHTML = employees.map(emp => {
        const total = emp.salary.base + emp.salary.bonus + emp.salary.allowance;
        return `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td>${emp.salary.base.toLocaleString()}원</td>
                <td>${emp.salary.bonus.toLocaleString()}원</td>
                <td>${emp.salary.allowance.toLocaleString()}원</td>
                <td><strong>${total.toLocaleString()}원</strong></td>
            </tr>
        `;
    }).join('');
}

// 휴가 테이블 렌더링
function renderVacationTable() {
    const tbody = document.getElementById('vacation-table');
    tbody.innerHTML = vacations.map(vac => `
        <tr>
            <td>${vac.employee_name}</td>
            <td>${vac.type}</td>
            <td>${vac.start_date}</td>
            <td>${vac.end_date}</td>
            <td>${vac.days}일</td>
            <td>
                <span class="badge ${vac.status === '진행중' ? 'badge-active' : 'badge-inactive'}">
                    ${vac.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// 사원 추가 폼 핸들링
document.getElementById('employee-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const newEmployee = {
        id: 'E' + String(employees.length + 1).padStart(3, '0'),
        name: formData.get('name'),
        department: formData.get('department'),
        position: formData.get('position'),
        email: formData.get('email'),
        hire_date: formData.get('hire_date'),
        phone: formData.get('phone'),
        salary: { base: 3000000, bonus: 600000, allowance: 120000 }
    };
    
    employees.push(newEmployee);
    alert(newEmployee.name + ' 사원이 추가되었습니다!');
    this.reset();
    
    // 사원 조회 탭으로 이동
    document.querySelector('[data-tab="employees"]').click();
    renderEmployeesTable();
    updateDashboard();
});

// 사원 수정
function editEmployee(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
        const name = prompt('새로운 이름을 입력하세요:', employee.name);
        if (name) {
            employee.name = name;
            alert('수정되었습니다!');
            renderEmployeesTable();
            updateDashboard();
        }
    }
}

// 사원 삭제
function deleteEmployee(employeeId) {
    if (confirm('정말 삭제하시겠습니까?')) {
        const index = employees.findIndex(e => e.id === employeeId);
        if (index > -1) {
            employees.splice(index, 1);
            alert('삭제되었습니다!');
            renderEmployeesTable();
            updateDashboard();
        }
    }
}

// 검색 기능
document.getElementById('search-btn').addEventListener('click', function() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchText) ||
        emp.department.toLowerCase().includes(searchText)
    );
    
    const tbody = document.getElementById('employees-table');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">검색 결과가 없습니다.</td></tr>';
    } else {
        tbody.innerHTML = filtered.map(emp => `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>${emp.email}</td>
                <td>${emp.hire_date}</td>
                <td>
                    <button class="btn btn-small btn-edit" onclick="editEmployee('${emp.id}')">수정</button>
                    <button class="btn btn-small btn-delete" onclick="deleteEmployee('${emp.id}')">삭제</button>
                </td>
            </tr>
        `).join('');
    }
});

// 대시보드 업데이트
function updateDashboard() {
    document.getElementById('total-employees').textContent = employees.length;
}

// Enter 키로 검색
document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

// 초기 데이터 로드
renderEmployeesTable();
renderSalaryTable();
renderVacationTable();
updateDashboard();
