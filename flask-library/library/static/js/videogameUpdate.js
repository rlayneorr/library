window.onload = () => {
    addNavBar(()=>{})
    let id = window.location.pathname.split("/")[2]
    loadVideogame(id)
    document.getElementById('cancel_button').onclick = () => {
        window.location.replace('/videogamelist')
    }
    document.getElementById('submit_button').addEventListener('click', event => {
        event.preventDefault()
        submitVideogameUpdate()
    })
}

function loadVideogame(id) {
    fetch('/videogame/' + id, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.status === 200) {
            videogame = JSON.parse(response)
            populateForm(videogame)
        }
    });
    // book = null
    // xhttp = new XMLHttpRequest()
    // xhttp.onreadystatechange = processVideogame
    // xhttp.open('GET', '/videogame/' + id)
    // xhttp.send()
    // function processVideogame() {
    //     if (xhttp.readyState===4 && xhttp.status === 200){
    //         videogame = JSON.parse(xhttp.responseText)
    //         populateForm(videogame)
    //     }
    // }
}
function populateForm(videogame) {
    document.getElementById('title').value = videogame.title 
    document.getElementById('developer').value = videogame.developer
    document.getElementById('genre').value = videogame.genre
    document.getElementById('platform').value = videogame.platform
    document.getElementById('rating').value = videogame.rating
}
function submitVideogameUpdate() {
    let id = window.location.pathname.split("/")[2]
    let updateObject = {}
    updateObject['_id'] = parseInt(id)
    updateObject['title'] = document.getElementById('title').value
    updateObject['developer'] = document.getElementById('developer').value
    updateObject['genre'] = document.getElementById('genre').value
    updateObject['platform'] = document.getElementById('platform').value
    updateObject['rating'] = document.getElementById('rating').value
    console.log('editing a videogame' + id)

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

    fetch('/videogames/'+id, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateObject)
    }).then((response) => {
        if (response.status === 200) {
            window.location.replace('/videogamelist')
        }
    });
}