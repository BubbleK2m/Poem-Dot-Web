//li부분
let showLoginBtn = document.getElementById('showLogin');
let showSignupBtn = document.getElementById('showSignup');    
            
//none인 로그인 폼
let loginForm = document.getElementById('loginForm');
let signupForm = document.getElementById('signupForm');
            
//투명도 박스
let opacityBox = document.getElementById('opacityCover');
            
//보이기 로직
function showModal(btn, form){
    btn.addEventListener('click', () => {
        opacityBox.style.display = "block";
        form.style.display = "block";
                        
        console.log("Created!");
    });
}
            
//없애기 로직
function noneModal(btnCnt, form){
    let exitBtn = document.getElementsByClassName('exitBtn')[btnCnt];
    exitBtn.addEventListener('click', () => {
        opacityBox.style.display = "none";
        form.style.display = "none";
    });
}
                
/* 폼 보이기 */
showModal(showLoginBtn, loginForm);
showModal(showSignupBtn, signupForm);
            
/* 폼 없애기 */
noneModal(0, loginForm);
noneModal(1, signupForm);

// 로그인 요청
function login(email, password, callback) {
    let xhr = new XMLHttpRequest();
                
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                localStorage.setItem('Poem-Session-Key', xhr.getResponseHeader('Poem-Session-Key'));
                callback(true);
            } else {
                callback(false);
            }
        }
    };

    xhr.open('POST', 'http://52.43.254.152/login', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(`email=${email}&password=${password}`);
};

// 이메일 중복확인 요청
function checkEmail(email, callback) {
    let xhr = new XMLHttpRequest();
                
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(true);
            } else {
                callback(false);
            }
        }
    };

    xhr.open('POST', 'http://52.43.254.152/join/email/check', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(`email=${email}`); 
};

// 회원가입 요청
function signup(email, password, name, callback) {
    let xhr = new XMLHttpRequest();
                
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                callback(true);
            } else {
                callback(false);
            }
        }
    };

    xhr.open('POST', 'http://52.43.254.152/join', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(`email=${email}&password=${password}&name=${name}`);  
};

let loginEmailForm = loginForm.querySelector('#emailForm');
let loginPwdForm = loginForm.querySelector('#pwdForm');

let loginBtn = loginForm.querySelector('#loginBtn');

loginBtn.onclick = (e) => {
    let email = loginEmailForm.value;
    let password = loginPwdForm.value;

    if (!email && !password) {
        alert('값이 입력되지 않음');
        return;
    }

    login(email, password, (result) => {
        if (result) {
            location.href = './MainPage.html'
        } else {
            alert('로그인 실패');
        }
    });
};

let signupEmailForm = signupForm.querySelector('#emailForm');
let signupRepeatCheck = signupForm.querySelector('#repeatCheck');

signupEmailForm.onblur = (e) => {
    let email = signupEmailForm.value;
                
    checkEmail(email, (result) => {
        if (result) {
            alert('중복되는 이메일이 존재하지 않습니다')
            signupRepeatCheck.checked = true;
        } else {
            alert('중복되는 이메일이 존재합니다');
            signupRepeatCheck.checked = false;
        }
    });
};

let signupPwdForms = signupForm.querySelectorAll('.pwdForms');
let signupNameForm = signupForm.querySelector('#nicknameForm');

let signupBtn = signupForm.querySelector('#signupBtn');
signupBtn.onclick = (e) => {
    let email = signupEmailForm.value;
    let emailCheck = signupRepeatCheck.checked;
    let passwords = [ signupPwdForms[0].value, signupPwdForms[1].value ];
    let name = signupNameForm.value;

    if (!email || !passwords[0] || !passwords[0] || !name) {
        alert('값이 입력되지 않음');
        return;
    }

    if (!emailCheck) {
        alert('사용할 수 없는 아이디');
        return;
    }

    if (passwords[0] !== passwords[1]) {
        alert('비밀번호가 일치하지 않음');
        return;
    }

    signup(email, passwords[0], name, (result) => {
        if (result) {
            alert('회원가입 성공');
        } else {
            alert('회원가입 실패');
        }
    });
}