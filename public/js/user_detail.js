const name = document.querySelector('.name')
const email = document.querySelector('.email')
const method = document.querySelector('.method')
const building = document.querySelector('.building')
const profileImg = document.querySelector('.userImage')

const url = '/detail'

fetch(url)
.then((res) => {
	if (res.status === 200){
		return res.json()
	} else{
		alert('Bad Request')
	}
})
.then((json) => {
	name.innerText = json.temp.username
	email.innerText = json.temp.email
	method.innerText = json.temp.preferredMethod
	building.innerText = json.temp.preferredBuilding
	profileImg.src = json.temp.profileImageUrl
})
.catch((error) => {
	alert(error)
})