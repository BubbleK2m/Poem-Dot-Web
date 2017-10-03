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
            bookElement.innerHTML =
                `<h1>시집 '${book.title}'</h1>
                <img src = "../imgs/poemTest${(id % 6) + 1}.jpg" class = "backImg">
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
            alert('해당 시집을 조회할 수 없습니다.');
            location.href = './MainPage.html';
        }
    });
}

showBook(localStorage.getItem('Poem-Book-Id'));
