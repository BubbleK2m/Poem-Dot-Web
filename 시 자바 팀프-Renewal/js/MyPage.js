function readMyInfo(callback) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                callback(true, response);
            } else {
                callback(false, null);
            }
        }
    };

    xhr.open('GET', 'http://52.43.254.152/member', true);
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));

    xhr.send(null);
}

function readMyPoems(callback) {
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

function readMyBooks(page, length, callback) {
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
    
    xhr.open('GET', `http://52.43.254.152/member/books?page=${page}&length=${length}`, true);
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));
    
    xhr.send(null);
}

function updateMyComment(comment, callback) {
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
    
    xhr.open('PUT', `http://52.43.254.152/member/comment`, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));
    
    xhr.send(`comment=${ encodeURIComponent(comment) }`);
}

const showMyInfo = () => {
    readMyInfo((result, me) => {
        if (result) {
            let myCover = document.getElementById('myCover');
            
            if (me.comment) {
                let myComment = myCover.querySelector('#oneIntro > span');;
                myComment.innerText = `${me.comment}`;
            }

            let myName = myCover.querySelector('#nickname > span');
            myName.innerText = `${me.name}`;

            let myEmail = myCover.querySelector('#id > span');
            myEmail.innerText = `${me.email}`;

            let myPoemsCnt = myCover.querySelector('#poemNum > span');
            myPoemsCnt.innerText = `${me.poems}개`;

            let myBooksCnt = myCover.querySelector('#bookNum > span');
            myBooksCnt.innerText = `${me.books}권`;
        } else {
            alert('내 정보를 불러올 수 없습니다');
            location.href = 'Landing.html';
        }
    });
}
 
const showMyPoems = () => {
    readMyPoems((result, poems) => {
        if (result) {
            let poemsCover = document.getElementById('poemsCover');

            for (i = 0; i < poems.length; i++) {
                let poem = poems[i];

                let poemElement = document.createElement('div');
                poemElement.setAttribute('class', 'selectPoems');
                
                let pictureNum = poem.id % 5 === 0 ? 5 : poem.id % 5;
                poemElement.style.backgroundImage = `url(../imgs/poem${pictureNum}.png)`;
            
                let poemTitle = document.createElement('div');
                poemTitle.setAttribute('class', 'poemName');
                poemTitle.innerText = poem.title;
        
                poemElement.onclick = (((poem) => {
                    return (e) => {
                        localStorage.setItem('Poem-Poem-Id', poem.id);
                        location.href = './Poem.html';
                    };
                })(poem));
    
                poemElement.appendChild(poemTitle);
                
                let poemCover;

                if ((i + 1) % 5 === 1) {
                    poemCover = document.createElement('div');
                    poemCover.setAttribute('class', 'poemCover');

                    poemCover.appendChild(poemElement);
                    poemsCover.appendChild(poemCover);
                } else {
                    poemCover = document.getElementsByClassName('poemCover')[Math.trunc(i / 5)];
                    poemCover.appendChild(poemElement);
                }
            }
        } else {   
        }
    });
};

const showMyBooks = (page, length) => {
    readMyBooks(page, length, (result, books) => {
        let moreBooksBtn = document.getElementById('seeMoreBook');

        if (result) {    
            if (books.length === length) {
                moreBooksBtn.style.display = '';

                moreBooksBtn.onclick = (e) => {
                    showMyBooks(page + 1, length);
                };
            } else {
                moreBooksBtn.style.display = 'none';
            }

            let booksCover = document.getElementById('booksCover');

            for (let i = 0; i < books.length; i++) {
                let book = books[i];

                let bookElement = document.createElement('div');
                bookElement.setAttribute('class', 'books');
    
                let bookImg = document.createElement('div');
                bookImg.setAttribute('class', 'bookImgs');
    
                let realImg = document.createElement('img');
                
                realImg.setAttribute('class', 'realImgs');
                realImg.setAttribute('src', `http://52.43.254.152/book/${book.id}/image`);
    
                bookImg.appendChild(realImg);
                bookElement.appendChild(bookImg);
    
                let bookContent = document.createElement('div');
                bookContent.setAttribute('class', 'bookEx');
    
                let bookTitle = document.createElement('h1');
                bookTitle.innerText = book.title;
    
                let bookWriter = document.createElement('h2');
                bookWriter.innerText = book.writer;
    
                let bookLikes = document.createElement('h2');
                bookLikes.innerText = `${book.hearts} 좋아요`;
    
                bookContent.appendChild(bookTitle);
                bookContent.appendChild(bookWriter);
                bookContent.appendChild(bookLikes);
    
                bookElement.appendChild(bookContent);

                bookElement.onclick = (((book) => {
                    return (e) => {
                        localStorage.setItem('Poem-Book-Id', book.id);
                        location.href = './Book.html';
                    };
                })(book))

                let bookCover;
                let index = (page - 1) * length + i;

                if ((index + 1) % 2 === 1) {
                    bookCover = document.createElement('div');
                    bookCover.setAttribute('class', 'bookCover');

                    bookCover.appendChild(bookElement);
                    booksCover.appendChild(bookCover);
                } else {
                    bookCover = document.getElementsByClassName('bookCover')[Math.trunc(index / 2)];
                    bookCover.appendChild(bookElement);
                }
            }
        } else {
            moreBooksBtn.style.display = 'none';
        }
    });
};

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

document.getElementById('createNewPoem').onclick = (e) => {
    location.href = './WritePoem.html';
};

document.getElementById('createNewBook').onclick = (e) => {
    location.href = './PublishBook.html';
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

let changeBtn = document.getElementById('changeImg');
changeBtn.addEventListener('click', () => {
    let content = document.getElementById('content');

    content.setAttribute("contenteditable", "true");
    content.style.textDecoration = "underline";

    content.onkeydown = (e) => {
        if (e.target.innerText.length >= 19) {
            e.preventDefault();
        }
        
        if(e.keyCode == "13"){
            updateMyComment(content.innerText, (result) => {
                if (result) {
                    content.setAttribute("contenteditable", "false");
                    content.style.textDecoration = defaultStatus;
                } else {
                    alert("수정 실패");
                }
            });

            return false;
        }
    }
});

showMyInfo();
showMyPoems();
showMyBooks(1, 2);