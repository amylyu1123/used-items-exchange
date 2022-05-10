# team26

## Overview
This is a used-item exchange website for used items for UofT students and staff. 

Website Link: https://group-team26.herokuapp.com/

Standard User:
User1 - username: user, password: user, email: user@user.com
User2 - username: user1, password: user1, email: user1@user.com

Admin username: admin, password: admin

*NOTE: Our project used to be a blind box exchange website, but the issue with user benefit exists. After discussion and taking adive from our TA Ahmad, we finally change it to the used-item exchange website.*

## Authenticate Part
This part contain three mainly functions: signup, login, and forget passowrd.
#### Forget password
- If user clicks forget passsword button, user would be asked for providing the account's username, email address, and a new password for this account. If the username and email matches, and the new password is valid, user would successfully reset the password. And the new passwod would be encrypted.

#### Sign up
- User could signup a new account by giving username, email, and passward. After successful signup, new user's data would be added into the database with encrypted password, and user could use the new account to login. 

## User Part
After user logins, there is a navigation bar on the left side, which enables user to switch between multiple pages.

#### Profile Page
- In the profile page, current user can see their username, email, preferred exchange method, preferred exchange building, and profile image. They can also change these information by clicking 'edit profile' button.
- Under personal information, all current user's posted items are shown.
- By clicking 'Post New Box', user will be redirected to the Post Page where they can post used items. 
  
#### Post Page
- User can upload a used item with one image, one piece of description and a category. Clicking 'submit' button will add these information to the database.
- Due to the limitation and constraints of Cloudinary and multipart we are taught to use for image uploading, we can not upload large size images. This also applies to profile image uploading.

#### Markets Page
- Markets is the place that contains all available items not belong to current users, and their status is 'Active' for exchange.

- For each item in market, the description, category, the owner's preferred method of exchange, and preferred building at UOfT to exchange will be shown. 
Users can select to search all items by their category. They can choose the items they would like to exchange by clicking on the 'Request Exchange' button of that item. This will redirect to the request exchange page.

- Request Exchange Page will show this user's items that has not been confirmed to exchange(status is 'Active'). They can click on any image to view it more clearly. If they have made an decision to choose any of them to exchange, click on the button(Exchange) below that blind box to proceed. Once they press 'OK' on the popup, they cannot undo and their exchange request will be sent to the item owner. They can also press cancel to have more time to decide, or press 'Return To Market' to return to the previous page.

#### Exchange Page
- Exchange page shows all received exchange request for this user's items. For each request, the left side has the same information shown on market of the other user's items they want to use for exchange. The right side is the image of this user's item that has been selected to exchange by the other user. Similarly, user can click on images to view it more clearly. Also, this user can select to search all received exchange request of items by their category.

- If this user has made an decision to confirm any exchange, click on the button(Confirm Exchange) below on the bottom-left of that request to proceed. Once they press 'OK' on the popup, they cannot undo and this means that they accept the exchange request. Both users contact information(email) will be shown on the specific item of the section of 'My Items' on their user profiles(Profile Page). They can also press cancel to have more time to decide.


## Admin Part
- After admin user login, it will show the main view page for the admin. Left side of each page is a navigate bar for admin. Users indicates view for all users in the database. Items indicates view for all the item in the database. Log out indicates log out, and it will jump to the index page to login again. Right now, we only have one admin user.

#### Users view 
- Features including update a user, see the detail of a user, delete a use from database, block a user, add new user, and search user by username.

- End user(admin) could click on the ‘Add User’ button and add a new user by entering their username, email, password, status(active/inactive), exchanging method, and exchanging building in the adding user page. Since user should choose their own profile picture, so didn't include in the add user feature. Whatever the admin click ‘Save’ or ‘Cancel’, it will redirect to the main view page. The webpage will be auto refresh.

- Admin could also block a user. When admin click ‘Block’ button, the status of the regular use changes to “Inactive”, both on the page and in the database. As a result, they could no long login. The webpage will be auto refresh.

- When admin click the ‘Delete’ button, the webpage will pop up the alert window to confirm this action. Once admin click ‘OK’. Then the user will be deleting from the database. The webpage will be auto refresh.

