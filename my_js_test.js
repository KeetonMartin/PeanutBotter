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

let time_to_show = "Full menu today";
var college = "Swarthmore";
if(time_to_show=="Full menu today"){ // Show full day menu
    console.log("Breakfast:\n" + menuJSON[college].breakfast + "\n\nLunch:\n" + menuJSON[college].lunch + "\n\nDinner:\n" + menuJSON[college].dinner);
}
else{ // Show menu at the current time

    if(current_hour>=breakfast_start && current_hour<breakfast_end) { // breakfast time
        console.log("Breakfast:\n"+menuJSON[college].breakfast);
    }else{
        if(current_hour>=lunch_start && current_hour<lunch_end) { // lunch time
        console.log("Lunch:\n"+menuJSON[college].lunch);
        }
        else{
        if(current_hour>=dinner_start && current_hour<dinner_end) { // dinner time
            console.log("Dinenr:\n"+menuJSON[college].dinner);
        }
        else{
            console.log( "Sorry! The dining center is closed right now :(");
        }
        }
    }

};