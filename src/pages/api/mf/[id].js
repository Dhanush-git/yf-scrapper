const puppeteer = require('puppeteer');

export default async function handler(req, res) {
  try {
    const { query: { id } } = req;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = `https://finance.yahoo.com/quote/${id}`
    console.log("Trying to scrape "+url);
    await page.goto(url);

    let [price] = await page.$x('//*[@id="quote-header-info"]/div[3]/div[1]/div/fin-streamer[1]')
    let [title] = await page.$x('//*[@id="quote-header-info"]/div[2]/div[1]/div[1]/h1')

    price = await price.evaluate(el=> el.textContent)
    title = await title.evaluate(el=> el.textContent)

    browser.close()
    res.status(200).json({ name: price, title: title })
  } 
  catch (error) {
    res.status(404).json({ status: 404, message: "there was a error getting the data" })
  }
}
  