- Admin could click on the ‘Detail’ button to see the details of each user. The information contains: their username, email, preferred exchanged method, preferred exchange building. On the left is their profile image. By default, the image is the grey portrait with white in the background. Once admin click on the ‘Back’ button, it will redirect to the main view page.

- Admin could click on the ‘Update’ button to update the information for each user. The information admin user could change contains: their username, email, preferred exchanged method, preferred exchange building. Whatever the admin click ‘Save’ or ‘Cancel’, it will redirect to the main view page. The webpage will be auto refresh. And then click on ‘Detail’ button, admin could see the changes.


- Admin could also search users by their username. Once admin user clicks on the ‘Search’ button, it will display the user with username match the admin entered in. If admin doesn’t enter anything, it will display all the users, in the database.


#### Items view
- Features including see the detail of item, delete an item, search by owner, and search by category. We delete the close trade feature. Because for each item we stored in the database, we only store the item id during or after a trade. And when an item is confirmed, regular users’ profile will display the email of the person who exchanged the item. But admin user doesn’t have email. So, if admin user could close the trade, it’s hard to check in the user’s profile page and in the admin view.

- Search by owner name will display out the user's item which owner matches the username admin entered in. Same as before, when admin user doesn’t enter anything and click ‘Search’ button, it will display all the items in the database. 

- Search by category will display the items that belong to this category. 

- By clicking the ‘Detail’ button, it will jump to another page with image and details of this item. Information of details are the owner, category, status(active/confirmed), potential buyers, and exchanged buyer. Since we stored the item id if potential buyers, and exchanged buyer, here the page will display the owner of those item. So, it will happen that for potential buyers, owners are all the same. 

- When admin user clicks on ‘Delete’ button, it will delete the item form the database. If the status of deleted item is confirmed. Then the exchanged item will be also deleted from the database.


## Routes Overview
All routes below are expected to receive a JSON object, except we explicitly mention. To be specific, routes with image uploading will require form-data type.

#### admin.js
POST /user/add
Add a new user to the database. It also uses middleware to check mongo connection and authentication.
{
username: type <String>,
password: type <String>,
email: type <String>,
status: type <String>,
        	method: type <String>,
        	building: type <String>,
}
Returns the object of the new user

POST /signups
A POST route for admin signup. It also uses middleware to check mongo connection
{
username: type <String>,
password: type <String>

}
Returns the object of the new admin user

POST /logins
A POST route for admin login. It also uses middleware to check mongo connection.
{
username: type <String>,
password: type <String>

}
If admin login successfully, then it will redirect to the main page of admin view.

GET /user
A GET route to get all users from the database. It also uses middleware to check mongo connection and authentication.
Returns an array of users in the database

GET /user/:name
A GET route to get one user from the database.It also uses middleware to check mongo connection and authentication.
Returns an object of user in the database that match to the name that url passed in 

GET /detail
A GET route to send a certain user to the client. It also uses middleware to check mongo connection and authentication. Must use it after the route /user/:name
Returns an object of user in the database that stored in variable temp when route /user/:name has called

PATCH /update/:id
A PATCH route to update the information of a user given by the id. It also uses middleware to check mongo connection and authentication.
{
	status:  type <String>,
	username:  type <String>,
	email:  type <String>,
	preferredMethod:  type <String>,
	preferredBuilding:  type <String>,
}
Returns an object of the updated user.

DELETE /user/:id
A DELETE route to remove a user by their id
Returns an object of the deleted user.

### users.js
POST /login
Check if the username and password match. If they match, create a session for this user and redirect to /main_page
{
   username: String,
   password: String
}

POST /signup
Includes mongoChecker. Sign up a user with a given username, password, and email. Return the user if created successfully, return error otherwise.
{
	“username”: String,
	“password”: String,
	“email”: String
}

PUT /forget_password
Includes mongoChecker. Used to reset a password for a user with a given username and email. Return the new user just set if username and email match a user in the database, return error otherwise.
{
	“username”: String,
	“newPassword”: String,
	“email”: String
}

