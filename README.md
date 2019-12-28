## Monorepo structure
This is a lerna project with two main packages called **pizzeria-backend** and **pizzeria-frontend**. 
Everything is written in `TypeScript`, and `Webpack` is used in each package individually.

## How to run in development
First, at the root of the project, run `npm run bootstrap`, which simply npm installs everything (uses `lerna` to manage the dependencies).
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

### Endpoints
There is a `Router` class that I wrote to allow adding routes. I added this so I could add more complex routes, by using regular expressions to match the URI path.

The routes themselves are defined in `apps/pizzeria-backend/src/index.ts`.

`GET /tokens`
  - payload: { id: string }
  
`POST /tokens`
  - payload: { username: string, password: string }
  
`PUT /tokens`
  - payload: { id: string, extend: boolean }
 
`DELETE /tokens`
  - payload: { id: string }
 
`GET /users`
- queryString: { username: string }
- headers: { token: string }

`POST /users`
- payload: { username: string, password: string, email: string, address: string }

`PUT /users`
- payload: { username: string, password?: string, email?: string, address?: string }
- headers: { token: string }

`DELETE /users`
- queryString: { username: string }
- headers: { token: string }

`GET /users/:username/cart`
- headers: { id: string }

`PUT /users/:username/cart`
- headers: { id: string },
- payload: { cart: { [productId: string]: number } }
- adds products in passed in cart to the user cart

`DELETE /users/:username/cart`
- headers: { id: string },
- payload: { cart: { [productId: string]: number } }
- removes products in passed in cart from the user cart

`GET /users/:username/orders`
- headers: { id: string }

`POST /users/:username/checkout`
- headers: { id: string }


The use of `TypeScript` documents the types of inputs and outputs of the handlers.

### Note
- Regarding Mailgun integration, since I am using the sandbox, the final email can only be sent to specific email accounts added through the Mailgun web interface.