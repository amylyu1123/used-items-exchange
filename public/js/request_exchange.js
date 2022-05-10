'use strict'
const log = console.log

var otherItem;
var items;

//an array with index represent the order displayed on the page and the content is 
// this current user's item's _id
var displayedItems;
var index;

/* Event listeners for button click, body load, image */

const returnButton = document.querySelector('.return')
returnButton.addEventListener('click', returnToMarket)

const exchangeButton = document.querySelector('#displayImages')
exchangeButton.addEventListener('click', confirmExchange)

window.addEventListener('DOMContentLoaded', loadPage)

//----------------------------------functions-------------------------------------
function loadPage(e){
	const urls = ['/requestItem', '/currItems']

	//fetch all url in urls
	//source: https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all
	Promise.all(urls.map(url => fetch(url)))
	.then(res =>
	    Promise.all(res.map(res => {
	    	return res.json()
	    }))
	).then(json => {
	    otherItem = json[0][0] //stores the item object of the selected item from previous display page
	    items = json[1] //stores all current user's items
	   	displayItem() //call helper to display page
	})
	.catch((error) => {
		//if the user does not select an item from the market, log error
        // log(error)
        log('You cannot request an exchange without selecting an item first.')
    })

}

function confirmExchange(e){
	e.preventDefault()

	//if exchange button is clicked
	if (e.target.classList.contains("exchange")){
		const myItem = displayedItems[e.target.id]

		//source: https://www.w3schools.com/js/js_popup.asp
		//use a popup window, confirm method to ask for confirmation of exchange
		//if this user confirms to send the exchange request
		if (confirm("Are you sure you want to exchange this item for the item you picked before?"
			 + "\nNote: Once you confirm, your exchange request will be sent to the item owner.")) {
		  

			//when the user confirms exchange,
			//fetch /PATCH/item/:myItemId:/otherItemId
			//add both items' _id to each other's array of potentialItems in database
			const url = '/item/' + myItem._id + '/' + otherItem._id

			const request = new Request(url, {
	            method: 'PATCH',
		        headers: {
		            'Accept': 'application/json, text/plain, */*',
		            'Content-Type': 'application/json'
    			},
	        });
			fetch(request)
			.then(function (res) {
	            if (res.status === 200) {
	                log('patch item successfully')
	                //after confirmed and update, return to market
					document.location = '/display_page'
	            } else {
	                log('fail to patch item')
	            }
	        }).catch((error) => {
		        log(error)
		    })

		//if the user does not confirm
		} else {
		  log("Did not confirm to send the exchange request!")
		}

	//when user press any image to view
	} else if (e.target.classList.contains("image")){

		// Source to use image modal: https://www.w3schools.com/howto/howto_css_modal_images.asp
		// Get the modal
		const modal = e.target.nextElementSibling.nextElementSibling.nextElementSibling;

		// Get the image and modal image
		const img = e.target;
		const modalImg = modal.firstElementChild.nextElementSibling;
		
		modal.style.display = "block";
		modalImg.src = img.src; //set the image to corresponding source

		// Get the <span> (x) element that closes the modal
		const span = modal.firstElementChild;

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		  modal.style.display = "none";
		}
	}
}

//display all my items that are not confirmed for exchange
function displayItem(){
	const display = document.querySelector('#displayImages')

	displayedItems = []
	index = 0

	//display all current user's items whose status is not 'Confirmed'
	for (let i = 0; i < items.length; i++){
		let item = items[i];

		if (item.status != 'Confirmed' && otherItem.status != 'Confirmed'){
			displayedItems[index] = item

			const div = document.createElement('div')
			div.className = "displayItem"
			display.appendChild(div)

			const img = document.createElement('img')
			img.className = "image";
			img.src = item.itemImageUrl
			img.id = 'myImg'
			div.appendChild(img)

			div.appendChild(document.createElement("br"))

			const button = document.createElement('button')
			button.className = "exchange"
			button.innerText = "Exchange"
			button.id = index
			index++
			div.appendChild(button)

			// Source to use image modal: https://www.w3schools.com/howto/howto_css_modal_images.asp
			const div1 = document.createElement('div')
			div1.id = "myModal"
			div1.className = "modal"
			div.appendChild(div1)

			const span = document.createElement('span')
			span.className = 'close'
			span.innerHTML = '&times;'
			div1.appendChild(span)

			const image1 = document.createElement('img')
			image1.className = 'modal-content'
			image1.id = 'img01'
			div1.appendChild(image1)
		}
	}
}

//if return to market button is clicked on
function returnToMarket(e){
	e.preventDefault();

	if (e.target.classList.contains('return')){

		//redirect the to the previous display page for Market
		document.location = '/display_page'

	}
}


