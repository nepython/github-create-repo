# **`GitHub Create Repo`**
* This app creates a public GitHub repository in your github account using GitHub API.
* For doing so, it requires you to grant the required privileges.

## **Table of Contents**
* [**`GitHub Create Repo`**](#github-create-repo)
  * [**Table of Contents**](#table-of-contents)
  * [**Usage**](#usage)
  * [**Tech Stack**](#tech-stack)
  * [**Structure**](#structure)
    * [Entities: `/src/users/entities`](#entities-srcusersentities)
    * [Views: `/views`](#views-views)
    * [Controller: `/src/users/users.controller.ts`](#controller-srcusersuserscontrollerts)
    * [Static files: `/public`](#static-files-public)
    * [Services: `/src/users/users.controller.ts`](#services-srcusersuserscontrollerts)
    * [Migrations: `/src/migrations`](#migrations-srcmigrations)
    * [Database: `/db`](#database-db)
  * [**Error Handling**](#error-handling)
  * [**Installation**](#installation)
  * [**Migrations**](#migrations)
  * [**Change Client ID and Client Secret**](#change-client-id-and-client-secret)
  * [**Running the app locally**](#running-the-app-locally)
  * [**Running the app in production**](#running-the-app-in-production)
  * [**Test**](#test)

## **Usage**
![User Interface](/README-images/ezgif.com-optimize.gif)
* Open the index page.
* Click on `Authorize GitHub`. It will redirect to GitHub OAuth.
* Click on `Create Repository`. All Done!

`Note`: The page load might take 2-3 seconds, so please wait.

## **Tech Stack**
`Nest.js, HTML, CSS, JS, GitHub OAuth`

In Production: `Nginx, PM2, Microsoft Azure, Let's Encrypt`

## **Structure**
### Entities: `/src/users/entities`
  - It contains the format in which the User entity is to be saved in the database.
  - Presently the User entity contains the below attributes:
  - `id`: An auto-incrementing integer.
  - `code`: It is a temporary string used for authentication which expires in a short duration.
  - `access_token`: Access token is permanent. It is used for authentication and can last until a new access token is generated.
  - `username`: GitHub username. A unique constraint was added to avoid duplication.
  - `avatar_url`: We use the user avatar in the views.
### Views: `/views`
  - `index`: The index page for the app, contains a button leading to authorization.
   ![Index view](/README-images/Home%20Page.png)
  - `createRepo`: After successful authorization, this view appears. It contains a button for creating a repository with some files.
   ![Create repository view](/README-images/createRepo.png)
  - `success`: This view appears as a confirmation that the repository has been created successfully and contains the repository link.
    ![Success view](/README-images/success.png)
  - `error`: An error can occur while making the requests due to multiple reasons. Check out [Error Handling](#error-handling) for more details.
### Controller: `/src/users/users.controller.ts`
  - `createUser`:
    - request: `GET`
    - route: `/`
    - param: [code](#structure)
    - returns: `createRepo` view or `error` view
  - `createRepo`:
    - request: `GET`
    - route: `/createRepo`
    - param: [access_token](#structure)
    - returns: `success` view or `error` view
### Static files: `/public`
### Services: `/src/users/users.controller.ts`
  - `create`:
    - Checks the code returned by GitHub redirect and generates a new access token.
    - If a user with the given username is present in the database, then updates its access token else creates a new user.
  - `createRepo`:
    - Checks if user has a repository with the same name.
    - If they don't then create a repository, push some files in it.
### Migrations: `/src/migrations`
  - A migration file and custom migration scripts have been created to ease migrations.
### Database: `/db`
  - It gets created when the migrations are run.
  - `NOTE`: The database was not been committed.

## **Error Handling**
![Error view](/README-images/exists_error.png)
My code can handle the below three errors if they arise:
* GitHub OAuth Error: caused due to expired or bad code
* Repository already exists: The user already has a repository with the given name.
* During repository creation or Pushing files: These are runtime errors which can occur due to GitHub API issues.

## **Installation**
```bash
$ npm install
$ npm run build
```

## **Migrations**
:warning: Do not forget to run the migration before starting the app. It needs to be ran only once.
```bash
# Create migrations
$ npm run migration-generate

# Run the migrations
$ npm run migrate
```

## **Change Client ID and Client Secret**
You need to change client id and client secret in `/public/js/index.js`, `src/users/users.service.ts`.

## **Running the app locally**

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## **Running the app in production**
Check this [Digital Ocean article](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04).

## **Test**
Unit tests for this app have not been added.
