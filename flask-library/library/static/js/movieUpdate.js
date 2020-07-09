window.onload = () => {
    addNavBar(()=>{})
    document.getElementById('length').onkeydown = validateLength
    let id = window.location.pathname.split("/")[2]
    loadMovie(id)
    document.getElementById('cancel_button').onclick = () => {
        window.location.replace('/movieslist')
    }
    document.getElementById('submit_button').addEventListener('click', event => {
        event.preventDefault()
        submitMovieUpdate()
    })
}

function loadMovie(id) {
    movie = null
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = processMovie
    xhttp.open('GET', '/movies/' + id)
    xhttp.send()
    function processMovie() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            movie = JSON.parse(xhttp.responseText)
            populateForm(movie)
        }
    }
}
function populateForm(movie) {
    document.getElementById('title').value = movie.title
    document.getElementById('director').value = movie.director
    document.getElementById('genre').value = movie.genre
    document.getElementById('rating').value = movie.rating
    document.getElementById('actors').value = movie.actors.join(', ')
    document.getElementById('length').value = movie.length
}
function submitMovieUpdate() {
    let id = window.location.pathname.split("/")[2]
    let updateObject = {}
    updateObject['_id'] = parseInt(id)
    updateObject['title'] = document.getElementById('title').value
    updateObject['director'] = document.getElementById('director').value
    updateObject['genre'] = document.getElementById('genre').value
    updateObject['rating'] = document.getElementById('rating').value
    updateObject['actors'] = document.getElementById('actors').value.split(', ')
    updateObject['length'] = document.getElementById('length').value
    console.log('editing a movie' + id)

    // xhttp = new XMLHttpRequest()
    // xhttp.onreadystatechange = processResponse
    // xhttp.open('PUT', '/movies/'+id)
    // console.log(updateObject)
    // xhttp.send(JSON.stringify(updateObject))
    // function processResponse() {
    //     console.log(xhttp.readyState)
    //     if(xhttp.readyState === 4 && xhttp.status === 200){
    //         // Response is ready and successful!
    //         window.location.replace('/movielist')
    //     }
    //  }

    fetch('/movies/' + id, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateObject)
    }).then((response) => {
        if (response.status === 200) {
            window.location.replace('/movieslist')
        }
    },
    (error) => {
        alert(error)
    });
}


function validateLength() {
    return event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key))
}
