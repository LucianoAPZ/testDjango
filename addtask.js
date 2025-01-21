// carreguem les llibreries
const { BaseTest } = require("./BaseTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

// heredem una classe amb un sol mètode test()
// emprem this.driver per utilitzar Selenium

class AddTaskTest extends BaseTest
{
	async test() {
        // testejem afegir tasca en tasklist de Cordova
        //////////////////////////////////////////////////////
        await this.driver.get("http://localhost:8000/browser/www/");

        // cliquem botó "+"
        await this.driver.findElement(By.xpath("//button[text()='+']")).click();

        // el prompt pel text de la tasca es tracta igual que un alert en Selenium
        await this.driver.wait(until.alertIsPresent(),2000,"ERROR TEST: el botó '+' d'afegir tasca ha d'obrir un prompt.");
        let prompt = await this.driver.switchTo().alert();
        // afegim el text de la tasca i acceptem
        var taskText = "lalala";
        prompt.sendKeys(taskText);
        await this.driver.sleep(1000);
        await prompt.accept();
        await this.driver.sleep(1000);

        // checkejem tasca
        await this.driver.findElement(By.xpath("//li[text()='"+taskText+"']")).click();

        console.log("TEST OK");
	}
}

// executem el test

(async function test_example() {
	const test = new AddTaskTest();
	await test.run();
	console.log("END")
})();