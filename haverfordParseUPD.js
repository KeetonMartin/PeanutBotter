const puppeteer = require('puppeteer');

async function scrapeProduct(url){
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url);

    const data = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('div.meal-container p'))
            return tds.map(td => td.innerText.split('\n'))
    });



    dataFinal = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        FullDay:[]
    };

    let currentDate = new Date();

    if (currentDate.getDay() == 0 || currentDate.getDay() == 6){
        data[0].splice(0, 3)
        data[1].splice(0, 1)
        dataFinal.Lunch = data[0].toString();
        dataFinal.Dinner = data[1].toString();
        dataFinal.FullDay = "Lunch: \n" + dataFinal.Lunch + "; \n" + "Dinner: \n" + dataFinal.Dinner 
    }
    else{
        data[0].splice(0, 3)
        data[1].splice(0, 1)
        data[2].splice(0, 1)
        dataFinal.Breakfast = data[0].toString();
        dataFinal.Lunch = data[1].toString();
        dataFinal.Dinner = data[2].toString();
        dataFinal.FullDay = "Breakfast: \n" + dataFinal.Breakfast + "; \n" + "Lunch: \n" + dataFinal.Lunch + "; \n" + "Dinner: \n" + dataFinal.Dinner 
    }

    console.log(dataFinal);
    console.log(data[0].toString())
    await browser.close();
}

scrapeProduct('https://www.haverford.edu/dining-services/dining-center');