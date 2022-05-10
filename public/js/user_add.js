// user adding
const userAdd = document.querySelector('#Addition')
userAdd.addEventListener('submit', addUser)

const userStatus = document.querySelector('#status')
userStatus.addEventListener('change', changeStatus)

let status = ""
function changeStatus(e) {
	e.preventDefault();
	status = e.target.value
}


const userMethod = document.querySelector('#method')
userMethod.addEventListener('change', changeMethod)

let method = ""
function changeMethod(e) {
	e.preventDefault();
	method = e.target.value
}

const userBuilding = document.querySelector('#building')
userBuilding.addEventListener('change', changeBuilding)

let building = ""
function changeBuilding(e) {
	e.preventDefault();
	building = e.target.value
}

function addUser(e){
	e.preventDefault();

	const name = document.querySelector('.userName').value
	const email = document.querySelector('.userEmail').value
	const password = document.querySelector('.password').value

	if (status === ""){
		status = "Active"
	}

	if (method === ""){
		method = "In-person"
	}

	if (building === ""){
		building = "BA"
	}

	//This regular expression come from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const email_checker = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (name.length < 3) {
        alert('Minimum Length of Username is 3!');
    } else if (!email_checker.test(email)) {
        alert('Invalid Email Address. Please try again.');
    }

	const newUser = {
		name: name,
		email: email,
		password: password,
		status: status,
		method: method,
		building: building
	}

	const url = '/user/add'

    const request = new Request(url, {
	    method: 'post', 
	    body: JSON.stringify(newUser),
	    headers: {
	        'Accept': 'application/json, text/plain, */*',
	        'Content-Type': 'application/json'
	    }
    })

	fetch(request)
	.then((res) => {
		if (res.status === 200){
			document.location = '../admin_view/admin_page.html'
		} else{
			alert('Username already exists. Please try again.')
		}
	}).catch((error) => {
		alert(error)
	})
}