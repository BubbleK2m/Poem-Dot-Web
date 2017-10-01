let heartedBookCover = document.getElementById('likePoemCover');
let seeHeartedMoreCover = document.getElementById('seeLikeMoreCover');

let recommendBookCover = document.getElementById('recommendPoemCover');
let seeRecommendMoreCover = document.getElementById('seeRecommendMoreCover');

function readMyBooks (page, length, callback) {
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

function showHeartedBooks(page, length) {
    readHeartedBooks(page, length, (result, books) => {
        if (result) {
            if (books.length < 3) {
                seeHeartedMoreCover.style.display = 'none';
            } else {
                seeHeartedMoreCover.style.display = '';
                seeHeartedMoreCover.onclick = (e) => {
                    showHeartedBooks(page + 1, length);
                };
            }

            for (let book of books) {
                let bookElement = document.createElement('div');
                bookElement.setAttribute('class', 'likePoems');

                let bookContent = 
                    `<div class = "likePoemPics" id = "firstLike">
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
                heartedBookCover.appendChild(bookElement);
            }
        } else {
            alert(`have not anything hearted books`);
        }
    });
}

function showPopularBooks (page, length) {
    readPopularBooks(page, length, (result, books) => {
        if (result) {
            if (books.length < 3) {
                seeRecommendMoreCover.style.display = 'none';
            } else {
                seeRecommendMoreCover.style.display = '';
                seeRecommendMoreCover.onclick = (e) => {
                    showRecommendBooks(page + 1, length);
                };
            }

            for (let book of books) {
                let bookElement = document.createElement('div');
                bookElement.setAttribute('class', 'recommendPoems');

                let bookContent = 
                    `<div class = "recommendPoemPics" id = "firstLikeR">
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
                recommendBookCover.appendChild(bookElement);
            }
        } else {
            alert(`have not anything popular books`);
        }
    });
}

showHeartedBooks(1, 3);
showPopularBooks(1, 3);