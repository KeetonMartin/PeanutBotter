const puppeteer = require('puppeteer');

async function scrapeProduct(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const data = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('div.meal-container p'))
            return tds.map(td => td.innerHTML.split('<br>'))
    });

    dataFinal = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
    };

    let currentDate = new Date();

    if (currentDate.getDay() == 0 || currentDate.getDay() == 6 || (currentDate.getDate() < 8 && currentDate.getMonth() == 1)){
        data[0].splice(0, 2)
        data[1].splice(0, 2)
        dataFinal.Lunch = data[0]
        dataFinal.Dinner = data[1]
    }
    else{
        data[0].splice(0, 2)
        data[1].splice(0, 2)
        data[2].splice(0, 2)
        dataFinal.Breakfast = data[0]
        dataFinal.Lunch = data[1]
        dataFinal.Dinner = data[2]
    }

    console.log(dataFinal);
    await browser.close();
}

scrapeProduct('https://www.haverford.edu/dining-services/dining-center');