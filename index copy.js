const puppeteer = require('puppeteer');

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

    dataFinal = {
        Monday:[],
        Tuesday:[],
        Wednesday:[],
        Thursday:[],
        Friday:[]
    }

    for (let index = 0; index <= 1152; index += 4) {
        if (index <= 232){
            dataFinal["Monday"].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
        }
        else if (index > 232 && index <= 468){
            dataFinal["Tuesday"].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
        }
        else if (index > 468 && index <= 704){
            dataFinal["Wednesday"].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
        }
        else if (index > 704 && index <= 940){
            dataFinal["Thursday"].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
        }
        else {
            dataFinal["Friday"].push({departingBMC:data[index], arrivingHC: data[index + 1], departingHC: data[index + 2], arrivingBMC: data[index + 3]});
        }
    }

    // console.log(dataFinal);

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
        if (destination == 'HC'){
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
        else{
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

    let a = new Date();
    
    console.log(getBus('Monday', 'HC', new Date()));



    await browser.close();
}

scrapeProduct('https://www.brynmawr.edu/transportation/blue-bus-bi-co');