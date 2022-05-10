'use strict'
const log = console.log;

/* Event listeners for click */
const submit = document.querySelector('.form_submit');
submit.addEventListener('click', login);


function login(e) {
    e.preventDefault();

    const url = '/logins';

    let user = {
        username: document.getElementById('login_account_field').value,
        password: document.getElementById('login_password_field').value
    }

    // Create our request 
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(user),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request)
    .then(function(res) {
        if (res.status === 200){
            log('Login Successfully')
            document.location = '../admin_view/admin_page.html'
        } else if (res.status === 400){
            alert("Invalid Account Number or Passward. Please try Again.")
        }
    }).catch((error) => {
        log(error)
    })
}