GET /logout
Log current user out. No input required. Redirect to index page, if we have a error, return the error. 

GET /users/:id
Includes mongoChecker and authenticate. No input required. Return the user found with <id>, else return error.

Get /currUser
Includes mongoChecker and authenticate. No input required. Return the user currently logged in if found, else return error.

PUT /currUser
Includes mongoChecker and authenticate. Update current user(exclude profile image), return the updated user if success, else return the error.
{
	“username”: String,
	“email”: String,
	“preferredBuilding”: String,
	“preferredMethod”: String
}

PUT /currUserProfileImg
Includes mongoChecker, authenticate and multipartMiddleware. Update user profile image. The input format is form-data.
{
	image: image file
}

GET /users
Includes mongoChecker  and authenticate. No input required. Return all users in the database, if an error is thrown, return the error.

### items.js
POST /item

Includes mongoChecker and multipartMiddleware.  A Post route which posts  a new item for the current user to the database. Return the item posted if successful, else return the error. The input format should be form-data.
{

image: image file

owner: ObjectId, 

category: String, 

description: String
}


GET /items
A GET route to get all items from the database. It also uses middleware to check mongo connection and authentication. 
Returns an array of items in the database

GET /currItems
a GET route to get all items from the database that belong to the current user. It also uses middleware to check mongo connection and authentication.
Returns an array of items in the database that belong to the current user

GET /itemToUser/:id
A GET route to get the owner’s information by a given id of the item. It also uses middleware to check mongo connection and authentication.
Return the information of the user in JSON format.

PATCH /item/:myItemId/:otherItemId
A PATCH route to update the item’s information according to myItemId and otherItemId. It will check the request body to patch. If request body contains status, which is 
{
	status: ‘Confirmed’
}, it will update status of two items with _id myItemId and otherItemId. Otherwise, when the request body contains nothing, it will update potentialItems with myItemId added(no duplicate allowed) of the item with _id otherItemId. 
It also uses middleware to check mongo connection and authentication.
Return nothing(only check the status is 200 in client side)

GET /items/:category
“a GET route to get all items from the database that belong to the same category. It also uses middleware to check mongo connection and authentication.”
Returns an array of items in the database that belong to a specific category.

GET /item/:id
“a GET route to get the item by the given id. It also uses middleware to check mongo connection and authentication.”
Returns the information of the item.

GET /itemsDetail
“A GET route which gets the detail information of the item stored in temp”.

GET /requestItem/:id
A GET route to get the item’s information by a given id of the item. It stores the value of id to the variable selectedItem when this user request item exchange. It also uses middleware to check mongo connection and authentication.
Return the information of the selected item in JSON format.

GET /requestItem
A GET route to get the item’s information by selectedItem stored from GET /requestItem/:id. Otherwise(if not selected item), return status 400. It also uses middleware to check mongo connection and authentication.
Return the information of the selected item in JSON format.

DELETE /delete/:imageId
“A DELETE route to remove an image by its image id”.
Return the image that has been removed.



### webpage.js 
GET /
“route for root: should redirect to index route”

GET /index
“Redirect the current location to index.html”

GET /admin_login
“Redirect the current location to admin_login.html”

GET /user_login
“Redirect the current location to user_login.html”

GET /request_exchange
“If the session contains user’s id, redirect the current location to its corresponding HTML file, otherwise, redirect to user/admin login page”

GET /admin_page
“If the session contains admin’s id, redirect the current location to its corresponding HTML file, otherwise, redirect to admin login page”

GET /admin_item
“If the session contains admin’s id, redirect the current location to its corresponding HTML file, otherwise, redirect to admin login page”

GET /user_add
“If the session contains admin’s id, redirect the current location to its corresponding HTML file, otherwise, redirect to admin login page”

GET /user_detail
“If the session contains admin’s id, redirect the current location to its corresponding HTML file, otherwise, redirect to admin login page”

GET /user_update
“If the session contains admin’s id, redirect the current location to its corresponding HTML file, otherwise, redirect to admin login page”

GET /item_detail
“If the session contains admin’s id, redirect the current location to its corresponding HTML file, otherwise, redirect to admin login page”
