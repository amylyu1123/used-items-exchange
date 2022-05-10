"use strict"

const AllUser = document.querySelector('#userTable')
let check = AllUser.firstElementChild.firstElementChild.firstElementChild

const body = document.getElementsByTagName('body')
addEventListener('load', display)

function FindUserByName(name){
	const url = '/user/'+ name

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
	    	resolve(json.user._id)
	    })
	    .catch((error) => {
	    	console.log(error)
	    })
	})
	
}

async function BlockUser(name){
	const id = await FindUserByName(name)

	const url = '/update/' + id

	const change = {
		status: "Inactive"
	}
    const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(change),
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
			alert('Could not get user')
       }                
    })
    .catch((error) => {
    	console.log(error)
    })
}

async function DeleteUser(delname){
	const id = await FindUserByName(delname)

	const url = '/user/' + id

	const request = new Request(url, {
        method: 'DELETE'
    })

	fetch(request)
	.then((res) => {
		if (res.status === 200) {
			document.location = '../admin_view/admin_page.html'
		} else {
			alert('Could not get user')
       }                
    })
    .catch((error) => {
    	console.log(error)
    })
}

function display(e) {
	e.preventDefault();
	displayAll('All');
}

// A helper method for search and display users
function displayAll(name) {
	check = AllUser.firstElementChild.firstElementChild.firstElementChild
	let tb = AllUser.firstElementChild.firstElementChild

	while (check.nextElementSibling){
		tb.removeChild(check.nextElementSibling)
	}

	// the URL for the request to get all users
	const url = '/user';

    fetch(url)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get users')
       }                
    })
    .then((json) => {
        json.map((s) => {
        	if (s.username === name || name === "All" || name === "" ){
				const tr = document.createElement('tr')

				const td1 = document.createElement('td')
				td1.innerText = s.username
				tr.appendChild(td1)

				const td2 = document.createElement('td')
				td2.innerText = s.status
				tr.appendChild(td2)

				const td3 = document.createElement('td')
				
				const b1 = document.createElement('button')
				b1.className = "detail"
				b1.innerText = "Detail"
				b1.setAttribute("onclick", "location.href='/user_detail'")
				td3.appendChild(b1)

				const b2 = document.createElement('button')
				b2.className = "update"
				b2.innerText = "update"
				b2.setAttribute("onclick", "location.href='/user_update'")
				td3.appendChild(b2)

				const b3 = document.createElement('button')
				b3.className = "delete"
				b3.innerText = "delete"
				td3.appendChild(b3)

				const b4 = document.createElement('button')
				b4.className = "block"
				b4.innerText = "Block"
				td3.appendChild(b4)

				tr.appendChild(td3)
				tb.appendChild(tr)
			}
		})})
		.catch((error) => {
			console.log(error)
		})
}

// search action
const searchform = document.querySelector('#search')
searchform.addEventListener('submit', searchUser)

function searchUser(e){
	e.preventDefault();
	const userName = document.querySelector('#searchName').value
	displayAll(userName)
}

// actions on user
const actions = document.querySelector('#users')
actions.addEventListener('click', userAction)

async function userAction(e){
	e.preventDefault();

	let name = e.target.parentElement.parentElement.firstElementChild.innerText

	if (e.target.classList.contains('delete')){
		if (confirm("Are you sure to delete this user?")){
			DeleteUser(name)
		}
	} else if (e.target.classList.contains('block')){
		if (confirm("Are you sure to block this user?")){
			BlockUser(name)
		}
	} else if (e.target.classList.contains('detail') | e.target.classList.contains('update')){
		await FindUserByName(name)
	}
}