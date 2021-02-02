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
  .post('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/lunch', (req, res) => res.send(getLunch()))
  .post('/menu', function(req, res) {
    var timezone = req.body.timezone;
    var time_to_show = req.body.last_clicked_button_name;

    let dummyJSON = {
      "Haverford" : {
         "breakfast" : `WEEK 1
                        10:00 AM
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
                        Pizza    `,
         "lunch" : "None",
         "dinner" : `Four Cheese Beef Lasagna
                    Spaghetti Squash Primavera
                    Potatoes Parmesan
                    Ratatouille
                    Garlic Bread
                    Grilled Chicken Breast
                    Pasta & Sauce
                    Pizza`,
      }}

      let returnJSON = {
        "messages": [
          {"text": ""}
        ]
       }
      if(time_to_show=="Menu right now"){
        returnJSON.messages[0].text = dummyJSON.Haverford.breakfast;
      }
      else{
        returnJSON.messages[0].text = "Breakfast:\n" + dummyJSON.Haverford.breakfast + "\n Lunch:\n" + dummyJSON.Haverford.lunch + "\n Dinner:\n" + dummyJSON.Haverford.dinner;
      }
    
      res.send(returnJSON)})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

    
    

getLunch = () => {

  let dummyJSON = {
    "user1" : {
       "name" : "mahesh",
       "password" : "password1",
       "profession" : "teacher",
       "id": 1
    },
    
    "user2" : {
       "name" : "suresh",
       "password" : "password2",
       "profession" : "librarian",
       "id": 2
    },
    
    "user3" : {
       "name" : "ramesh",
       "password" : "password3",
       "profession" : "clerk",
       "id": 3
    }
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
