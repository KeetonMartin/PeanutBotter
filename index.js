const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cool = require('cool-ascii-faces');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

//For Keeton
const fetch = require('node-fetch');
var dataFinal =  { // 0 is Sunday, 6 is Saturday
  1:[],
  2:[],
  3:[],
  4:[],
  5:[]
}

var HCDiningFinal = {
  Breakfast: [],
  Lunch: [],
  Dinner: [],
};

dataFinal = scrapeProduct('https://www.brynmawr.edu/transportation/blue-bus-bi-co');
HCDiningFinal = scrapeHCDining('https://www.haverford.edu/dining-services/dining-center');


async function scrapeHCDining(url){
  console.log("start dc scraping");
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll('div.meal-container p'))
          return tds.map(td => td.innerHTML.split('<br>'))
  });

  HCDiningFinal = {
      breakfast: [],
      lunch: [],
      dinner: [],
  };

  let currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 5);

  if (currentDate.getDay() == 0 || currentDate.getDay() == 6 || (currentDate.getDate() < 8 && currentDate.getMonth() == 1)){
      data[0].splice(0, 2);
      data[1].splice(0, 2);
      HCDiningFinal.breakfast = "Sorry, no breakfast today!";
      HCDiningFinal.lunch = data[0].toString();
      HCDiningFinal.dinner = data[1].toString();
  }
  else{
      data[0].splice(0, 2);
      data[1].splice(0, 2);
      data[2].splice(0, 2);
      HCDiningFinal.breakfast = data[0].toString();
      HCDiningFinal.lunch = data[1].toString();
      HCDiningFinal.dinner = data[2].toString();
  }

  console.log(HCDiningFinal);
  await browser.close();
  return HCDiningFinal;
}

