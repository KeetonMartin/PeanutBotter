const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cool = require('cool-ascii-faces');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/lunch', (req, res) => res.send(getLunch()))
  .get('/menu/haverford/todayMenu', (req, res) => res.send(menuHaverfordTodayMenu()))
  .get('/menu/brynmawr/todayMenu', (req, res) => res.send(menuBrynMawrTodayMenu()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

menuHaverfordTodayMenu = () => {

  let dummyJSON = {
    "messages": [
      {"text": "February 3, 2021"},
      {"text": "Brunch"},
      {"text": "10:00 AM: Pancakes, Scrambled Eggs, Tofu Scrambled, Vegan Sausage, Turkey Sausage Links, Diced Potatoes, Bagels, Muffins"},
      {"text": "11:30 AM, Grilled Turkey & Swiss Sundried Tomato Melt, Singapore Street Noodles , Roasted Red Potatoes , Roasted Vegetables, Pizza"},
      {"text": "Dinner"},
      {"text": "Grilled Flank Steak Chimichurri, Cauliflower Rice Burrito Skillet, Mexican Corn, Chipotle Roasted Potatoes, Grilled Chicken Breast, Pasta & Sauce, Pizza"}
    ]
    }
    
  return dummyJSON;
}

menuBrynMawrTodayMenu() = () => {

  let dummyJSON = {
    "messages": [
      {"text": "February 3, 2021"},
      {"text": "Lunch"},
      {"text": "Fire Roasted Tomato Soup, Grilled American Cheese Sandwich*, Buffalo Tofu Wings V, Sundried Tomato, Artichoke & Swiss Frittata, Turkey Bacon, Shoestring Fries*, Chefs Choice Vegetabl, Potato Chips, Vegan Vanilla Cupcakes , Chocolate Chip Cookies*"},
      {"text": "Dinner"},
      {"text": "Louisiana Spiced Tofu V, Cajun Marinated Chicken Breast, Seasoned Baby Carrots, Dirty Rice V, Garlic Bread, Split-Top Dinner Roll*, Pasta Bar : Spaghetti, Marinara Sauce, Meat Sauce, Deep Chocolate Cake V, Lemon Cake*"}
    ]
    }
    
  return dummyJSON;
}
  

getLunch = () => {

  let dummyJSON = {
    "messages": [
      {"text": "Welcome to the Chatfuel Rockets!"},
      {"text": "What are you up to?"}
    ]
   }
   
  return dummyJSON;
}
  

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}
