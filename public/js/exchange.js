'use strict'
const log = console.log

var index = 0;

//an array with index represent the order displayed on the page and the content is 
// array with this current user's item's _id and another user's item's _id which are to
// be exchanged
var displayedItems = [];

var category = 'Any' //the item category current page displaying

var currItems;
var items;
var users;

/* Event listeners for button click, body load, select image */
const blindBoxesEntries = document.querySelector('.displayRequest')
blindBoxesEntries.addEventListener('click', confirmExchange)

const body = document.getElementsByTagName('body')
window.addEventListener('DOMContentLoaded', loadPage(category))

// source: https://www.w3schools.com/jsref/event_onchange.asp
const tag = document.getElementById('tags')
tag.addEventListener('change', updateDisplay)

// -------------------------------------functions------------------------------------------

function loadPage(category){
	const urls = ['/currItems', '/items', '/users']

	//fetch all url in urls
	//source: https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all
	Promise.all(urls.map(url => fetch(url)))
	.then(res =>
	    Promise.all(res.map(res => res.json()))
	).then(json => {
	    currItems = json[0] //store all current user's items
	    items = json[1] //store all exiting items
	    users = json[2] //store all exiting users
	    changeDisplay(category) //call helper to display page
	})
    .catch((error) => {
        log(error)
    })
}


//get specific object(item or user)
function getObject(id, inputs){
	for (let i = 0; i < inputs.length; i++){
		if (inputs[i]._id == id){
			return inputs[i]
		}
	}
}

//A helper function to display received request by the specific category of the other owner's item
function changeDisplay(category){
	const display = document.querySelector('.displayRequest')

	//clear all displayed before
	display.innerHTML = '';

	index = 0
	displayedItems = []

	//display all received exchange request for this user
	for (let i = 0; i < currItems.length; i++){
		let myItem = currItems[i]
		let potentialItems = currItems[i].potentialItems

		for (let j = 0; j < potentialItems.length; j++){
			let otherItem = getObject(potentialItems[j], items)
			let otherUser = getObject(otherItem.owner, users)

			if ((otherItem.category == category || category == 'Any') && 
			myItem.status != 'Confirmed' && otherItem.status != 'Confirmed'){

				displayedItems[index] = [myItem._id, otherItem._id]

				const div = document.createElement('div')
				div.className = "request"
				display.appendChild(div)

				const otherDiv = document.createElement('div')
				otherDiv.className = "otherBlindBox"
				div.appendChild(otherDiv)

				const subDiv = document.createElement('div')
				subDiv.id = 'sub'
				otherDiv.append(subDiv)

				const h3 = document.createElement('h3')
				h3.className = "title";
				h3.innerText = "Someone would like to exchange the following item:"
				subDiv.appendChild(h3)

				const p2 = document.createElement('p')
				p2.innerHTML = "Summary: <span>" + otherItem.description + "</span>"
				subDiv.appendChild(p2)

				const p3 = document.createElement('p')
				p3.innerHTML = "Category: <span>" + otherItem.category + "</span>"
				subDiv.appendChild(p3)

				const p4 = document.createElement('p')
				p4.innerHTML = "Preferred Method: <span>" + otherUser.preferredMethod + "</span>"
				subDiv.appendChild(p4)

				const p5 = document.createElement('p')
				p5.innerHTML = "Preferred Building: <span>" + otherUser.preferredBuilding + "</span>"
				subDiv.appendChild(p5)

				const img = document.createElement('img')
				img.className = "image1";
				img.src = otherItem.itemImageUrl
				otherDiv.appendChild(img)

				// Source to use image modal: https://www.w3schools.com/howto/howto_css_modal_images.asp
				const div3 = document.createElement('div')
				div3.id = "myModal"
				div3.className = "modal"
				otherDiv.appendChild(div3)

				const span1 = document.createElement('span')
				span1.className = 'close'
				span1.innerHTML = '&times;'
				div3.appendChild(span1)

				const otherimage = document.createElement('img')
				otherimage.className = 'modal-content'
				div3.appendChild(otherimage)

				//create an arrow symbol
				const arrowDiv = document.createElement('div')
				arrowDiv.className = "arrow"
				div.appendChild(arrowDiv)

				const arrow = document.createElement('span')
				arrow.className = 'arrow'
				arrow.innerHTML = '&#8703;'
				arrowDiv.appendChild(arrow)

				const ownDiv = document.createElement('div')
				ownDiv.className = "myBlindBox"
				div.appendChild(ownDiv)

				const h3Own = document.createElement('h3')
				h3Own.className = "title";
				h3Own.innerText = "Your item to be exchange:\n (Click Image to View)"
				ownDiv.appendChild(h3Own) 

				const image = document.createElement('img')
				image.className = "image";
				image.src = myItem.itemImageUrl
				ownDiv.appendChild(image)

				// Source to use image modal: https://www.w3schools.com/howto/howto_css_modal_images.asp
				const div1 = document.createElement('div')
				div1.id = "myModal"
				div1.className = "modal"
				ownDiv.appendChild(div1)

				const span = document.createElement('span')
				span.className = 'close'
				span.innerHTML = '&times;'
				div1.appendChild(span)

				const image1 = document.createElement('img')
				image1.className = 'modal-content'
				div1.appendChild(image1)

				const button = document.createElement('button')
				button.className = "confirmExchange"
				button.innerText = "Confirm Exchange"
				button.id = index
				index++
				div.appendChild(button)
			}
		}
	}
}


