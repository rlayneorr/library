 console.log('Hello from books.js');
/* Events
    An event is an entity that waits for something to occur and then executes a function
    
    element.oneventlistener = callback
    element.addEventListener('event-name', callback, capture_flag)
*/

// single line comment
// window.addEventListener('load', thing)
window.onload = () => {
    addNavBar(loadBook);
    loadBook();
}

books = []

function loadBook() {
    console.log('The page has finished rendering')
    // addNavBar()
    // AJAX - Asychronous JavaScript and XML

    // Step 1: Create an XML Http Request object
    xhttp = new XMLHttpRequest()
    // Step 2: Assign a callback function to the ready state change event
    xhttp.onreadystatechange = processResponse
    // Step 3: Open the request to the correct location
    xhttp.open('GET', '/books')
    // Step 4: Send the request
    xhttp.send()
    function processResponse() {
       console.log(xhttp.readyState)
       if(xhttp.readyState === 4 && xhttp.status === 200){
           // Response is ready and successful!
           books = JSON.parse(xhttp.responseText)
           console.log(books)
           populateTable(books)
       }
    }
}

function populateTable(bookList) {
    table = document.getElementById('books')
    table.innerHTML=''
    for (book of bookList) {
        tr = document.createElement('tr')
        table.appendChild(tr)
        addTableDef(tr, book.title)
        addTableDef(tr, book.author)
        addTableDef(tr, book.genre)
        addTableDef(tr, book.isbn)
        addBookCheckoutButton(tr, book.borrower, book._id)
        if (loggedUser && loggedUser.role == "Librarian") {
            addEditButton(tr, book._id)
        }
    }
}
function addTableDef(tr, value) {
    td = document.createElement('td')
    td.innerHTML=value
    tr.appendChild(td)
}
function addBookCheckoutButton(tr, condition, book_id) {
    td = document.createElement('td')
    bttn = document.createElement('button')
    bttn.id = 'co_'+book_id
    bttn.type = 'button'
    bttn.className = 'btn btn-primary'
    bttn.disabled = condition
    bttn.innerHTML = 'Checkout Book'
    bttn.addEventListener('click', checkoutBook)
    td.appendChild(bttn)
    tr.appendChild(td)
}

function addEditButton(tr, book_id) {
    td = document.createElement('td')
    bttn = document.createElement('button')
    bttn.id = 'b_'+book_id
    bttn.type = 'button'
    bttn.className = 'btn btn-primary'
    bttn.innerHTML = 'EDIT'
    bttn.addEventListener('click', editBook)
    td.appendChild(bttn)
    tr.appendChild(td)
}

function checkoutBook() {
    coButton = event.target
    id = coButton.id.substring('co_'.length)
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = processCheckoutResponse
    xhttp.open('POST', '/books/'+id+'/borrower')
    xhttp.setRequestHeader('Content-type',
            'application/json');
    xhttp.send(JSON.stringify(loggedUser))
    function processCheckoutResponse() {
        // It's important that the callback function has closure to the xhttp object
       console.log(xhttp.readyState)
       if(xhttp.readyState === 4 && xhttp.status === 200){
           // Response is ready and successful!
           coButton.disabled = true
       }
    }
}

function editBook() {
    id = event.target.id.substring('b_'.length)
    window.location = "edit-book/" + id
}