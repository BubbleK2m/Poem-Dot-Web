function readPoemsAtMember(callback) {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                callback(true, response.data);
            } else {
                callback(false, null);
            }
        }    
    };

    xhr.open('GET', 'http://52.43.254.152/member/poems', true);

    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));
    xhr.send(null);
}

let poemsCover = document.getElementById('selectPoemCover');

let poemIds = [];

const showPoemsAtMember = () => {
    readPoemsAtMember((result, poems) => {
        if (result && poems.length >= 3) {
            for (let poem of poems) {
                let poemElement = document.createElement('div');
                poemElement.className = 'selectPoems';
                poemElement.title = poem.title;
                
                let pictureNum = poem.id > 5 ? poem.id % 5 + 1 : 5 % poem.id + 1;
                poemElement.style.backgroundImage = `url(../imgs/poem${pictureNum}.jpg)`;

                let poemCover = document.createElement('div');
                poemCover.setAttribute('class', 'blackCover');

                let registerTxt = document.createElement('div');
                registerTxt.setAttribute('class', 'register');
                registerTxt.innerText = poem.title;

                let checkImg = document.createElement('img');
                checkImg.setAttribute('class', 'checkImg');
                checkImg.setAttribute('src', '../imgs/check.png');

                poemCover.appendChild(registerTxt);
                poemCover.appendChild(checkImg);

                poemElement.appendChild(poemCover);
                poemsCover.appendChild(poemElement);

                poemElement.onclick = (((poem) => {
                    return (e) => {
                        if (poemCover.style.opacity == 0) {
                            poemIds.push(poem.id);
                            poemCover.style.opacity = 1;
                        } else {
                            poemIds.splice(poems.indexOf(poem.id), 1);
                            poemCover.style.opacity = 0;
                        }
                    };
                })(poem));
            }
        } else {
            alert('시집을 작성할 수 없습니다.');
            location.href = './MainPage.html';
        }
    });
};

showPoemsAtMember();

function addBook(title, poems, callback) {
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

    xhr.open('POST', 'http://52.43.254.152/book', true);

    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(`title=${title}&poems=${JSON.stringify(poems)}`);
}

const publishBook = (title, poems) => {
    addBook(title, poems, (result) => {
        if (result) {
            alert('시집 등록 성공');
            localtion.href = './MainPage.html';
        } else {
            alert('시집 등록 실패');
        }
    });
};

let titleForm = document.getElementById('titleName');
let publishBtn = document.getElementById('createBook');

publishBtn.onclick = (e) => {
    let title = titleForm.value;
    
    if (!title) {
        alert('시집의 제목이 입력되지 않았습니다');
        return;
    }
    
    if (!poemIds || poemIds.length < 3) {
        alert('시집에 등록될 시의 개수는 3개 이상입니다.')
        return;
    }

    publishBook(title, poemIds);
};
