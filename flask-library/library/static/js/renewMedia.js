window.onload = () => {
    addNavBar(loadMedia)
}


// CODE FROM JSRENEW BRANCH

books = []
function loadMedia() {
    console.log('The page has finished rendering')
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = processResponse
    xhttp.open('GET', '/media?borrower=' + loggedUser.username)
    xhttp.send()
    function processResponse() {
        console.log(xhttp.readyState)
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            books = JSON.parse(xhttp.responseText)
            populateTable(books)
        }
    }
}

function populateTable(bookList) {
    table = document.getElementById('books')
    for (book of bookList) {
        tr = document.createElement('tr')
        table.appendChild(tr)
        addTableDef(tr, book.title)
        if (book.author) {
            addTableDef(tr, 'Book')
        } else {
            if (book.director) {
                addTableDef(tr, 'Movie')
            } else {
                if(book.developer) {
                    addTableDef(tr, 'VideoGame')
                }
                else {
                    addTableDef(tr, 'UNDEFINED')
                }
            }
        }

        addTableDef(tr, book.checkout_date)
        addTableDef(tr, book.return_date)
        addRenewButton(tr, book.borrower, book._id)
        addCheckinButton(tr, book._id)
    }
}
function addTableDef(tr, value) {
    td = document.createElement('td')
    td.innerHTML = value
    tr.appendChild(td)
}
function addRenewButton(tr, condition, book_id) {
    td = document.createElement('td')
    bttn = document.createElement('button')
    if (book.director) {
        bttn.id = '/movies/' + book_id
    } else if(book.developer) {
        bttn.id = '/videogames/' + book_id
    }
    else {
        bttn.id = '/books/' + book_id
    }
    bttn.type = 'button'
    bttn.className = 'btn btn-success'
    bttn.innerHTML = 'Renew Book'
    bttn.addEventListener('click', renewBook)
    td.appendChild(bttn)
    tr.appendChild(td)
}
function renewBook() {
    id = event.target.id
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = processResponse
    xhttp.open('PUT', id + '/borrower')
    xhttp.setRequestHeader('Content-type',
            'application/json');
    xhttp.send(JSON.stringify(loggedUser))
    function processResponse() {

        console.log(xhttp.readyState)
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            event.target.disabled = true

        }
    }
}

function addCheckinButton(tr, book_id) {
    td = document.createElement('td')
    bttn = document.createElement('button')
    if (book.director) {
        bttn.id = '/movies/' + book_id
    } else if(book.developer) {
        bttn.id = '/videogames/' + book_id
    }
    else {
        bttn.id = '/books/' + book_id
    }
        
    
    bttn.type = 'button'
    bttn.className = 'btn btn-success'
    bttn.innerHTML = 'Checkin Book'
    bttn.addEventListener('click', checkinBook)
    td.appendChild(bttn)
    tr.appendChild(td)
}
function checkinBook() {
    id = event.target.id
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = processResponse
    
    xhttp.open('DELETE', id + '/borrower')
    xhttp.setRequestHeader('Content-type',
            'application/json');
    xhttp.send();
    function processResponse() {

        console.log(xhttp.readyState)
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            document.getElementById('books').innerHTML = ''
            loadMedia()
        }
    }
}
