const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cool = require('cool-ascii-faces');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
var dataFinal =  { // 0 is Sunday, 6 is Saturday
  1:[],
  2:[],
  3:[],
  4:[],
  5:[]
}

async function scrapeProduct(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('table tr td'))
          return tds.map(td => td.innerText)
  });

  data.splice(0,5); // removing the first 5 elements 
  // console.log(data.length)

  dataFinal = { // 0 is Sunday, 6 is Saturday
      1:[],
      2:[],
      3:[],
      4:[],
      5:[]
  }

  for (let index = 0; index <= 1152; index += 4) {
      if (index <= 232){
          dataFinal[1].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
      }
      else if (index > 232 && index <= 468){
          dataFinal[2].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
      }
      else if (index > 468 && index <= 704){
          dataFinal[3].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
      }
      else if (index > 704 && index <= 940){
          dataFinal[4].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
      }
      else {
          dataFinal[5].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
      }
  }
  console.log("done with scraping!");
  // console.log(dataFinal);

  await browser.close();
}

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
  .post('/busses', function(req, res) {
    let current_timestamp = Date.now();
    var day_needed;
    var full_date;
    if(req.body.last_clicked_button_name=="ASAP"){
      full_date = new Date(current_timestamp);
      day_needed = full_date.getDay();
    }
    else{
      full_date = new Date(req.body.datetime);
      day_needed = full_date.getDay();
    }
    let college = req.body.college;

    console.log("day needed: ", day_needed);
    console.log("full date: ", full_date);
    console.log("college: ", college);
    console.log("datetime: ", datetime);
    var resultBusQuery = getBus(day_needed, college, full_date);
    let returnJSON = {
      "messages": [
        {"text": "Here are the next available busses after " + full_date.toUTCString()+ " :"}
      ]
     }
    var text_message = "";
    for(var i=0; i<resultBusQuery.length; i++){
        text_message = text_message + resultBusQuery[i];
     }
    returnJSON.messages[0].push(text_message);
    
    console.log(resultJSON);
    res.send(resultJSON)})
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


    let returnJSON = {
      "messages": [
        {"text": "Test"}
      ]
     }


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


    
      
    
    res.send(returnJSON)})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

let variables_to_text_dictionary = {
  "departingHaverford": "Departing Haverford: ",
  "departingBrynMawr": "Departing Bryn Mawr: ",
  "departingSwarthmore": "Departing Swarthmore:",
  "arrivingAtBrynMawr": "Arriving at Bryn Mawr: ",
  "arrivingAtHaverford": "Arriving at Haverford: ",
  "arrivingAtSwarthmore": "Arriving at Swarthmore: ",
}



scrapeProduct('https://www.brynmawr.edu/transportation/blue-bus-bi-co');


function compareTime(time1, time2) {
  let t1 = new Date();

  if (time2[1] == ':'){
      if (time2[4] == 'p'){
          t1.setHours(parseInt(time2[0]) + 12, time2[2]+time2[3], 0);
      }
      else{
          t1.setHours(time2[0], time2[2]+time2[3], 0)
      }
  }
  else{
      if (time2[5] == 'p' && parseInt(time2[0]+time2[1]) == 12){
          t1.setHours(parseInt(time2[0]+time2[1]), time2[3]+time2[4], 0);
      }
      else if (time2[5] == 'p' && !(parseInt(time2[0]+time2[1]) == 12)){
          t1.setHours(parseInt(time2[0]+time2[1]) + 12, time2[3]+time2[4], 0);
      }
      else{
          t1.setHours(time2[0], time2[2]+time2[3], 0)
      }
  }

  return time1 < t1
  
}

function getBus(date, destination, time) {
  if (destination == 'Haverford'){
      for (let index = 0; index < dataFinal[date].length; index ++){
          if (compareTime(time, dataFinal[date][index].departingBMC)){
              var bussesArray = []
              bussesArray.push({departingBrynMawr: dataFinal[date][index].departingBMC, arrivingAtHaverford: dataFinal[date][index].arrivingHC});
              bussesArray.push({departingBrynMawr: dataFinal[date][index + 1].departingBMC, arrivingAtHaverford: dataFinal[date][index + 1].arrivingHC});
              bussesArray.push({departingBrynMawr: dataFinal[date][index + 2].departingBMC, arrivingAtHaverford: dataFinal[date][index + 2].arrivingHC});
              return bussesArray

              // return [dataFinal[date][index].departingBMC, dataFinal[date][index + 1].departingBMC, dataFinal[date][index + 2].departingBMC]
          }
      }
  }
  else if (destination == "BrynMawr"){
      for (let index = 0; index < dataFinal[date].length; index ++){
          if (compareTime(time, dataFinal[date][index].departingHC)){
              var bussesArray = []
              bussesArray.push({departingHaverford: dataFinal[date][index].departingHC, arrivingAtBrynMawr: dataFinal[date][index].arrivingBMC});
              bussesArray.push({departingHaverford: dataFinal[date][index + 1].departingHC, arrivingAtBrynMawr: dataFinal[date][index + 1].arrivingBMC});
              bussesArray.push({departingHaverford: dataFinal[date][index + 2].departingHC, arrivingAtBrynMawr: dataFinal[date][index + 2].arrivingBMC});
              return bussesArray
              // return [dataFinal[date][index].departingHC, dataFinal[date][index + 1].departingHC, dataFinal[date][index + 2].departingHC]
          }
      }
  }
  
}


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
