const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const winston = require('winston');

// ログ設定
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: '/usr/src/app/logs/test_log.log' })
    ]
});

(async function example() {
    let driver = await new Builder().forBrowser('chrome')
        .usingServer('http://selenium-hub:4444/wd/hub')
        .build();
    try {
        logger.info('Opening Google homepage');
        await driver.get('http://www.google.com');

        logger.info('Finding search box');
        let searchBox = await driver.findElement(By.name('q'));

        logger.info('Entering search keyword');
        await searchBox.sendKeys('Selenium', Key.RETURN);

        logger.info('Checking search results');
        await driver.wait(until.titleContains('Selenium'), 3000);

        logger.info('Taking screenshot');
        let screenshot = await driver.takeScreenshot();
        try {
            fs.writeFileSync('/usr/src/app/logs/screenshot.png', screenshot, 'base64');
            logger.info('Screenshot saved successfully');
        } catch (e) {
            logger.error(`Failed to save screenshot: ${e}`);
        }
    } catch (e) {
        logger.error(`Test failed: ${e}`);
    } finally {
        await driver.quit();
        logger.info('Browser closed');
    }
})();

