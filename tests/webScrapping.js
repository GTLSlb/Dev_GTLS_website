const { Builder, By } = require('selenium-webdriver');

async function scrapeContent(keyword, urlsToScrape) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        let contentArray = [];

        for (let subUrl of urlsToScrape) {
            const url = `http://web-test.gtls.com.lb${subUrl}`; // Construct the full URL
            await driver.get(url);

            let elements = await driver.findElements(By.css('h1, h2, p, a'));

            for (let element of elements) {
                try {
                    let text = await element.getText();
                    if (text && text.includes(keyword)) {
                        contentArray.push({ url: url, text: text.trim() }); // Include the URL in the result
                    }
                } catch (err) {
                    console.error("Error processing element:", err);
                }
            }
        }

        // Output the result as JSON
        console.log(JSON.stringify(contentArray));
    } catch (err) {
        console.error("Error scraping:", err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
}

// Get the keyword and URLs from command-line arguments
const keyword = process.argv[2];
const urlsToScrape = ['/', '/aboutus', '/safetycompliance', '/goinggreen', '/news', '/technologies', '/services', '/opportunities', '/contact_us'];

if (!keyword) {
    console.error("Keyword is required as the first argument");
    process.exit(1);
}

scrapeContent(keyword, urlsToScrape);
