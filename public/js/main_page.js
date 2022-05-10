'use strict';
const log = console.log;

const profileStats = document.querySelector('#profileStats')

profileStats.addEventListener('click', modifyProfile)

// for profile image
var file;

window.addEventListener('DOMContentLoaded', fillInProfile)
window.addEventListener('DOMContentLoaded', fillInItems)

function modifyProfile(e) {
    e.preventDefault();
    
    if (e.target.classList.contains('edit')) {
        log('edit profile')
        if (e.target.innerText === 'Edit Profile') {
            addProfileTextBox(e.target.parentElement)
            addProfileImage(e.target.parentElement.parentElement)
            e.target.innerText = 'Save Profile'
        } else {
            removeProfileTextBox(e.target.parentElement)
            removeImageUploaderAndSave(e.target.parentElement.parentElement)
            e.target.innerText = 'Edit Profile'
        }
    }
}

function addProfileTextBox(stats) {
    const statsList = stats.children[0]
    const statsRows = statsList.getElementsByTagName('li')

    // edit username
    const usernameTextBox = document.createElement('input')
    usernameTextBox.type = 'text'
    const username = statsRows[0].getElementsByTagName('span')[0]
    usernameTextBox.value = username.innerText
    username.before(usernameTextBox)
    statsRows[0].removeChild(username)

    // edit email
    const emailTextBox = document.createElement('input')
    emailTextBox.type = 'text'
    const email = statsRows[1].getElementsByTagName('span')[0]
    emailTextBox.value = email.innerText
    email.before(emailTextBox)
    statsRows[1].removeChild(email)

    // edit preferred method
    const preferredMethodSelect = document.createElement('select')
    const method = statsRows[2].getElementsByTagName('span')[0].innerText
    preferredMethodSelect.append(new Option(method, method))
    if (method === 'In-person') {
        preferredMethodSelect.append(new Option('Online', 'Online'))
    } else {
        preferredMethodSelect.append(new Option('In-person', 'In-person'))
    }
    const preferredMethod = statsRows[2].getElementsByTagName('span')[0]
    preferredMethod.before(preferredMethodSelect)
    statsRows[2].removeChild(preferredMethod)

    // edit preferred buildings
    const preferredBuildingsSelect = document.createElement('select')
    const building = statsRows[3].getElementsByTagName('span')[0].innerText
    const buildings = ['BA', 'RB', 'SS', 'MP', 'MY']
    preferredBuildingsSelect.appendChild(new Option(building, building))
    for (var i = 0; i < buildings.length; i++) {
        const newBuilding = buildings[i]
        if (newBuilding !== building) {
            preferredBuildingsSelect.appendChild(new Option(newBuilding, newBuilding))
        }
    }
    const preferredBuilding = statsRows[3].getElementsByTagName('span')[0]
    preferredBuilding.before(preferredBuildingsSelect)
    statsRows[3].removeChild(preferredBuilding)
}

function removeProfileTextBox(stats) {
    const statsRows = stats.children[0].getElementsByTagName('li')

    // patch current user
    const url = '/currUser'

    let user = {
        username: statsRows[0].firstElementChild.value,
        email: statsRows[1].firstElementChild.value,
        preferredMethod: statsRows[2].firstElementChild.value,
        preferredBuilding: statsRows[3].firstElementChild.value
    }

    const request = new Request(url, {
        method: 'put',
        body: JSON.stringify(user),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    })

    log(request)

    fetch(request)
    .then(function(res) {
        if (res.status == 200) {
            log('Update profile successfully!')
        } else {
            alert(res)
        }
    }).catch((error) => {
        log(error)
    })

    // remove current stats
    stats.firstElementChild.remove()

    // get new profile from db
    fillInProfile()
}

function addProfileImage(profile) {
    const stats = profile.children[1]
    // I modified code from "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file"
    // for the following three lines
    const uploader = document.createElement('input')
    uploader.name = 'image'
    uploader.type = 'file'
    uploader.accept = 'image/png, image/jpeg'
    uploader.id = 'imageUploader'
    uploader.addEventListener('change', function (e) {
        file = e.target.files[0]
    })

    const form = document.createElement('form')
    form.id = 'profileImgForm'
    form.appendChild(uploader)

    stats.after(form)
}

function removeImageUploaderAndSave(profile) {
    const uploaderForm = profile.querySelector('#profileImgForm')
    const formData = new FormData(uploaderForm)

    const url = '/currUserProfileImg'

    const request = new Request(url, {
        method: "put",
        body: formData,
    })

    fetch(request) 
    .then(function (res) {
        if (res.status === 200) {
            log('post item successfully')
        } else {
            log('fail to post item')
        }
    })
    .catch(error => {
        console.log(error);
    });

    uploaderForm.remove()
    document.location = '../main_page/main_page.html'
}

// const profileImage = document.querySelector('.profileImg')

// // I modified code from https://codepen.io/maqnus/pen/oedWmq for readUrl
// const readUrl = event => {
//     if(event.files && event.files[0]) {
//       let reader = new FileReader();
//           reader.onload = event => profileImage.src = event.target.result;
//           reader.readAsDataURL(event.files[0])
//     }
// } 

