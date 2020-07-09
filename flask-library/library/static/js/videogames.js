console.log('Hello from videogames.js');

window.onload = () => {
    loadVideoGame()
    addNavBar(loadVideoGame)
};
videogames = []
function loadVideoGame() {
    console.log('The page has finished rendering')
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = processResponse
    xhttp.open('GET', '/videogames')
    xhttp.send()
    function processResponse() {
       console.log(xhttp.readyState)
       if(xhttp.readyState === 4 && xhttp.status === 200){
           videogames = JSON.parse(xhttp.responseText)
           console.log(videogames)
           populateTable(videogames)
       }
    }
}

function populateTable(videoGameList) {
    table = document.getElementById('videogames')
    table.innerHTML=''
    for (videogame of videoGameList) {
        tr = document.createElement('tr')
        table.appendChild(tr)
        addTableDef(tr, videogame.title)
        addTableDef(tr, videogame.developer)
        addTableDef(tr, videogame.genre)
        addTableDef(tr, videogame.platform)
        addTableDef(tr, videogame.rating)
        addCheckoutButton(tr, videogame.borrower, videogame._id)
    }
}

function addTableVideoGame(tr, value) {
    td = document.createElement("td");
    td.innerHTML = value;
    tr.appendChild(td);
}

function addCheckoutButtonGame(tr, condition, videogame_id) {
    td = document.createElement("td");
    bttn = document.createElement("button");
    bttn.id = "co_" + videogame_id;
    bttn.type = "button";
    bttn.className = "btn btn-primary";
    bttn.disabled = condition;
    bttn.innerHTML = "Checkout Videogame";
    bttn.addEventListener("click", checkoutVideoGame);
    td.appendChild(bttn);
    tr.appendChild(td);
}

function checkoutVideoGame() {
    coButton = event.target
    id = coButton.id.substring('co_'.length)
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = processResponse
    xhttp.open('POST', '/videogames/'+id+'/borrower')
    xhttp.setRequestHeader('Content-type',
            'application/json');
    xhttp.send(JSON.stringify(loggedUser))
    function processResponse() {
        if(xhttp.readyState === 4 && xhttp.status === 200){
            coButton.disabled = true
        }
    }
}
