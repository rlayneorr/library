window.onload = () => {
    addNavBar(() => { })
    let id = window.location.pathname.split("/")[2]
    loadBook(id)
    document.getElementById('cancel_button').onclick = () => {
        window.location.replace('/booklist')
    }
    document.getElementById('submit_button').addEventListener('click', event => {
        event.preventDefault()
        submitBookUpdate()
    })
    document.getElementById('isbn').addEventListener('onkeydown', ()=> {
        validateISBN()
    })
    document.getElementById('genre').addEventListener('onkeydown', () => {
        validateGenre()
    })
}

function loadBook(id) {
    book = null;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = processBook;
    xhttp.open('GET', '/books/' + id);
    xhttp.send();
    function processBook() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            book = JSON.parse(xhttp.responseText);
            populateForm(book);
        }
    }
}
function populateForm(book) {
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('genre').value = book.genre;
    document.getElementById('isbn').value = book.isbn;
}

function validateISBN() {
    isbnRegEx = RegExp('[0-9]{13}', 'g');
    isbn = document.getElementById('isbn');
    let submitButton = document.getElementById('submit_button')
    if (isbnRegEx.test(isbn.value)) {
        if (isbn.classList.contains('is-invalid')) isbn.classList.remove('is-invalid');
        // submitButton.disabled = true;
        return true;
    } else {
        if (!isbn.classList.contains('is-invalid')) isbn.classList.add('is-invalid');
        // submitButton.disabled = false;
        return false;
    }
}

function validateGenre() {
    genreRegEx = RegExp('([\w]*[\s]?)+', 'g'); // one or more of any number of letters followed by 0 or 1 whitespace
    genre = document.getElementById('genre');
    let submitButton = document.getElementById('submit_button')
    if (genreRegEx.test(genre.value)) {
        if (genre.classList.contains('is-invalid')) isbn.classList.remove('is-invalid');
        // submitButton.disabled = true;
        return true;
    } else {
        if (!genre.classlist.contains('is-invalid')) genre.classList.add('is-invalid');
        // submitButton.disabled = false;
        return false;
    }
}

function validateBookUpdate() {
    if (validateGenre() && validateISBN()) {
        // submitButton should be enbled
        return true;
    } else {
        // submitButton should be disabled
        return false;
    }
}

function submitBookUpdate() {
    if (validateBookUpdate()) {
        document.getElementById('alert_holder').innerHTML = '';
        let id = window.location.pathname.split("/")[2]
        let updateObject = {}
        updateObject['_id'] = parseInt(id)
        updateObject['title'] = document.getElementById('title').value
        updateObject['author'] = document.getElementById('author').value
        updateObject['genre'] = document.getElementById('genre').value
        updateObject['isbn'] = document.getElementById('isbn').value
        console.log('editing a book' + id)

        // xhttp = new XMLHttpRequest()
        // xhttp.onreadystatechange = processResponse
        // xhttp.open('PUT', '/books/'+id)
        // console.log(updateObject)
        // xhttp.send(JSON.stringify(updateObject))
        // function processResponse() {
        //     console.log(xhttp.readyState)
        //     if(xhttp.readyState === 4 && xhttp.status === 200){
        //         // Response is ready and successful!
        //         window.location.replace('/booklist')
        //     }
        //  }
        fetch('/books/' + id, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateObject)
        }).then((response) => {
            if (response.status === 200) {
                window.location.replace('/booklist')
            }
        },
    (error) => {
        alert(error)
    });
    } else {
        document.getElementById('alert_holder').innerHTML = `
        <div class="alert alert-warning" role="alert">
            Something is wrong!
        </div>`
    }
}