document.addEventListener('DOMContentLoaded', () => {
    const addedBoxes = JSON.parse(sessionStorage.getItem('addedBoxes'))
    if (addedBoxes !== null) {
        for (var i = 0; i < addedBoxes.length; i++) {
            const box = document.createElement('div')
            box.classList.add('box')
    
            const image = document.createElement('img')
            image.alt = 'blind box image'
            image.src = sessionStorage.getItem(addedBoxes[i].imgId)
            sessionStorage.removeItem(addedBoxes[i].imgId)
            image.classList.add('boxImage')
            box.appendChild(image)
    
            const detailUl = document.createElement('ul')
            box.appendChild(detailUl)
    
            const statusLi = document.createElement('li')
            statusLi.appendChild(document.createTextNode('Status: '))
            const waitingText = document.createElement('span')
            waitingText.appendChild(document.createTextNode('Waiting'))
            statusLi.appendChild(waitingText)
            detailUl.appendChild(statusLi)

            const tagLi = document.createElement('li')
            tagLi.appendChild(document.createTextNode('Tag: '))
            const tagSpan = document.createElement('span')
            tagSpan.appendChild(document.createTextNode(addedBoxes[i].tag))
            tagLi.appendChild(tagSpan)
            detailUl.appendChild(tagLi)
    
            const summaryLi = document.createElement('li')
            summaryLi.appendChild(document.createTextNode('Summary: '))
            const summarySpan = document.createElement('span')
            summarySpan.appendChild(document.createTextNode(addedBoxes[i].summary))
            summaryLi.appendChild(summarySpan)
            detailUl.appendChild(summaryLi)

            const descriptionLi = document.createElement('li')
            descriptionLi.appendChild(document.createTextNode('Description: '))
            const descriptionSpan = document.createElement('span')
            descriptionSpan.appendChild(document.createTextNode(addedBoxes[i].description))
            descriptionLi.appendChild(descriptionSpan)
            detailUl.appendChild(descriptionLi)

            const blindBoxesContainer = document.querySelector('#blindBoxesContainer')
            blindBoxesContainer.appendChild(box)



        }
    }
    sessionStorage.removeItem('addedBoxes')
})

function fillInProfile() {
    const url = '/currUser'

    fetch(url)
    .then((res) => {
        if (res.status == 200) {
            return res.json()
        } else {
            alert('Cloud not get user id')
        }
    })
    .then((json) => {
        const user = json[0]

        const profileImg = document.querySelector('.profileImg')
        profileImg.src = user.profileImageUrl

        const ul = document.createElement('ul')
        const usernameLi = document.createElement('li')
        const emailLi = document.createElement('li')
        const preferredMethodLi = document.createElement('li')
        const preferredBuildingLi = document.createElement('li')

        usernameLi.innerHTML = `Username: <span>${user.username}</span>`
        emailLi.innerHTML = `Email: <span>${user.email}</span>`
        preferredMethodLi.innerHTML = `Preferred Method: <span>${user.preferredMethod}</span>`
        preferredBuildingLi.innerHTML = `Preferred Building: <span>${user.preferredBuilding}</span>`

        ul.appendChild(usernameLi)
        ul.appendChild(emailLi)
        ul.appendChild(preferredMethodLi)
        ul.appendChild(preferredBuildingLi)

        const profileStats = document.querySelector('#profileStats')
        profileStats.prepend(ul)
    }).catch((error) => {
        log(error)
    })
}

function fillInItems() {
    const url = '/currItems'

    fetch(url)
    .then((res) => {
        if (res.status == 200) {
            return res.json()
        } else {
            alert('Cloud not get user id')
        }
    })
    .then((json) => {
        const blindBoxesContainer = document.querySelector('#blindBoxesContainer')

        json.forEach((item) => {
            const itemDiv = document.createElement('div')
            itemDiv.className = 'box'

            // add image
            const img = document.createElement('img')
            img.className = 'boxImage'
            img.alt = 'blind box image'
            img.src = item.itemImageUrl

            // add item details
            const ul = document.createElement('ul')

            const statusLi = document.createElement('li')
            if (item.status === 'Active') {
                statusLi.innerHTML = `Status: <span>${item.status}</span>`
            } else {
                const exchangedItemId = item.exchangedItem
                const urlToUser = '/itemToUser/' + exchangedItemId
                
                fetch(urlToUser)
                .then((res) => {
                    if (res.status == 200) {
                        return res.json()
                    } else {
                        log('No user correspondes to this item')
                    }
                })
                .then((user) => {
                    statusLi.innerHTML = `Status: <span>${item.status}(Contact via ${user.email})</span>`
                })
            }
            const categoryLi = document.createElement('li')
            categoryLi.innerHTML = `Category: <span>${item.category}</span>`
            const descriptionLi = document.createElement('li')
            descriptionLi.innerHTML = `Description: <span>${item.description}</span>`

            ul.appendChild(statusLi)
            ul.appendChild(categoryLi)
            ul.appendChild(descriptionLi)

            itemDiv.appendChild(img)
            itemDiv.appendChild(ul)
            blindBoxesContainer.appendChild(itemDiv)
        })
    })
}
