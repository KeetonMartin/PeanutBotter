
let full_date = new Date();
console.log(full_date);

full_date.setHours(full_date.getHours() - 5);
console.log(full_date);
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
      "breakfast" : `Pancakes, Scrambled Eggs, Tofu Scrambled, Vegan Sausage, Turkey Sausage Links, Diced Potatoes, Bagels, Muffins`,
      "lunch" : `Grilled Turkey & Swiss Sundried Tomato Melt, Singapore Street Noodles, Roasted Red Potatoes, Roasted Vegetables, Pizza`,
      "dinner" : `Grilled Flank Steak Chimichurri, Cauliflower Rice Burrito Skillet, Mexican Corn, Chipotle Roasted Potatoes, Grilled Chicken Breast, Pasta & Sauce, Pizza`,
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
var college = "BrynMawr";
if(time_to_show=="Full  today"){ // Show full day menu
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