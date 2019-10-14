# Products shop And Admin Page in React
A Dynamic Products Shop and the Admin page build in react.

## Techincal Specifications
* The Backend is a REST API built in ExpressJs which is an MVC web-application framework for NodeJs.
* MongoDB is used as the NoSQL Database along with ExpressJs in the backend Rest API. Mongoose, a MongoDB ODM(Object Data Mapper) has also been used along with MongoDB in the database layer.
* The Frontend is built using ReactJs along with React-Router and Material UI as component library.

## Project Specifications
* The project has two resources: `Products` and `Users`.
* The Project has two User Roles: `Admin` and `User`(A normal shopper).
* The Project has Login & Register pages for the non logged-in users, a Shop page for the Logged-in users with user role as User, and Users page only visible to Admin along with actions to perform CRUD operations.
* The Admin has the right to carry out the CRUD operation on both the resources.
* They can Add/Remove/Edit/Delete the Products and the Users listed/have access on the site.
* The Project was primarily built to learn Javascript and how to run it on the backend using NodeJs. Also to experiment with NoSQL Databases.

## Requirements
* Express 4.x
* MongoDB 3.x
* Mongoose 5.x
* Node 8.x
* React-Router 5.x

## Installation
Clone the repository and Run the following commands in the terminal:
* ```npm run install_app``` (This will install the server's and the client's dependency packages)
* ```npm start``` (This will start the backend server. Alternatively, you can also run `npm run start_dev` to start the server with `nodemon`, which will look for the changes in the files and restart the server everytime)
* ```cd view && npm start``` (This will start the Frontend React application for Dev Environment. For Production, run `npm build` to build the FrontEnd for deployment)
