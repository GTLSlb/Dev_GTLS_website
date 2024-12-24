const { Builder, By, Options } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

function getSelector(element, visited = new Set()) {
    if (!element || !element.tagName || visited.has(element)) {
        return null;
    }
    visited.add(element);
    let selector = null;

    const classSelector = element.tagName + `.${Array.prototype.join.call(element.classList, ".")}`;
    const parentSelector = element.parentNode?.classList?.length > 0
        ? Array.prototype.join.call(element.parentNode.classList, ".")
        : null;

    if (
        element.classList &&
        element.classList.length > 0 &&
        (classSelector.includes("relative") || classSelector.includes("bg-dark") || classSelector.includes("text-white"))
    ) {
        return null;
    }

    if (element.id) {
        selector = `${element.tagName}#${element.id}`;
    } else if (element.classList.length > 0) {
        selector = `${element.tagName}.${Array.prototype.join.call(element.classList, ".")}`;
    }

    if (element.parentNode) {
        const parentSelector = getSelector(element.parentNode, visited);
        if (parentSelector) {
            selector = `${parentSelector} > ${selector}`;
        }
    }

    return selector;
}

async function scrapeContent(keyword) {
    const options = new chrome.Options();
    options.addArguments('--headless'); // Enable headless mode
    options.addArguments('--no-sandbox'); // Bypass OS security model
    options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems
    options.addArguments('--disable-gpu'); // Applicable to Windows OS
    options.addArguments('--window-size=1920,1080'); // Set window size

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    try {
        await driver.sleep(2000); // Wait for 2 seconds
        let contentArray = [], resultArray=[];

            const url = `http://web-test.gtls.com.lb/news`; // Construct the full URL
            await driver.get(url);

            let elements = await driver.findElements(By.css('h1, h2, p, a, div, dd, dt, dl, span, li, strong'));

            for (let element of elements) {
                try {
                    let text = await element.getText();
                    // Get the selector for the current element
                    let selector = await driver.executeScript("return arguments[0].outerHTML;", element);
                    // Get a more specific selector if needed
                    // let selector = getSelector(element); // This won't work directly with Selenium as `element` is a WebElement

                    if (text && text != "") {
                        contentArray.push({ url: url, selector: selector, label: text.trim() }); // Include the URL and selector in the result
                    }

                    // Grouping contentArray by URL
                    const groupedContent = contentArray.reduce((acc, { url, selector, label }) => {
                        // Check if the URL already exists in the accumulator
                        if (!acc[url]) {
                            // If not, create a new entry
                            acc[url] = [];
                        }

                        // Push the selector and label to the corresponding URL
                        acc[url].push({ selector, label });

                        return acc;
                    }, {});

                    // Convert the result to the desired array format
                    resultArray = Object.entries(groupedContent).map(([url, items]) => ({
                        url,
                        items,
                    }));
                } catch (err) {
                    console.error("Error processing element:", err);
                }
            }

        // Output the result as JSON
        console.log(JSON.stringify(resultArray));
    } catch (err) {
        console.error("Error scraping:", err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
}


// Get the keyword from command-line arguments
const keyword = process.argv[2];

if (!keyword) {
    console.error("Keyword is required as the first argument");
    process.exit(1);
}

scrapeContent(keyword);
