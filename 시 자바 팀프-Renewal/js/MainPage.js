function readMyPopularBook (callback) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                callback(true, response);
            } else if (xhr.status === 204) {
                callback(true, null);
            } else {
                callback(false, null);
            }
        }
    };

    xhr.open('GET', `http://52.43.254.152/member/book/popular`, true);
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));
    
    xhr.send(null);
}

function readHeartedBooks(page, length, callback) {
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

    xhr.open('GET', `http://52.43.254.152/member/books/hearted?page=${page}&length=${length}`, true);
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));

    xhr.send(null);
}

function readPopularBooks(page, length, callback) {
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

    xhr.open('GET', `http://52.43.254.152/books/popular?page=${page}&length=${length}`, true);
    xhr.send(null);
}

const showMyPopularBook = () => {
    readMyPopularBook((result, book) => {
        if (result) {
            if (book) {
                let bookCover = document.getElementById('poemPart');
                
                let bookTitle = bookCover.querySelector('#title');
                bookTitle.innerText = book.title;
                
                let bookWriter = bookCover.querySelector('#author');
                bookWriter.innerText = book.writer;
                
                let bookExplain = bookCover.querySelector('#explain');
                bookExplain.innerText = `${book.writer} 의 시집입니다.`;
                
                let bookHearts = bookCover.querySelector('#thumbCnt');
                bookHearts.innerText = book.hearts;
                
                let showMoreBtn = document.getElementById('showMore');
                showMoreBtn.onclick = (((book) => {
                    return (e) => {
                        localStorage.setItem('Poem-Book-Id', book.id);
                        location.href = './Book.html';
                    };
                })(book));
            }
        } else {
            alert('회원 정보를 조회할 수 없습니다.');
            location.href = './Landing.html';
        }
    });
};

const showHeartedBooks = (page, length) => {
    readHeartedBooks(page, length, (result, books) => {
        let seeHeartedMoreCover = document.getElementById('seeLikeMoreCover');

        if (result) {
            if (books.length < 3) {
                seeHeartedMoreCover.style.display = 'none';
            } else {
                seeHeartedMoreCover.style.display = '';
                seeHeartedMoreCover.onclick = (e) => {
                    showHeartedBooks(page + 1, length);
                };
            }

            let heartedBookCover = document.getElementById('likePoemCover');

            for (let book of books) {
                let bookElement = document.createElement('div');
                bookElement.setAttribute('class', 'likePoems');   
                
                let pictureNum = book.id % 4 === 0 ? 4 : book.id % 4;

                let bookContent = 
                    `<div class = "likePoemPics" style="background-image: url(../imgs/book${pictureNum}.gif)">
                        <div class = "hoverAnim">
                            <p>
                                <span class = "likeAuthor">
                                    ${book.writer}
                                </span>
                                <br>
                                <span class = "likeCount">
                                    ${book.hearts}
                                </span> 좋아요
                                <br>
                                <span class = "likeDate">
                                    2017/09/28
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class = "likePoemTitle">
                        <div class = "poemTitle">
                            ${book.title}    
                        </div>
                    </div>`;
                                
                bookElement.innerHTML = bookContent;

                bookElement.onclick = (e) => {
                    localStorage.setItem('Poem-Book-Id', book.id);
                    location.href = './Book.html'
                };

                heartedBookCover.appendChild(bookElement);
            }
        } else {
            seeHeartedMoreCover.style.display = 'none';
        }
    });
}

const showPopularBooks = (page, length) => {
    readPopularBooks(page, length, (result, books) => {
        let seeRecommendMoreCover = document.getElementById('seeRecommendMoreCover');

        if (result) {
            if (books.length < 3) {
                seeRecommendMoreCover.style.display = 'none';
            } else {
                seeRecommendMoreCover.style.display = '';
                seeRecommendMoreCover.onclick = (e) => {
                    showPopularBooks(page + 1, length);
                };
            }

            let recommendBookCover = document.getElementById('recommendPoemCover');

            for (let book of books) {
                let bookElement = document.createElement('div');
                bookElement.setAttribute('class', 'recommendPoems');

                let pictureNum = book.id % 4 === 0 ? 4 : book.id % 4;

                let bookContent = 
                    `<div class = "recommendPoemPics" style="background-image: url(../imgs/book${pictureNum}.gif)">
                        <div class = "hoverAnim">
                            <p>
                                <span class = "recommendAuthor">
                                    ${book.writer}
                                </span>
                                <br>
                                <span class = "recommendCount">
                                    ${book.hearts}
                                </span> 좋아요
                                <br>
                                <span class = "recommendDate">
                                    2017/05/31
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class = "recommendPoemTitle">
                        <div class = "poemTitle">
                            ${book.title}    
                        </div>
                    </div>`;
                                
                bookElement.innerHTML = bookContent;

                bookElement.onclick = (e) => {
                    localStorage.setItem('Poem-Book-Id', book.id);
                    location.href = './Book.html'
                };

                recommendBookCover.appendChild(bookElement);
            }
        } else {
            seeRecommendMoreCover.style.display = 'none';
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

showMyPopularBook();
showHeartedBooks(1, 3);
showPopularBooks(1, 3);