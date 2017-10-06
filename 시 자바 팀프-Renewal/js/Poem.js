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
    
    xhr.open('GET', 'http://52.43.254.152/member/poems', false);
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));
    
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

    xhr.open('GET', `http://52.43.254.152/book/${id}/poems`, false);
    xhr.send(null);
}

const showPoem = (id) => {
    readPoem(id, (result, poem) => {
        if (result) {
            let poemCover = document.getElementById('seePoemCover');

            let imageCover = document.createElement('div');
            imageCover.setAttribute('class', 'twoParts');
            imageCover.setAttribute('id', 'imgPart');
        
            let poemImg = document.createElement('img')
            poemImg.setAttribute('class', 'poemImg');
        
            let pictureNum = id % 5 === 0 ? 5 : id % 5;
            poemImg.setAttribute('src', `../imgs/poem${pictureNum}.png`);

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
            
            if (poem.book !== 0) {
                listBtn.onclick = (e) => {
                    localStorage.setItem('Poem-Book-Id', poem.book);
                    location.href = './Book.html';
                };
            } else {
                listBtn.onclick = (e) => {
                    location.href = './MyPage.html';
                };
            }
        
            contentCover.appendChild(poemTitle);
            contentCover.appendChild(poemWriter);
            contentCover.appendChild(poemContent);
            contentCover.appendChild(listBtn);
            
            poemCover.appendChild(imageCover);
            poemCover.appendChild(contentCover);

            let poemIds = localStorage.getItem('Poem-Poem-Poems');

            if (!poemIds || poem.book !== localStorage.getItem('Poem-Poem-Book')) {
                localStorage.setItem('Poem-Poem-Book', poem.book);
                poemIds = [];
                
                if (poem.book === 0) {
                    readMyPoems((result, poems) => {
                        if (result) {
                            for (let poem of poems) {
                                poemIds.push(poem.id);
                            }
                        }
                    });
                } else {
                    readPoemsAtBook(poem.book, (result, poems) => {
                        if (result) {
                            for (let poem of poems) {
                                poemIds.push(poem.id);
                            }
                        }
                    });
                }
            } else {
                poemIds = JSON.parse(poemIds);
            }
            
            localStorage.setItem('Poem-Poem-Poems', JSON.stringify(poemIds));
            
            let prevBtn = document.getElementById('leftImg');
            let nextBtn = document.getElementById('rightImg');

            let poemIdx = poemIds.indexOf(id);

            if (poemIdx === 0) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'block';
            } else if (poemIdx === (poemIds.length - 1)) {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }

            if (prevBtn.style.display === 'block') {
                prevBtn.onclick = (e) => {
                    localStorage.setItem('Poem-Poem-Id', poemIds[poemIdx - 1]);
                    location.href = './Poem.html';
                };
            }

            if (nextBtn.style.display === 'block') {
                nextBtn.onclick = (e) => {
                    localStorage.setItem('Poem-Poem-Id', poemIds[poemIdx + 1]);
                    location.href = './Poem.html';
                };
            }
        } else {
            alert('시를 조회할 수 없습니다.');
            location.href = './MainPage.html';
        }
    });
};

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

showPoem(Number(localStorage.getItem('Poem-Poem-Id')));
