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
                
                let pictureNum = poem.id % 5 === 0 ? 5 : poem.id % 5;
                poemElement.style.backgroundImage = `url(../imgs/poem${pictureNum}.png)`;

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
                let response = JSON.parse(xhr.responseText);
                callback(true, response);
            } else {
                callback(false);
            }
        }
    };

    xhr.open('POST', 'http://52.43.254.152/book', false);

    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(`title=${title}&poems=${JSON.stringify(poems)}`);
}

function addImageAtBook(id, image, callback) {
    let xhr = new XMLHttpRequest();

    let formData = new FormData();
    formData.append('image', image);

    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                callback(true);
            } else {
                callback(false);
            }
        }
    };
    
    xhr.open('POST', `http://52.43.254.152/book/${id}/image`, true);

    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));
    xhr.send(formData);
}

const writeBook = (title, poems) => {
    addBook(title, poems, (result, book) => {
        if (result) {
            localStorage.setItem('Poem-Book-Id', book.id);
            
            let image = document.getElementById('realImg').files[0];
            
            if (!image) {
                alert('시집 등록 성공');
                location.href = './MyPage.html';
            } else {
                writeImageAtBook(book.id, image);
            }
        } else {
            alert('시집 등록 실패');
        }
    });
};

const writeImageAtBook = (id, image) => {
    addImageAtBook(id, image, (result) => {
        if (result) {
            alert('시집 등록 성공');
            location.href = './MyPage.html'
        } else {
            alert('시집 등록 실패');
        }
    });
};

localStorage.setItem('Poem-Book-Id', 0);

document.getElementById('createBook').onclick = (e) => {
    let image = document.getElementById('realImg').files[0];

    if (Number(localStorage.getItem('Poem-Book-Id')) === 0) {
        let titleForm = document.getElementById('titleName');
        let title = titleForm.value;
        
        if (!title) {
            alert('시집의 제목이 입력되지 않았습니다');
            return;
        }
        
        if (!poemIds || poemIds.length < 3) {
            alert('시집에 등록될 시의 개수는 3개 이상입니다.')
            return;
        }
    
        writeBook(title, poemIds);
    } else {
        writeImageAtBook(localStorage.getItem('Poem-Book-Id'), image);
    }
};
