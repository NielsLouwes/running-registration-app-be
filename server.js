const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3001;

async function scrapeRaceData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the elements to be visible
    await page.waitForSelector('.world-series-race-list_wscc_racename__NCgPH', { visible: true });
    await page.waitForSelector('.races-list_date_open___WNfC', { visible: true });
    await page.waitForSelector('.font-14.font-d-16.font-oxanium-bold', { visible: true });

    const raceData = await page.evaluate(() => {
        const nameElements = Array.from(document.querySelectorAll('.world-series-race-list_wscc_racename__NCgPH'));
        const dateElements = Array.from(document.querySelectorAll('.races-list_date_open___WNfC'));
        const statusElements = Array.from(document.querySelectorAll('.font-14.font-d-16.font-oxanium-bold'));

        return nameElements.map((element, index) => {
            const name = element.innerText;
            const date = dateElements[index] ? dateElements[index].innerText : 'Date unknown';
            const status = statusElements[index] ? statusElements[index].innerText : 'Status unknown';
            return { name, date, status };
        });
    });

    await browser.close();
    return raceData;
}





app.get('/scrape', async (req, res) => {
    const data = await scrapeRaceData("https://utmb.world/utmb-world-series-events");
    res.json({ data });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
