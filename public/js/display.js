'use strict'
const log = console.log

var index;

//an array with index represent the order displayed on the page and the content is 
// this item's _id
var displayedItems;

var user;
var users;
var items;

/* Event listeners for button click, content load, select change */

window.addEventListener('DOMContentLoaded', loadPage)

// source: https://www.w3schools.com/jsref/event_onchange.asp
const tags = document.getElementById('tags')
tags.addEventListener('change', updateDisplay)

const blindBoxesEntries = document.querySelector('#displayBlindBox')
blindBoxesEntries.addEventListener('click', requestExchange)


// -------------------------------------functions------------------------------------------

function loadPage(e){
	const urls = ['/currUser', '/users', '/items']

	//use Promise.all() to fetch all url in urls
	//source: https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all
	Promise.all(urls.map(url => fetch(url)))
	.then(res =>
	    Promise.all(res.map(res => res.json()))
	).then(json => {
	    user = json[0][0] //store this current user
	    users = json[1] // store all existing users
	    items = json[2] // store all existing items
	    changeDisplay('Any') //call DOM function to display the page
	})
    .catch((error) => {
        log(error)
    })
}

//A helper function to display the page
function changeDisplay(tag){
	const display = document.querySelector('#displayBlindBox')

	//clear all displayed before
	display.innerHTML = '';

	index = 0;
	displayedItems = [];

	//display all items whose status is not 'Confirmed''
	for (let i = 0; i < items.length; i++){
		if ((items[i].category === tag || tag === 'Any') && 
			items[i].status != 'Confirmed' && items[i].owner !== user._id){
			let item = items[i];

			displayedItems[index] = item._id;

			const div = document.createElement('div')
			div.classList.add("blindBoxContainer") 
			display.appendChild(div)

			const div1 = document.createElement('div')
			div1.className = "blindBox"
			div.appendChild(div1)

			const p2 = document.createElement('p')
			p2.innerHTML = "Description: <span>" + item.description + "</span>"
			div1.appendChild(p2)

			const p3 = document.createElement('p')
			p3.innerHTML = "Category: <span>" + item.category + "</span>"
			div1.appendChild(p3)

			const owner = getUser(item.owner, users)

			const method = document.createElement('p')
			method.innerHTML = "Preferred Method: <span>" + owner.preferredMethod + "</span>"
			div1.appendChild(method)

			const building = document.createElement('p')
			building.innerHTML = "Preferred Building: <span>" + owner.preferredBuilding + "</span>"
			div1.appendChild(building)

			const div2 = document.createElement('div')
			div2.className = "request"
			div.appendChild(div2)

			const image = document.createElement('img')
            image.alt = 'blind box image'
            image.src = item.itemImageUrl
            image.classList.add('boxImage')
            div.appendChild(image)

			const button = document.createElement('button')
			button.className = "requestExchange"
			button.innerText = "Request Exchange"

			button.id = index//store the index of displayedItem on button
			index++
			
			div2.appendChild(button)

		}
	}
}

//helper to get User Object
function getUser(id, users){
	for (let i = 0; i < users.length; i++){
		if (users[i]._id == id){
			return users[i]
		}
	}
}

//calls changeDisplay to display items by selected category
function updateDisplay(e){
	const tag = e.target.value;
	changeDisplay(tag)
}

//when user clicks on any of the button of request exchange or image to view
function requestExchange(e){
	e.preventDefault();

	if (e.target.classList.contains('requestExchange')){
		const id = displayedItems[e.target.id];//record the id of the item that is selected

		//send the selected item's _id in url
		//fetch /GET/requestItem/:id:
		fetch('/requestItem/' + id)
		.then(res => {
			if (res.status === 200){
				document.location = '/request_exchange' //redirect to request_exchange to proceed the exchange
			}else{
				alert("Cannot find item. Please try Again.")
			}
		}).catch((error) => {
        	log(error)
    	})
	}
}


