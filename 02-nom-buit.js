// carreguem les llibreries
const { BaseTest } = require("./BaseTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

// heredem una classe amb un sol mètode test()
// emprem this.driver per utilitzar Selenium

class MyTest extends BaseTest
{
	async test() {
        // testejem login
        //////////////////////////////////////////////////////
        await this.driver.get("http://localhost:8000/register.php");
        //await this.driver.findElement(By.name("nom")).getText();

        // el INPUT name="nom" està buit

        await this.driver.findElement(By.xpath("//button[text()='Seguent']")).click();

        // comprovem que l'alert message és ERRONI
        await this.driver.wait(until.alertIsPresent(),2000,"ERROR TEST: després del SEGUENT ha d'aparèixer un alert amb el resultat de la validació del NOM.");
        let alert = await this.driver.switchTo().alert();
        let alertText = await alert.getText();
        let assertMessage = "El NOM no pot estar buit.";
        assert(alertText==assertMessage,"ERROR TEST: si el nom està buit, l'alert ha de dir: '"+assertMessage+"'.");
        await alert.accept();

        console.log("TEST OK");
	}
}

// executem el test

(async function test_example() {
	const test = new MyTest();
	await test.run();
	console.log("END")
})();