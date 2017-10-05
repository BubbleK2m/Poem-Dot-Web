function readPoem(id, callback) {
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
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));

    xhr.send(null);
}

let poemCover = document.getElementById('seePoemCover');

const showPoem = (id) => {
    readPoem(id, (result, poem) => {
        if (result) {
            let imageCover = document.createElement('div');
            imageCover.setAttribute('class', 'twoParts');
            imageCover.setAttribute('id', 'imgPart');
        
            let poemImg = document.createElement('img')
            poemImg.setAttribute('class', 'poemImg');
        
            let pictureNum = id > 5 ? id % 5 + 1 : 5 % id + 1;
            poemImg.setAttribute('src', `../imgs/poem${pictureNum}.jpg`);

            imageCover.appendChild(poemImg);
        
            let contentCover = document.createElement('div');
            contentCover.setAttribute('class', 'twoParts');
            contentCover.setAttribute('id', 'textPart');
        
            let poemTitle = document.createElement('h1');
            poemTitle.innerText = poem.title;
        
            let poemWriter= document.createElement('h2');
            poemWriter.innerText = poem.writer;
        
            let poemContent = document.createElement('p');
            poemContent.innerHTML = poem.content.split('\n').join('<br>');
        
            let listBtn = document.createElement('div');
            listBtn.setAttribute('id', 'listBtn');
            listBtn.innerText = '목록';
            
            listBtn.onclick = (e) => {
                localStorage.setItem('Poem-Book-Id', poem.book);
                location.href = './Book.html';
            };
        
            contentCover.appendChild(poemTitle);
            contentCover.appendChild(poemWriter);
            contentCover.appendChild(poemContent);
            contentCover.appendChild(listBtn);
            
            poemCover.appendChild(imageCover);
            poemCover.appendChild(contentCover);
        } else {
            alert('시를 조회할 수 없습니다.');
            location.href = './MainPage.html';
        }
    });
};

showPoem(localStorage.getItem('Poem-Poem-Id'));