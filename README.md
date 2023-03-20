<h1  align="center">Welcome to monolith-boilerplate 👋</h1>

<p>

<img  alt="Version"  src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000"  /> <img  alt="Documentation"  src="https://img.shields.io/badge/documentation-yes-brightgreen.svg"  /> <img  alt="Maintenance"  src="https://img.shields.io/badge/Maintained%3F-yes-green.svg"/>

</p>

> monolith-boilerplate is a standard implementation for MERN projects, which can be used to initialize them. It was originally made for APM-verniciature app, but it can fit future projects.

### 🏠 [Homepage](https://github.com/Gate42-srl/monolith-boilerplate/blob/feature/initialization/README.md)

## Description

monolith-boilerplate is a typescipt MERN application which uses fastify to handle API calls and react to handle a frontend debugging page. It is capable of handle user registration, login and refresh its session also with the relative FE react interface. It also implements a websocket connection with a notification system on frontend side which communicates with it. The app is also capable of manage users with each of the CRUD basic operations and switch among multiple databases. As for this implementation, postgreSQL and MongoDB databases are supported but it's easy enough to add some more database modifing the index file into the **_"databases"_** folder along with a new configuration file for it.

There are also tests suites already written and a swagger documentation which is usable by running the app and open, via browser:

```
http://localhost:5000/api-docs/
```

## Installation

Installing project dependecies is very simple and it's achievable just by opening a terminal into the folder and run the following command:

```
npm run installation
```

Which will install dependecies for both BE and react FE.

## Usage

### Run in development environment

Since it has a backend and react frontend side, the application can be start each of them singolarly or both at the same time.

If you want to start just the backend, run the following command on the console:

```
npm run server
```

Same goes with frontend, but run this command instead:

```
npm run client
```

Finally, if you wish to run them both at the same time just run the following command:

```
npm run dev
```

### Run in staging or production environment

After deploying the app using an host service of your choice based on your project preferencies, just run the following command:

```
npm run build
```

Which builds the application into the container converting typescript code into javascript formatted code, then run this other command:

```
npm run start
```

To effectively, start to app.

## Tests

If you just want to run tests, use the following command:

```
npm run test
```

Instead, if you want, you can use another command which also allows you to see how much of your code is covered with your test suites using a table which is built into the console itself. The command is the following:

```
npm run coverage
```

## Author

👤 **Gate42**

- Github: [@gate42srl](https://github.com/gate42srl)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Gate42-srl/monolith-boilerplate/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Gate42](https://github.com/gate42srl).<br />
