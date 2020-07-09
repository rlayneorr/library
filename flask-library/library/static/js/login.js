let navbar = `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<a class="navbar-brand">
        <span class="badge-primary">The Library</span>
    </a>
    <ul class="navbar-nav mr-auto">
            <li class="nav-item"><a class="nav-link" href="/booklist">Books!</a></li>
            <li class="nav-item"><a class="nav-link" href="/movieslist">Movies!</a></li>
            <li class="nav-item"><a class="nav-link" href="/videogamelist">Videogames!</a></li>
            <li class="nav-item"><a class="nav-link" href="/mymedia">My Media!</a></li>
    </ul>
	<ul class="navbar-nav mr-auto" id="authent">
	</ul>
</nav>
`;
let unauthenticated = `
	<li class="nav-item">
		Username: <input type="text" id="username">
	</li>
	<li class="nav-item">
		<button class="btn btn-primary" id="login">Login</button>
	</li>
    `;
let authenticated = `
	<li class="nav-item">
		Welcome <span id="authUserName"></span> 
	</li>
	<li class="nav-item">
		<button class="btn btn-danger" id="logout">Logout</button>
    </li>`;
loggedUser = null;
loadTable = null;
function addNavBar(tableLoad) {
    loadTable = tableLoad
    console.log('adding the nav bar');
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.innerHTML = navbar;
    body.insertBefore(div, body.childNodes[0])

    let authent = document.getElementById('authent')
    authent.innerHTML = unauthenticated;

    document.getElementById('login').addEventListener('click', authenticate);
    document.getElementById('username').onkeydown=checkEnter;
    checkLogin()
}
function checkLogin(){
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = loginSuccess;
	xhttp.open('GET', '/users');
    xhttp.send()
    function loginSuccess() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            loggedUser = JSON.parse(xhttp.responseText)
            let authent = document.getElementById('authent')
            authent.innerHTML = authenticated;
            document.getElementById('authUserName').innerHTML=loggedUser.username;
            document.getElementById('logout').onclick = logout;
            console.log(window.location.pathname)
            loadTable()
        }
    }
}
function authenticate(){
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = loginSuccess;
	xhttp.open('POST', '/users');
	xhttp.setRequestHeader('Content-type',
            'application/x-www-form-urlencoded');
    let user = document.getElementById('username').value;
    xhttp.send('user='+user)
    // 'user='+user+'&pass='+pass
            
    function loginSuccess() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            loggedUser = JSON.parse(xhttp.responseText)
            console.log(loggedUser)
            let authent = document.getElementById('authent')
            authent.innerHTML = authenticated;
            document.getElementById('authUserName').innerHTML=loggedUser.username;
            document.getElementById('logout').onclick = logout;
            console.log(window.location.pathname)
            loadTable()
        }
    }
}

function checkEnter(){
    if (event.which === 13) {
        authenticate();
    }
}

function logout(){
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = logoutSuccess;
	xhttp.open('DELETE', '/users');
    xhttp.send()
            
    function logoutSuccess() {
        if (xhttp.readyState === 4 && xhttp.status === 204) {
            loggedUser = null
            document.getElementById("authent").innerHTML = unauthenticated;
            document.getElementById("login").addEventListener("click", authenticate);
            document.getElementById("username").onkeydown = checkEnter;
            loadTable()
        }
    }
}