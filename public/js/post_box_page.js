'use strict'

const log = console.log;

const boxSpecs = document.querySelector('#boxSpecs')

var file;

boxSpecs.addEventListener('click', postBlindBox)

function postBlindBox(e) {

    if (e.target.classList.contains('submit')) {
        const boxSpecs = document.querySelector('#boxSpecs')

        const formData = new FormData(boxSpecs)
        
        const url = '/item'

        const request = new Request(url, {
            method: "post",
            body: formData,
        });

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
    }
}

document.querySelector('.uploader').addEventListener('change', function (e) {
    file = e.target.files[0]
})
