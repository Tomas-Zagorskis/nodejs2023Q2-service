# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
## 1. Start App for development:
### Downloading

```
git clone {repository URL}

cd {directory name}
```

### Installing NPM modules

```
npm install
```

### Create Env

```
cp .env.example .env
```

### Running application

```javascript
npm start  // postgres image must be running

// or using docker

docker-compose up
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## 2. Start App for production with docker:
### Pull Images
```js
  // backend api
  docker image pull tomza23/home-library:v1

  //  for database using postgresSQL
  docker image pull postgres:15-alpine
```

### Create Network
```
  docker network create my-net
```

### Create ENV
- Copy or create .env.example file with its content from code source in your local machine.

### Run Images
```js
  // database
  docker run --name postgres-db -d --network=my-net --env-file ./.env.example -p 5432:5432 -v db_data:/var/lib/postgresql/data --restart always postgres:15-alpine

  // api
  docker run --name api -d --network=my-net --env-file ./.env.example -p 4000:4000 tomza23/home-library:v1
```
Flags:
- `--name` - container name;
- `-d` - detach image from terminal after cmd line is written;
- `--network` - connect images to local network;
- `--env-file` - attach enviroment variables to image;
- `-p` - map port with image;
- `-v` - create volume;
- `--restart` - restart image after crash.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

## Migration

- Create new migration:
```
npm run migration:create
```
- Run created migrations:
```
npm run migration:run
```
- Revert migrations:
```
npm run migration:revert
```

## Scan docker image 

```
npm run docker:scan
```

## Auto-fix and format

```
npm run lint
```

```
npm run format
```

## Server API

- `OpenApi` (`/api` route) - endpoints documentation

- `Users` (`/user` route)

  - `GET /user` - get all users
  - `GET /user/:id` - get single user by id (uuid)
  - `POST /user` - create user (following request body should be used)
    ```
      login: string;
      password: string;
    ```
  - `PUT /user/:id` - update user's password with attributes:
    ```
      oldPassword: string;
      newPassword: string;
    ```
  - `DELETE /user/:id` - delete user by id (uuid)

  - `Tracks` (`/track` route)

    - `GET /track` - get all tracks
    - `GET /track/:id` - get single track by id (uuid)
    - `POST /track` - create new track with attributes:
      ```
        name: string;
        artistId: string | null;
        albumId: string | null;
        duration: number;
      ```
    - `PUT /track/:id` - update track info
    - `DELETE /track/:id` - delete track by id (uuid)

  - `Artists` (`/artist` route)

    - `GET /artist` - get all artists
    - `GET /artist/:id` - get single artist by id (uuid)
    - `POST /artist` - create new artist with attributes:
      ```
        name: string;
        grammy: boolean;
      ```
    - `PUT /artist/:id` - update artist info
    - `DELETE /artist/:id` - delete artist by id (uuid)

  - `Albums` (`/album` route)

    - `GET /album` - get all albums
    - `GET /album/:id` - get single album by id (uuid)
    - `POST /album` - create new album with attributes:
      ```
       name: string;
       year: number;
       artistId: string | null;
      ```
    - `PUT /album/:id` - update album info
    - `DELETE /album/:id` - delete album by id (uuid)

  - `Favorites`
    - `GET /favs` - get all favorites
    - `POST /favs/track/:id` - add track to the favorites
    - `DELETE /favs/track/:id` - delete track from favorites
    - `POST /favs/album/:id` - add album to the favorites
    - `DELETE /favs/album/:id` - delete album from favorites
    - `POST /favs/artist/:id` - add artist to the favorites
    - `DELETE /favs/artist/:id` - delete artist from favorites
