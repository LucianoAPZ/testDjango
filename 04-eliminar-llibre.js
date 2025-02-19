const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");
require("dotenv").config();

class MyTest extends BaseTest {
    async test() {
        var site = process.env.URL;
        var driver = this.driver;

        // 1 Acceder a la página de login
        await driver.get(site + "/admin/login/");

        // 2 Esperar y rellenar el formulario de login
        let usernameInput = await driver.wait(until.elementLocated(By.id('id_username')), 10000);
        let passwordInput = await driver.wait(until.elementLocated(By.id('id_password')), 10000);

        usernameInput.sendKeys(process.env.username);
        passwordInput.sendKeys(process.env.password);

        // 3 Hacer clic en el botón de login
        let sendButton = await driver.wait(until.elementLocated(By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        // 4 Buscar el libro "Libro Luciano"
        let bookLink = await driver.wait(until.elementLocated(By.xpath("//a[text()='Libro Luciano']")), 10000);

        await driver.sleep(2000);
        bookLink.click();

        // 5 Hacer clic en el botón de eliminar
        let deleteButton = await driver.wait(until.elementLocated(By.css("a.deletelink")), 10000);

        await driver.sleep(2000);
        deleteButton.click();

        // 6 Confirmar eliminación
        let confirmButton = await driver.wait(until.elementLocated(By.xpath("//input[@value=\"Sí, n'estic segur\"]")), 10000);

        await driver.sleep(2000);
        confirmButton.click();

        // 7 Verificar que el libro se ha eliminado correctamente
        try {
            let successMessage = await driver.wait(
                until.elementLocated(By.xpath("//li[contains(@class, 'success')]")),
                10000
            );

            let messageText = await successMessage.getText();
            messageText = messageText.trim();

            assert(messageText.includes("s'ha eliminat amb èxit"), "El libro no se ha eliminado correctamente.");

            console.log("Libro eliminado con éxito.");
        } catch (error) {
            console.error("Error: No se encontró el mensaje de éxito.");
            throw error;
        }

        console.log("LIBRO ELIMINADO OK");
        console.log("TEST OK");
    }
}

// Ejecutar el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
