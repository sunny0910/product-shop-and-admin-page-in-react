# Product-Shop-And-Admin-Page-In-React
A Dynamic Product Shop and the Admin page build in react.

## Techincal Specifications
* The Backend is a REST API built in Express which is an MVC web-application framework for NodeJs.
* The Mongoose is used for the NoSQL Database along with ExpressJs in the backend Rest API. The Mongoose is an MongoDB ODM(object data modelling).
* The Frontend is built using ReactJs along with React's Material-UI and React-Router.
* The Project was built to learn Javascript and hence Javascript is used everywhere in the Project.

## Project Specifications
* The project has two resources as the Products and the Users.
* The Project has two User Roles, the Admin and the User.
* The Project has Login, Register pages for the Visitors(Non-LoggedIn), the Shop page for the LoggedIn users with user role as User, and Users page along with all action for CRUD operations for the User with user role as Admin.
* The Admin has the right to carry out the CRUD operation on both the resources.
* When a visitor(Non-LoggedIn) or a LoggedIn user with role as user visits the site, they will only be able to view the Shop page which will have the list of products in grid format.
* They can Add/Remove the Products to the cart. They can also view the single Product page by clicking on the product.
* When a LoggedIn user with role as Admin visits the site, he will be able to see the Shop page as well as the Users page.
* The Admin will be able to Perform Create, Read, Update, and Delete operations on both the resources.
