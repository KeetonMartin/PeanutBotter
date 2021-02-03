const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cool = require('cool-ascii-faces');
const bodyParser = require('body-parser');


express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/lunch', (req, res) => res.send(getLunch()))
  .get('/menu/haverford/todayMenu', (req, res) => res.send(menuHaverfordTodayMenu()))
  .get('/menu/brynmawr/todayMenu', (req, res) => res.send(menuBrynMawrTodayMenu()))
  .post('/menu', function(req, res) {
    console.log(req);
    console.log(req.body);
 
    let current_timestamp = Date.now();
    let full_date = new Date(current_timestamp);
    let current_hour = full_date.getHours;
    
    let breakfast_start = new Date();
    let breakfast_end = new Date();
    breakfast_start.setHours(10,00,00);
    breakfast_end.setHours(10,59,59);

    let lunch_start = new Date();
    let lunch_end = new Date();
    lunch_start.setHours(11,00,00);
    lunch_end.setHours(13,29,59);
    
    let dinner_start = new Date();
    let dinner_end = new Date();
    dinner_start.setHours(16,00,00);
    dinner_end.setHours(17,29,59);
    
    var timezone = req.body.timezone;
    var college = req.body.college;
    var time_to_show = req.body.last_clicked_button_name;

    
    let menuJSON = {
      "Haverford":{
        "breakfast" : `10:00 AM
        French Toast Sticks
        Scrambled Eggs
        Tofu Scrambled
        Vegan Sausage
        Sausage Patties
        Shredded Potato
        Bagels, Muffins 
        
        11:30 AM
        Beef Burger
        Beyond Burger
        Boardwalk Fries
        Broccoli
        Pizza`,
        "lunch" : "None",
        "dinner" : `Four Cheese Beef Lasagna
        Spaghetti Squash Primavera
        Potatoes Parmesan
        Ratatouille
        Garlic Bread
        Grilled Chicken Breast
        Pasta & Sauce
        Pizza`,
      },
    "Swarthmore":{
      "breakfast":"Eggs, bacon",
      "lunch": "Chicken noodle soup",
      "dinner": "Pesto pasta, salmon"
    },
    "BrynMawr":{
      "breakfast": "Pancakes",
      "lunch": "Mushroom cream soup",
      "dinner": "Tacos"
    }
    };

    if(time_to_show=="Full menu today"){ // Show full day menu
      returnJSON.messages[0].text = "Breakfast:\n" + menuJSON[college].breakfast + "\n\nLunch:\n" + menuJSON[college].lunch + "\n\nDinner:\n" + menuJSON[college].dinner;
    }
    else{ // Show menu at the current time

      if(current_hour>=breakfast_start && current_hour<breakfast_end) { // breakfast time
        returnJSON.messages[0].text = "Breakfast:\n"+menuJSON[college].breakfast;
      }else{
        if(current_hour>=lunch_start && current_hour<lunch_end) { // lunch time
          returnJSON.messages[0].text = "Lunch:\n"+menuJSON[college].lunch;
        }
        else{
          if(current_hour>=dinner_start && current_hour<dinner_end) { // dinner time
            returnJSON.messages[0].text = "Dinner:\n"+menuJSON[college].dinner;
          }
          else{
            returnJSON.messages[0].text = "Sorry! The dining center is closed right now :(";
          }
        }
      }
      
    };


    let returnJSON = {
        "messages": [
          {"text": "Test"}
        ]
       }
      
    
    res.send(returnJSON)})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

    

menuBrynMawrTodayMenu = () => {

  let dummyJSON = {
    "messages": [
      {"text": "February 3, 2021"},
      {"text": "Lunch"},
      {"text": "Fire Roasted Tomato Soup, Grilled American Cheese Sandwich*, Buffalo Tofu Wings V, Sundried Tomato, Artichoke & Swiss Frittata, Turkey Bacon, Shoestring Fries*, Chefs Choice Vegetabl, Potato Chips, Vegan Vanilla Cupcakes , Chocolate Chip Cookies*"},
      {"text": "Dinner"},
      {"text": "Louisiana Spiced Tofu V, Cajun Marinated Chicken Breast, Seasoned Baby Carrots, Dirty Rice V, Garlic Bread, Split-Top Dinner Roll*, Pasta Bar : Spaghetti, Marinara Sauce, Meat Sauce, Deep Chocolate Cake V, Lemon Cake*"}
    ]
    };
    
  return dummyJSON;
}

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
    };
    
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
