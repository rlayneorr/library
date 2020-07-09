bookForm = `
<label>Author:</label>
<input type="text" id="author" name="author" />
<label>isbn:</label>
<input type="text" id="isbn" name="isbn" />
`

movieForm = `
<label>Director:</label>
<input type="text" name="director" id="director" />
<label>Rating:</label>
<select id="rating" name="Rating">
<option value="G">G</option>
<option value="PG">PG</option>
<option value="PG13">PG13</option>
<option value="R">R</option>
<option value="NC17">NC17</option>
</select>
<label>Actors:</label>
<input type="text" name="actors" id="actors" />
<label>Length:</label>
<input type="number" name="length" id="length" min="1" max="250" />
`

videogameForm = `
<label>Developer</label>
<input type="text" name="developer" id="developer" />
<label>Rating:</label>
<input type="text" name="rating" id="rating"/>
<label>Platform:</label>
<input type="text" name="platform" id="platform" />
`

media_type = null

window.onload = () => {
    document.getElementById('selectMedia').addEventListener('change',() =>{
        media_type = document.getElementById('selectMedia').value
        console.log(media_type)
        show_fields(media_type)
    })
    document.getElementById('submitForm').addEventListener('click', () => {
        // event.preventDefault()
        sendNewMedia()
    })
}

function show_fields(media_type){
    if (media_type === 'Book'){
        document.getElementById('typeSpecific').innerHTML = bookForm;
    }
    else if(media_type === 'Movie') {
        document.getElementById('typeSpecific').innerHTML = movieForm;
        document.getElementById('length').onkeydown = validateLength
    }
    else {
        document.getElementById('typeSpecific').innerHTML = videogameForm;
    }
}

function sendNewMedia(){
    newMedia = {}
    newMedia['media_type'] = media_type
    newMedia['title'] = document.getElementById('title').value
    newMedia['genre'] = document.getElementById('genre').value

    if (media_type === 'Book'){
        newMedia['author'] = document.getElementById('author').value
        newMedia['isbn'] = document.getElementById('isbn').value
    }
    else if(media_type === 'Movie') {
        newMedia['director'] = document.getElementById('director').value
        newMedia['rating'] = document.getElementById('rating').value
        newMedia['actors'] = document.getElementById('actors').value.split(', ')

        newMedia['length'] = document.getElementById('length').value

    }
    else {
        newMedia['developer'] = document.getElementById('developer').value
        newMedia['rating'] = document.getElementById('rating').value
        newMedia['platform'] = document.getElementById('platform').value

    }
    console.log(newMedia)
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = processResponse
    xhttp.open('POST', '/media')
    xhttp.setRequestHeader('Content-type',
            'application/json');
    xhttp.send(JSON.stringify(newMedia))

    function processResponse(){
        console.log(xhttp.status)
        if(xhttp.readyState === 4 && xhttp.status === 201){
            console.log("Successful")
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            console.log("Unsuccessful")
            xhr = JSON.parse(xhttp.responseText)
            alert(xhr)
        }
    }

}

function validateLength() {
    return event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key))
}