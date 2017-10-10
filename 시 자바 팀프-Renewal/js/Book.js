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

function readHeartAtBook(id, callback) {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(true, true);
            } else if (xhr.status === 204) {
                callback(true, false);
            } else {
                callback(false, false);
            }
        }
    };

    xhr.open('GET', `http://52.43.254.152/book/${id}/heart`, true);
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));

    xhr.send(null);
}

function updateHeartAtBook(id, heart, callback) {
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

    xhr.open('PUT', `http://52.43.254.152/book/${id}/heart`, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));

    xhr.send(`heart=${heart}`);
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

const showBook = (id) => {
    readBook(id, (result, book) => {
        if (result) {
            let pictureNum = id % 4 === 0 ? 4 : id % 4;
            
            let bookTitle = bookElement.querySelector('#title');
            bookTitle.innerText = book.title;

            let bookImage = bookElement.querySelector('.backImg');
            bookImage.setAttribute('src', `../imgs/book${pictureNum}.gif`);

            let bookAuthor = bookElement.querySelector('#author');
            bookAuthor.innerText = book.writer;

            let bookExplain = bookElement.querySelector('#explain');
            bookExplain.innerText = `${book.writer} 의 시집입니다`;

            let bookHearts = bookElement.querySelector('#thumbCnt');
            bookHearts.innerText = book.hearts;
        } else {
            alert('시집을 조회할 수 없음');
            location.href = './MainPage.html';
        }
    });
}

const showHeartAtBook = (id) => {
    readHeartAtBook(id, (result, heart) => {
        if (result) {
            let heartBtn = document.getElementById('thumbUp');

            if (heart) {
                heartBtn.setAttribute('src', `../imgs/clickLike.png`);
            } else {
                heartBtn.setAttribute('src', `../imgs/like.png`);
            }

            heartBtn.onclick = (e) => {
                editHeartAtBook(id, !heart);
            };
        }
    });
};

const editHeartAtBook = (id, heart) => {
    updateHeartAtBook(id, heart, (result) => {
        if (result) {
            let heartBtn = document.getElementById('thumbUp');

            if (heart) {
                heartBtn.setAttribute('src', `../imgs/clickLike.png`);
            } else {
                heartBtn.setAttribute('src', `../imgs/like.png`);
            }

            showBook(id);

            heartBtn.onclick = (e) => {
                editHeartAtBook(id, !heart);
            };
        }
    });
}

let poemsCover = document.getElementById('poemsBack');

const showPoemsAtBook = (id) => {
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

document.getElementById('mainLogo').onclick = (e) => {
    location.href = './MainPage.html';
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

document.getElementById('searchBtn').onclick = (e) => {
    let word = document.getElementById('searchText').value;

    if (word) {
        localStorage.setItem('Poem-Search-Word', word);
        location.href = './Search.html';
    } else {
        alert('검색어를 입력하세요');
    }
};

showBook(localStorage.getItem('Poem-Book-Id'));
showHeartAtBook(localStorage.getItem('Poem-Book-Id'));
showPoemsAtBook(localStorage.getItem('Poem-Book-Id'));















