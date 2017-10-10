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

function updatePoem(id, title, content, alignment, callback) {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(true);
                location.href = './MyPage.html';
            } else {
                callback(false);
            }
        }
    };

    xhr.open('PUT', `http://52.43.254.152/poem/${id}`, true);
    
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Poem-Session-Key', localStorage.getItem('Poem-Session-Key'));

    xhr.send(`title=${title}&content=${encodeURIComponent(content)}&alignment=${alignment}`);
}

const showPoem = (id) => {
    readPoem(id, (result, poem) => {
        if (result) {
            let titleForm = document.getElementById('poemTitle');
            let contentForm = document.getElementById('poemContent');

            titleForm.value = poem.title;
            contentForm.value = poem.content;

            let alignments = ["left", "center", "right"];
            contentForm.style.textAlign = alignments[poem.alignment - 1];
        } else {
            alert('시를 조회할 수 없습니다.');
            location.href = './MyPage.html';
        }
    });
};

const editPoem = (id, title, content, alignment) => {
    updatePoem(id, title, content, alignment, (result) => {
        if (result) {
            alert('수정 성공');
        } else {
            alert('수정 실패');
        }
    });
};

Array.from(document.getElementsByClassName('setAligns')).forEach((elem, index) => {
    elem.addEventListener('click', () => {
        /* 각각 text-align들 */
        let setIndex = ["left", "center", "right"];
        document.getElementById('poemContent').style.textAlign = setIndex[index];
    });
});

document.getElementById('writeBtn').onclick = (e) => {
    let title = document.getElementById('poemTitle').value;
    let content = document.getElementById('poemContent').value;

    let alignments = ["left", "center", "right"];
    let alignment = alignments.indexOf(document.getElementById('poemContent').style.textAlign) + 1;

    if (!title || !content || !alignment) {
        alert('값이 입력되지 않았습니다');
        return;
    }

    editPoem(localStorage.getItem('Poem-Poem-Id'), title, content, alignment);
};

showPoem(localStorage.getItem('Poem-Poem-Id'));