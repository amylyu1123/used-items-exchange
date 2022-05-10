const name = document.querySelector('.name')
const cat = document.querySelector('.category')
const status = document.querySelector('.status')
const description = document.querySelector('.description')
const itemImage = document.querySelector('.itemImage')
const po = document.querySelector('.potential')
const trade = document.querySelector('.exchange')

const body = document.getElementsByTagName('body')
window.addEventListener('DOMContentLoaded', getInfo())

function getItem(){
	const url = '/itemsDetail'
	
	return new Promise((resolve,reject) => {
		fetch(url)
		.then((res) => {
			if (res.status === 200) {
				return res.json()
			} else {
				alert('Could not get user')
	       }                
	    })
	    .then((json) => {
	    	resolve(json)
	    })
	    .catch((error) => {
	    	console.log(error)
	    })
	})
}


async function getInfo(){
	const item = await getItem()
	let exchanged = ""
	let potential = ""
	let username = ""

	if (item[0].status === "Confirmed"){
		console.log(1111)
		exchanged = await loadPage(item[0].exchangedItem)
	}

	for (let j = 0;j<item[0].potentialItems.length;j++){
		console.log(j)
		potential = potential + await loadPage(item[0].potentialItems[j]) + ", "
	}

	username = await loadPage(item[0]._id)
	name.innerText = username
	cat.innerText = item[0].category
	status.innerText = item[0].status
	description.innerText = item[0].description
	itemImage.src = item[0].itemImageUrl
	po.innerText = potential
	trade.innerText = exchanged
}


// helper function
function loadPage(id){
	const url = '/itemToUser/' + id
	return new Promise((resolve,reject) => {
		fetch(url)
		.then((res) => {
			if (res.status === 200) {
				return res.json()
			} else {
				alert('Could not get user info')
	       }                
	    })
	    .then((json) => {
	    	resolve(json.username)
	    })
	    .catch((error) => {
	    	console.log(error)
	    })
	})
}