//calls changeDisplay to display received request by selected category for the other owner's item
function updateDisplay(e){
	category = e.target.value;
	changeDisplay(category)
}

//when user clicks any of the button of confirm exchange or the image to view
function confirmExchange(e){
	e.preventDefault();

	//if the confirm exchange button is clicked on
	if (e.target.classList.contains('confirmExchange')){

		//source: https://www.w3schools.com/js/js_popup.asp
		//use a popup window, confirm method to ask for confirmation of accepting exchange request
		//if this user confirms to exchange
		if (confirm("Are you sure you want to accept and confirm this exchange request?"
			 + "\nNote: Once you confirm, you cannot undo." + 
			 "\nPlease check the other user's contact information from your item detail on profile page.")) {
		  
		    //when the user confirms to accept exchange request,
			//fetch /PATCH/item/:myItemId:/otherItemId with request body {status: "Confirmed"}
		    //set the status of both items to 'Confirmed' and add each other item's _id to 
		    //exchangedItem.

			const curr = displayedItems[e.target.id]
			const url = '/item/' + curr[0] + '/' + curr[1]

			const data = {
				status: "Confirmed"
			}
			const request = new Request(url, {
	            method: 'PATCH',
	            body: JSON.stringify(data),
		        headers: {
		            'Accept': 'application/json, text/plain, */*',
		            'Content-Type': 'application/json'
    			},
	        });
			fetch(request)
			.then(function (res) {
	            if (res.status === 200) {
	                log('patch item successfully')
	                loadPage(category);
	            } else {
	                log('fail to patch item')
	            }
	        }).catch((error) => {
		        log(error)
		    })
			//if this user does not confirm
			} else {
			  log("Did not confirm the exchange request")
			}

	//when user press any image to view
	} else if (e.target.classList.contains("image") || e.target.classList.contains("image1")){

		// Source to use image modal: https://www.w3schools.com/howto/howto_css_modal_images.asp
		// Get the modal
		const modal = e.target.nextElementSibling;

		// Get the image and modal image
		const img = e.target;
		const modalImg = modal.firstElementChild.nextElementSibling;
		
		modal.style.display = "block";
		modalImg.src = img.src;

		// Get the <span> element that closes the modal
		const span = modal.firstElementChild;

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		  modal.style.display = "none";
		}
	}
}



