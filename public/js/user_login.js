'use strict'
const log = console.log;


/* Event listeners for click */
const login_submit = document.querySelectorAll('.form_submit')[0];
login_submit.addEventListener('click', login);

const signup_submit = document.querySelectorAll('.form_submit')[1];
signup_submit.addEventListener('click', signup);

const forget = document.querySelector('#forget_password');
forget.addEventListener('click', forget_password);

const message = document.getElementsByClassName('message')[0]

function login(e) {
    e.preventDefault();

    const url = '/login';

    let user = {
        username: document.getElementById('login_username_field').value,
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
            document.location = '/main_page' //redirect to main page
        } else{
            alert("Invalid Username or Passward. Please try Again.")
        }
    }).catch((error) => {
        log(error)
    })
}

function forget_password(e) {
    e.preventDefault();

    const url = '/forget_password'

    const username = prompt('Please enter your username:')
    const email = prompt('Please enter your email address:')
    const password = prompt('Please enter the new password:')

    //This regular expression come from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const email_checker = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (username.length < 3) {
        alert('Invalid Username. Please try again.');
        document.getElementById('signup_username_field').value = '';
        document.getElementById('signup_email_field').value = '';
        document.getElementById('signup_password_field1').value = '';
        document.getElementById('signup_password_field2').value = '';
    } else if (!email_checker.test(email)) {
        alert('Invalid Email Address. Please try again.');
        document.getElementById('signup_username_field').value = '';
        document.getElementById('signup_email_field').value = '';
        document.getElementById('signup_password_field1').value = '';
        document.getElementById('signup_password_field2').value = '';
    }  else{
        let user = {
            username: username,
            email: email,
            newPassword: password
        }

        const request = new Request(url, {
            method: 'put', 
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        log(request)
    
        fetch(request)
        .then(function(res) {
            if (res.status === 200){
                alert('Password modified successfully!')
            } else{
                alert(res)
            }
        }).catch((error) => {
            log(error)
        })
    }
}

function signup(e) {
    e.preventDefault();

    const url = '/signup';

    const username = document.getElementById('signup_username_field').value;
    const email = document.getElementById('signup_email_field').value;
    const password1 = document.getElementById('signup_password_field1').value;
    const password2 = document.getElementById('signup_password_field2').value;

    //This regular expression come from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const email_checker = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (username.length < 3) {
        message.innerText = 'Minimum Length of Username is 3!'
        message.setAttribute("style", "color: red")
        document.getElementById('signup_username_field').value = '';
        document.getElementById('signup_email_field').value = '';
        document.getElementById('signup_password_field1').value = '';
        document.getElementById('signup_password_field2').value = '';
    } else if (!email_checker.test(email)) {
        message.innerText = 'Invalid Email Address.'
        message.setAttribute("style", "color: red")
        document.getElementById('signup_username_field').value = '';
        document.getElementById('signup_email_field').value = '';
        document.getElementById('signup_password_field1').value = '';
        document.getElementById('signup_password_field2').value = '';
    } else if (password1 !== password2) {
        message.innerText = 'Password does not match.'
        message.setAttribute("style", "color: red")
        document.getElementById('signup_password_field1').value = '';
        document.getElementById('signup_password_field2').value = '';
    } else {
        let user = {
            username: username,
            password: password1,
            email: email
        }

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
            log(res)
            if (res.status === 200){
                message.innerText = 'Account created successfully!'
                message.setAttribute("style", "color: green")
            } else{
                message.innerText = 'Username already exists.'
                message.setAttribute("style", "color: red")
            }
        }).catch((error) => {
            log(error)
        })

        document.getElementById('signup_username_field').value = '';
        document.getElementById('signup_email_field').value = '';
        document.getElementById('signup_password_field1').value = '';
        document.getElementById('signup_password_field2').value = '';
    }
}