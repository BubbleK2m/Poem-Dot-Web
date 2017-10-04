function readPoem (id, callback) {
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

    xhr.open('GET', `http://52.43.254.152/poem/${id}`, true);
    xhr.send(null);
}

let poemCover = document.getElementById('seePoemCover');

function showPoem(id) {
    readPoem(id, (result, poem) => {
        if (result) {
            let pictureNum = id < 5 ? 5 % id : id % 5 + 1;

            let poemContent = 
                ` <div class = "twoParts" id = "imgPart">
                    <img src = "../imgs/poem${pictureNum}.jpg" class = "poemImg">
                </div>
                <div class = "twoParts" id = "textPart">
                    <h1>${poem.title}</h1>
                    <h2>${poem.writer}</h2>
                    <!-- 시 내용 -->
                    <p>${poem.content.split('\n').join('<br>')}</p>
                    <div id = "listBtn">
                        목록
                    </div>
                </div>`;

            poemCover.innerHTML = poemContent;

            let listBtn = poemCover.querySelector('#listBtn');
            
            listBtn.onclick = (e) => {
                localStorage.setItem('Poem-Book-Id', poem.book);
                location.href = 'Book.html';
            };
        } else {
            alert('시를 조회할 수 없습니다.');
            location.href = './MainPage.html';
        }
    });
}

showPoem(localStorage.getItem('Poem-Poem-Id'));

