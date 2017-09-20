# Plentiful

This website is meant to help people
* get inspiration for recipes
* save down recipes and make notes like 'to cook on Monday' or 'reduce spices'
* create groceries list from favourite recipes

## Getting Started

Prerequisites

This project is built on Node. Go to https://nodejs.org and follow the instructions to download and install Node.

Installing

Fork, clone or download this repository to your desired directory. You have to install the required modules listed in the package.json file. This can be done automatically by entering the following code in your directory:

```
yarn install
```

The env is provided here so please be kind with my API key!
## Hosting

This project was deployed with Heroku, but you can choose your own server host. To use Heroku, go to https://www.heroku.com, create an account and follow the instructions to deploy your own project.

## Database

The project will also require a database. I used Heroku addon provided to connect with MongoDB.

### How to Use

1. The landing page provides a text box where you can search by ingredients, cuisine, cooking style etc.
2. Browse through the recipes provided, and click 'Add to Meals' to get it saved to your user profile
3. Clicking on my meals will list down your saved meals with total calories calculated, and total time required displayed on top.
4. You can delete all of the recipes if you want to start your plan again
5. Note down if you want to cook this again with the buttons provided.

## Live Version
https://thecodingdog.herokuapp.com/

## Built With
  * jquery
  * bcrypt
  * body-parser
  * connect-flash
  * connect-mongo
  * dotenv
  * express
  * express-handlebars
  * express-session
  * mongo-connect
  * mongoose
  * nodemon
  * passport

## User Story
1. search recipes
2. add to favorites
3. track calorie intake
4. check how much time required to prepare meals
5. delete and re-plan again
6. view saved plans and key ingredients
7. able to jot down some notes for the recipes
8. create groceries list from favourite recipes
9. SMS list to pre-configured mobile numbers

## Model diagram
![alt text](public/img/ERD.png?raw=true 'start')

## Wireframes
![alt text](public/img/wireframe.jpg?raw=true 'start')

## Acknowledgments
thanks to the internet... which gave me
* api from yummly
* api from Twilio
* background photos from unplash
* css templates from various codepen sources

thanks to TA, instructor and classmates for solving my bugs!
