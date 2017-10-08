function readBooksByWord(word, callback) {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                callback(true, response.data);
            } else if (xhr.status === 204) {
                callback(true, null);
            } else {
                callback(false, null);
            }
        }
    };

    xhr.open('GET', `http://52.43.254.152/search/books?word=${encodeURIComponent(word)}`, true);
    xhr.send(null);
}

const showBooksByWord = (word) => {
    readBooksByWord(word, (result, books) => {
        if (result) {
            if (books) {
                let searchedWord = document.getElementById('searchedText');
                searchedWord.innerText = word;

                let searchedCnt =  document.getElementById('searchedCnt');
                searchedCnt.innerText = books.length;

                let booksCover = document.getElementById('searchCover');

                for (let book of books) {
                    let bookElement = document.createElement('div');
                    bookElement.setAttribute('class', 'searches');

                    let imageCover = document.createElement('div');
                    imageCover.setAttribute('class', 'searchPicPart');

                    let bookImage = document.createElement('img');
                    bookImage.setAttribute('class', 'searchImgs');

                    let pictureNum = book.id % 4 === 0 ? 4 : book.id % 4;

                    bookImage.setAttribute('src', `../imgs/book${pictureNum}.gif`);

                    imageCover.appendChild(bookImage);

                    let contentCover = document.createElement('div');
                    contentCover.setAttribute('class', 'searchTextPart');

                    let bookTitle = document.createElement('h3');
                    bookTitle.setAttribute('class', 'searchTitles');

                    bookTitle.innerHTML = `<span>${book.title}</span>`;

                    let bookWriter = document.createElement('h3');
                    bookWriter.setAttribute('class', 'searchAuthors');

                    bookWriter.innerHTML = `<span>${book.writer}</span>`;

                    let bookHearts = document.createElement('h3');
                    bookHearts.setAttribute('class', 'searchLikes');
                    
                    bookHearts.innerHTML = `<span>${book.hearts}</span> 좋아요`;

                    contentCover.appendChild(bookTitle);
                    contentCover.appendChild(bookWriter);
                    contentCover.appendChild(bookHearts);

                    let showBtn = document.createElement('div');
                    showBtn.setAttribute('class', 'searchBtns');

                    let showBtnText = document.createElement('div');
                    
                    showBtnText.setAttribute('class', 'searchBtnText');
                    showBtnText.innerText = '보기';

                    showBtn.appendChild(showBtnText);

                    showBtn.onclick = (((book) => {
                        return (e) => {
                            localStorage.setItem('Poem-Book-Id', book.id);
                            location.href = './Book.html';
                        };
                    })(book));

                    bookElement.appendChild(imageCover);
                    bookElement.appendChild(contentCover);
                    bookElement.appendChild(showBtn);

                    booksCover.appendChild(bookElement);
                }
            }
        } else {
            alert('시집을 검색할 수 없습니다.');
            location.href = './MainPage.html';
        }
    });
}

document.getElementById('searchBtn').onclick = (e) => {
    let word = document.getElementById('searchText').value;

    if (word) {
        localStorage('Poem-Search-Word', word);
        location.href = './Search.html';
    } else {
        alert('검색어를 입력하세요');
    }
};

showBooksByWord(localStorage.getItem('Poem-Search-Word'));