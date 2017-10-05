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

const showMyPoems = () => {
    readMyPoems((result, poems) => {
        if (result) {
            let poemsCover = document.getElementById('selectPoemCover');

            for (let poem of poems) {
                let poemElement = document.createElement('div');
                poemElement.setAttribute('class', 'selectPoems');
                
                let pictureNum = poem.id <= 5 ? poem.id : poem.id % 5;
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
                poemsCover.appendChild(poemElement);
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

                let pictureNum = book.id <= 4 ? book.id : book.id % 4;
                realImg.setAttribute('src', `../imgs/book${pictureNum}.gif`);
    
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

                let bookCover;

                if ((i + 1) % 2 === 1) {
                    bookCover = document.createElement('div');
                    bookCover.setAttribute('class', 'bookCover');

                    bookCover.appendChild(bookElement);
                    booksCover.appendChild(bookCover);
                } else {
                    bookCover = document.getElementsByClassName('bookCover')[(i + 1) / 2 - 1];
                    bookCover.appendChild(bookElement);
                }
            }
        } else {
            moreBooksBtn.style.display = 'none';
        }
    });
};

document.getElementById('createNewPoem').onclick = (e) => {
    location.href = './WritePoem.html';
};

document.getElementById('createNewBook').onclick = (e) => {
    location.href = './PublishBook.html';
};

showMyPoems();
showMyBooks(1, 2);
showMyBooks(2, 2);