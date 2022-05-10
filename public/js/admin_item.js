"use strict"

const AllBox = document.querySelector('#items')
let check = AllBox.firstElementChild.firstElementChild.firstElementChild

let total = []
const cat = ['Other', 'Cosmetics', 'Books', 'Stationery', 'Clothes', 'Health Product']

const body = document.getElementsByTagName('body')
window.addEventListener('DOMContentLoaded', loadPage('Any'))

function loadPage(change){
	let urls = []
	if (cat.includes(change)){
		console.log(111)
		urls = ['/items/' + change, '/users']
	} else if (change == 'Any'){
		console.log(222)
		urls = ['/items', '/users']
	} else {
		console.log(333)
		urls = ['/items', '/user/' + change]
	}

	//fetch all url in urls
	//https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all
	Promise.all(urls.map(url => fetch(url)))
	.then(res =>
	    Promise.all(res.map(res => res.json()))
	).then(json => {
	    const items = json[0]
	    const users = json[1]
	    updateDisplay(items, users)
	})
    .catch((error) => {
        console.log(error)
    })
}

// search owner name action
const searchform = document.querySelector('#search')
searchform.addEventListener('submit', searchOwner)

function searchOwner(e){
	e.preventDefault();
	const owner = document.querySelector('#searchOwner').value

	loadPage(owner)
}

// search tage
const tag = document.getElementById('category')
tag.addEventListener('change', searchTag)

function searchTag(e){
	e.preventDefault();
	const tag = e.target.value;

	loadPage(tag)
}

// Item actions
const actions = document.querySelector('#items')
actions.addEventListener('click', ItemAction)

async function ItemAction(e){
	e.preventDefault();

	if (e.target.classList.contains('delete')){
		if (confirm("Are you sure to delete this blind box?")){
			const id = total[e.target.id]._id

			if (total[e.target.id].status === "Confirmed"){
				const exchanged = await FindItemByID(total[e.target.id].exchangedItem)
				await DeleteItem(total[e.target.id].itemImageId)
				console.log(exchanged)
				await DeleteItem(exchanged[0].itemImageId)
			} else{
				await DeleteItem(total[e.target.id].itemImageId)
			}
		}
	} else if (e.target.classList.contains('detail')){
		const id = total[e.target.id]._id
		await FindItemByID(id)
	}
}

// Helper function
function FindItemByID(id) {
	const url = '/item/' + id

	return new Promise((resolve,reject) => {
		fetch(url)
		.then((res) => {
			if (res.status === 200) {
				return res.json()
			} else {
				alert('Bad Request')
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

// Helper function
function DeleteItem(itemImageId){
	const url = '/delete/' + itemImageId

	const request = new Request(url, {
        method: 'DELETE'
    })

	fetch(request)
	.then((res) => {
		if (res.status === 200) {
			document.location = '../admin_page/admin_item.html'
		} else {
			alert('Could not get user')
       }                
    })
    .catch((error) => {
    	console.log(error)
    })
}

// Helper function
function updateDisplay(items, users) {
	check = AllBox.firstElementChild.firstElementChild.firstElementChild
	let tb = AllBox.firstElementChild.firstElementChild

	while (check.nextElementSibling){
		tb.removeChild(check.nextElementSibling)
	}
	
	total = []
	if (users.length > 1){
		for (let i = 0; i < items.length; i++){
			for (let a=0;a<users.length;a++){
				if (items[i].owner === users[a]._id){
					FillInItem(items[i], users[a], tb, i)
					total.push(items[i])
					break
				}
			}
		}
	} else {
		for (let b = 0; b < items.length; b++){
			if (items[b].owner === users.user._id){
				FillInItem(items[b], users.user, tb, b)
				total.push(items[b])
			}
		}
	}
}

// Helper function
function FillInItem(item, user, tb, index){

	const tr = document.createElement('tr')

	const td1 = document.createElement('td')
	td1.innerText = user.username
	tr.appendChild(td1)

	const td2 = document.createElement('td')
	td2.innerText = item.category
	tr.appendChild(td2)

	const td3 = document.createElement('td')
	td3.innerText = item.status
	tr.appendChild(td3)

	const td4 = document.createElement('td')
	
	const b1 = document.createElement('button')
	b1.className = "detail"
	b1.innerText = "Detail"
	b1.setAttribute("id", index)
	b1.setAttribute("onclick", "location.href='/item_detail'")
	td4.appendChild(b1)

	const b2 = document.createElement('button')
	b2.className = "delete"
	b2.innerText = "delete"
	b2.setAttribute("id", index)
	td4.appendChild(b2)

	tr.appendChild(td4)
	tb.appendChild(tr)
}