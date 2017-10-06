let bookCover = document.getElementById('poemBack');

function readBook(id, callback) {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                callback(true, response);
            } else {
                callback(false, null)
            }
        }
    };

    xhr.open('GET', `http://52.43.254.152/book/${id}`, true);
    xhr.send(null);
}

function readPoemsAtBook(id, callback) {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                callback(true, response.data);
            } else {
                callback(false, null)
            }
        }
    };

    xhr.open('GET', `http://52.43.254.152/book/${id}/poems`, true);
    xhr.send(null);
}

let bookElement = bookCover.querySelector('#poemCover');

function showBook(id) {
    readBook(id, (result, book) => {
        if (result) {
            let pictureNum = id % 4 === 0 ? 4 : id % 4;

            bookElement.innerHTML =
                `<h1>시집 '${book.title}'</h1>
                <img src = "../imgs/book${pictureNum}.gif" class = "backImg">
                <div id = "poemPart">
                    <h2>${book.title}</h2>
                    <h2 id = "author">${book.writer}</h2>
                    <h2 id = "explain">${book.writer} 의 시집입니다.</h2>

                    <img src = "../imgs/thumbUp.png" class="thumbUp">
                    <div id = "thumbCnt">
                        ${book.hearts}
                    </div>
                </div>`;
        } else {
            alert('시집을 조회할 수 없음');
            location.href = './MainPage.html';
        }
    });
}

let poemsCover = document.getElementById('poemsBack');

function showPoemsAtBook(id) {
    readPoemsAtBook(id, (result, poems) => {
        if (result) {
            for (let poem of poems) {
                let poemElement = document.createElement('div');
                poemElement.setAttribute('class', 'poemsCover');

                let pictureNum = poem.id % 5 === 0 ? 5 : poem.id % 5;

                let poemContent = 
                    `<!-- 시 배경 이미지 class -->
                    <img src = "../imgs/poem${pictureNum}.png" class = "poemImgs">
                    <div class = "poemsContent">
                        <h1>${poem.title}</h1>
                        <h2>${poem.writer}</h2>
                        <h2>${poem.writer} 의 시</h2>
                    </div>`;

                poemElement.innerHTML = poemContent;

                poemElement.onclick = (((poem) => {
                    return (e) => {
                        localStorage.setItem('Poem-Poem-Id', poem.id);
                        location.href = './Poem.html';
                    };
                })(poem));

                poemsCover.appendChild(poemElement);
            }
        } else {
            alert('시를 조회할 수 없음');
            location.href = './MainPage.html';
        }
    });
}

document.getElementById('mainPageLnk').onclick = (e) => {
    location.href = './MainPage.html';
};

document.getElementById('myPageLnk').onclick = (e) => {
    location.href = './MyPage.html';
};

document.getElementById('logoutLnk').onclick = (e) => {
    if (localStorage.getItem('Poem-Session-Key')) {
        localStorage.setItem('Poem-Session-Key', '');
    }

    location.href = './Landing.html';
};

showBook(localStorage.getItem('Poem-Book-Id'));
showPoemsAtBook(localStorage.getItem('Poem-Book-Id'));
