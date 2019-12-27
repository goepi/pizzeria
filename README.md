## Monorepo structure
This is a lerna project with two main packages called **pizzeria-backend** and **pizzeria-frontend**.

## How to run in development


### pizzeria-backend
`npm run start:backend`

What this does is run two other npm scripts sequentially: one to run `webpack` in watch mode, and the other to run the `node` api server using `nodemon`.

For some reason running the backend like this does not show debugging info in the console. To see such information, run the two scripts in two separate terminals: `npm run start:backend:webpack-watch` and `npm run start:backend:server`.

You can now test the endpoints.

### pizzeria-frontend
`npm run start:frontend`

This just runs `react-scripts start`; this is the standard `create-react-app` way of running the app in development. You can navigate to `localhost:3000` and interact with the backend through there.

### Features
- sign up or sign in to an existing account
- add menu items to your cart
- checkout and make payment (integration with Stripe payments API is fully on the backend, the frontend just hits an endpoint to process the order)
- backend sends email on successful order
- see all orders on the frontend