//user update
const userUpdate = document.querySelector('#updates')
userUpdate.addEventListener('submit', updateUser)

const name = document.querySelector('#userName')
const email = document.querySelector('#userEmail')
const method = document.querySelector('#method')
const building = document.querySelector('#building')

const url = '/detail'
let id

fetch(url)
.then((res) => {
	if (res.status === 200){
		return res.json()
	} else{
		alert('Bad Request')
	}
})
.then((json) => {
	name.setAttribute("value", json.temp.username)
	email.setAttribute("value", json.temp.email)
	method.value = json.temp.preferredMethod
	building.value = json.temp.preferredBuilding
	id = json.temp._id
})
.catch((error) => {
	alert(error)
})

function updateUser(e) {
	e.preventDefault();

	const url = '/update/' + id

	const changes = {
		username: name.value,
		email: email.value,
		preferredMethod: method.value,
		preferredBuilding: building.value
	}

    const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(changes),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })

	fetch(request)
	.then((res) => {
		if (res.status === 200) {
			document.location = '../admin_view/admin_page.html'
		} else {
			alert('Username is already exists. Please try again!')
       }                
    })
    .catch((error) => {
    	console.log(error)
    })
}