async function scrapeProduct(url){
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
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
  // console.log(dataFinal);
  
  await browser.close();
  return dataFinal;
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
  .get('/COVID/haverford', function(req, res) {

    let url = 'https://simplescraper.io/api/vIzhtsVrjPWCS71KNHJ5?apikey=lXsnWlRQFBsWnyWWohEtm9zukMCm2jM6&offset=0&limit=20';

    let composedMessage

    fetch(url)
    .then(res => res.json())
    .then((out) => {
      //JSON result in `out` variable

      console.log('Checkout this JSON! ', out);

      var positiveTests = parseInt(out["data"][0]["Positive Tests"]);
      console.log('pos tests: ' + positiveTests);
      var totalTests = parseInt(out["data"][0]["Total Tests"]);
      var positivityRate = Math.round(positiveTests * 10000.0 / totalTests) / 10000;

      composedMessage = {
        "messages": [
          {"text": "At Haverford, "+ totalTests +" tests have been conducted since the start of the semester."},
          {"text": "So far, " + positiveTests + " of them have been positive with a positivity rate of " + positivityRate}
        ]
        };  

      console.log("message out:" + composedMessage["messages"][0]["text"]);

      res.send(composedMessage);
      })
  })
  // .post('/busses', function(req, res) {
  //   let current_timestamp = Date.now();
  //   var day_needed;
  //   var full_date;
  //   if(req.body.last_clicked_button_name=="ASAP"){
  //     full_date = new Date(current_timestamp);
  //     day_needed = full_date.getDay();
  //   }
  //   else{
  //     full_date = new Date(req.body.datetime);
  //     day_needed = full_date.getDay();
  //   }
  //   let college = req.body.college;
  //   var resultBusQuery = getBus(day_needed, college, full_date);
  //   let returnJSON = {
  //     "messages": [
  //       {"text": "Here are the next available busses after " + full_date.toUTCString()+ " :"}
  //     ]
  //    }
  //   var text_message = "";
  //   for(var i=0; i<resultBusQuery.length; i++){
  //       text_message = text_message + resultBusQuery[i];
  //    }
  //   returnJSON.messages[0].push(text_message);
  .post('/busses', function(req, res) {
    let current_timestamp = Date.now();
    // let etc = current_timestamp.toLocaleString('en-US', { timeZone: 'America/New_York' });
    var day_needed;
    var full_date;
    if(req.body.last_clicked_button_name=="ASAP"){
      full_date = new Date();
      full_date.setHours(full_date.getHours() - 5);
      day_needed = full_date.getDay();
      
    }
    else{
      full_date = new Date(req.body.needed_time);
      full_date.setHours(full_date.getHours() - 5);
      day_needed = full_date.getDay();
    }
    let college = req.body.college;

    console.log("day needed: ", day_needed);
    console.log("full date: ", full_date);
    console.log("college: ", college);
    console.log("datetime: ", req.body.needed_time);
    var resultBusQuery = getBus(day_needed, college, full_date);
    console.log("resultBusQuery: ", resultBusQuery);
    let returnJSON = {
      "messages": [
        {"text": "Here are the next available busses for the chosen time: \n"}
      ]
     }
    var text_message = "";
    for(var i=0; i<resultBusQuery.length; i++){
      for(var key in resultBusQuery[i]) {
        var value = resultBusQuery[i][key];
        text_message = text_message + variables_to_text_dictionary[key] +": "+value + "\n";
      };
      text_message = text_message +"\n";
     }
    returnJSON.messages.push({"text":text_message});
    
    console.log(returnJSON);
    res.send(returnJSON)})
  .post('/menu', function(req, res) {
    // console.log(req);
    // console.log(req.body);
 
    let full_date = new Date();
    full_date.setHours(full_date.getHours() - 5);
    let current_hour = full_date.getHours();
    
    
    let breakfast_start = new Date();
    let breakfast_end = new Date();
    breakfast_start.setHours(10,00,00);
    breakfast_start.setHours(breakfast_start.getHours() - 5);
    breakfast_end.setHours(10,59,59);
    breakfast_end.setHours(breakfast_end.getHours() - 5);


    let lunch_start = new Date();
    let lunch_end = new Date();
    lunch_start.setHours(11,00,00);
    lunch_start.setHours(lunch_start.getHours() - 5);

    lunch_end.setHours(13,29,59);
    lunch_end.setHours(lunch_end.getHours() - 5);

    
    let dinner_start = new Date();
    let dinner_end = new Date();
    dinner_start.setHours(14,00,00);
    dinner_start.setHours(dinner_start.getHours() - 5);

    dinner_end.setHours(20,29,59);
    dinner_end.setHours(dinner_end.getHours() - 5);

    
    var timezone = req.body.timezone;
    var college = req.body.college;
    var time_to_show = req.body.last_clicked_button_name;

    
    let menuJSON = {
      "Haverford":HCDiningFinal,
      "BrynMawr": {},
      "Swarthmore": {}
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
          t1.setHours(time2[0], time2[2]+time2[3], 0);
      }
  }
  // console.log("return from compareTime: ", time1 < t1);
  return time1 < t1;
  
}

function getBus(date, college, time) {
  console.log(college);
  if (college == "BrynMawr"){
    // console.log("got inside getBus for Haverford");
    // console.log("dataFinal: ", dataFinal);
      for (let index = 0; index < dataFinal[date].length; index ++){
          if (compareTime(time, dataFinal[date][index].departingBMC)){
              // console.log("got inside if in the loop");
              var bussesArray = [];
              bussesArray.push({departingBrynMawr: dataFinal[date][index].departingBMC, arrivingAtHaverford: dataFinal[date][index].arrivingHC});
              bussesArray.push({departingBrynMawr: dataFinal[date][index + 1].departingBMC, arrivingAtHaverford: dataFinal[date][index + 1].arrivingHC});
              bussesArray.push({departingBrynMawr: dataFinal[date][index + 2].departingBMC, arrivingAtHaverford: dataFinal[date][index + 2].arrivingHC});
              // console.log("return from betBus: ", bussesArray);
              return bussesArray;

              // return [dataFinal[date][index].departingBMC, dataFinal[date][index + 1].departingBMC, dataFinal[date][index + 2].departingBMC]
          }
      }
  }
  else if (college == "Haverford"){
    // console.log("got inside getBus for BrynMawr");
      for (let index = 0; index < dataFinal[date].length; index ++){
          if (compareTime(time, dataFinal[date][index].departingHC)){
              var bussesArray = [];
              bussesArray.push({departingHaverford: dataFinal[date][index].departingHC, arrivingAtBrynMawr: dataFinal[date][index].arrivingBMC});
              bussesArray.push({departingHaverford: dataFinal[date][index + 1].departingHC, arrivingAtBrynMawr: dataFinal[date][index + 1].arrivingBMC});
              bussesArray.push({departingHaverford: dataFinal[date][index + 2].departingHC, arrivingAtBrynMawr: dataFinal[date][index + 2].arrivingBMC});
              // console.log("return from betBus: ", bussesArray);
              return bussesArray;
              // return [dataFinal[date][index].departingHC, dataFinal[date][index + 1].departingHC, dataFinal[date][index + 2].departingHC]
          }
      }
  }
  console.log("didn't get anywhere in getBus :((");
  
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
