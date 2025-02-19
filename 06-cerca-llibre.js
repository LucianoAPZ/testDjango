// carreguem les llibreries
const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");

// .env
require("dotenv").config();
console.log("dot.env: ", process.env.DB_HOST);

class MyTest extends BaseTest {
    async test() {
        const site = process.env.URL;
        await this.driver.get(site + "/admin/login/");

        // Login correcto
        await this.driver
            .findElement(By.id("id_username"))
            .sendKeys(process.env.username);
        await this.driver
            .findElement(By.id("id_password"))
            .sendKeys(process.env.password);

        await this.driver
            .findElement(By.css('input[value="Iniciar sessió"]'))
            .click();

        await this.driver.wait(until.urlContains("/admin/"), 5000);
        const siteNameElement = await this.driver.wait(
            until.elementLocated(By.css("#site-name")),
            5000
        );
        assert(
            await siteNameElement.isDisplayed(),
            "El elemento site-name no está visible"
        );
        console.log("[TEST] Login correcto");

        // Pulsar en crear libro
        const addButton = await this.driver.wait(
            until.elementIsVisible(
                this.driver.findElement(
                    By.css('a[href="/admin/biblio/llibre/add/"]')
                )
            ),
            5000
        );
        await addButton.click();

        // Pulsar en crear por ISBN
        const manualISBNLink = await this.driver.wait(
            until.elementLocated(By.css("a.viewlink")),
            5000
        );
        await manualISBNLink.click();

        // Escribir ISBN
        const alert = await this.driver.switchTo().alert();
        await alert.sendKeys("0764526413");
        await alert.accept();

        // Esperar API
        await this.driver.sleep(5000);

        // Guardar libro
        const saveButton = await this.driver.wait(
            until.elementIsVisible(
                this.driver.findElement(By.css('input[name="_save"]'))
            ),
            5000
        );
        await saveButton.click();

        console.log("[TEST] Libro con ISBN creado");

        // Buscar por ISBN
        const searchBar = await this.driver.findElement(By.id("searchbar"));
        await searchBar.sendKeys("0764526413");
        await this.driver
            .findElement(By.css('input[type="submit"][value="Cerca"]'))
            .click();
        
        console.log("[TEST] Libro con ISBN encontrado");

        console.log("TEST OK");
    }
}

// executem el test

(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();