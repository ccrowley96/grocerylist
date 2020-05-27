# GroceryList
### A free communal grocery list web application
Created using (Node, Express, Mongo, React) by Cory Crowley

Deployed on Heroku


# Development & Contribution Set-up
- Install Node.js, MongoDB, & node package manager NPM
  - [Install NPM & Node.js](https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm)
  - [Install MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)
- Make sure git is installed and configured on your computer

**Use scripts below to run the application locally**

```
# install dependancies
npm install

# Start local mongodb instance (Terminal 1)
mongod

# run the server in development mode with nodemon (Terminal 2)
npm run server-dev

# runs create-react-app front-end (need to be in /client folder) (Terminal 3)
cd client && npm start
```

# Setting up .env Environment Variables
**Before you can run, test, or build the application, you must create a .env file!**

|Variable|Value|
|--------|-----|
|PORT|3000|
|MONGO_CONNECT_DEV|mongodb://127.0.0.1:27017|

## Contributing
A general guide to contribute in this repository is:
1. Fork it!
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request :rocket:

### [Useful git commands](https://www.git-tower.com/blog/posts/git-cheat-sheet)
