console.log("Hello from movies");

window.onload = () => {
  addNavBar(loadMovie);
  loadMovie();
}
movies = [];

function loadMovie() {
  console.log("That page has finished rendering");
  // addNavBar();
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = processResponse;
  xhttp.open("GET", "/movies");
  xhttp.send();
  function processResponse() {
    console.log(xhttp.readyState);
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      movies = JSON.parse(xhttp.responseText);
      console.log(movies);
      populateTableMovies(movies);
    }
  }
}

function populateTableMovies(movieList) {
  table = document.getElementById("movies");
  table.innerHTML=''
  for (movie of movieList) {
    tr = document.createElement("tr");
    table.appendChild(tr);
    addTableMovie(tr, movie.title);
    addTableMovie(tr, movie.genre);
    addTableMovie(tr, movie.director);
    addTableMovie(tr, movie.rating);
    addTableMovie(tr, movie.length);
    addCheckoutButtonMovie(tr, movie.borrower, movie._id)
    if (loggedUser && loggedUser.role == "Librarian") {
      addEditButton(tr, movie._id)
  }
  }
}

function addTableMovie(tr, value) {
  td = document.createElement("td");
  td.innerHTML = value;
  tr.appendChild(td);
}

function addCheckoutButtonMovie(tr, condition, movie_id) {
  td = document.createElement("td");
  bttn = document.createElement("button");
  bttn.id = "co_" + movie_id;
  bttn.type = "button";
  bttn.className = "btn btn-primary";
  bttn.disabled = condition;
  bttn.innerHTML = "Checkout Movie";
  bttn.addEventListener("click", checkoutMovie);
  td.appendChild(bttn);
  tr.appendChild(td);
}

function addEditButton(tr, movie_id) {
  td = document.createElement('td')
  bttn = document.createElement('button')
  bttn.id = 'm_'+movie_id
  bttn.type = 'button'
  bttn.className = 'btn btn-primary'
  bttn.innerHTML = 'EDIT'
  bttn.addEventListener('click', editMovie)
  td.appendChild(bttn)
  tr.appendChild(td)
}

function checkoutMovie() {
  coButton = event.target
  id = coButton.id.substring("co_".length);
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = processResponse;
  xhttp.open("POST", "/movies/" + id + "/borrower");
  xhttp.setRequestHeader('Content-type',
            'application/json');
  xhttp.send(JSON.stringify(loggedUser));
  function processResponse() {
    console.log(xhttp.readyState);
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      coButton.disabled = true;
    }
  }
}

function editMovie() {
  id = event.target.id.substring('m_'.length)
  window.location = "edit-movie/" + id
}
