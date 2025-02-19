const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require('assert');
require('dotenv').config();

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

        // 5 Hacer clic en "Afegir" dentro de la sección "Llibres"
        let addBookLink = await driver.wait(until.elementLocated(By.css('tr.model-llibre .addlink')), 10000);

        await driver.sleep(2000);
        addBookLink.click();

        // 6 Esperar a que cargue la página de creación de libros
        let titleInput = await driver.wait(until.elementLocated(By.id('id_titol')), 10000);

        // 7 Introducir los datos del libro
        titleInput.sendKeys("Libro Luciano");

        // 8 Hacer clic en el botón de guardar
        let saveButton = await driver.wait(until.elementLocated(By.css('input[value="Desar"]')), 10000);

        await driver.sleep(2000);
        saveButton.click();

        // 9 Verificar que el libro se ha creado correctamente
        try {
            let successMessage = await driver.wait(
                until.elementLocated(By.xpath("//li[contains(@class, 'success')]")),
                10000
            );

            let messageText = await successMessage.getText();
            messageText = messageText.trim();

            assert(messageText.includes("fou afegit amb èxit"), "El libro no se ha añadido correctamente.");

            console.log("Libro añadido con éxito.");
        } catch (error) {
            console.error("Error: No se encontró el mensaje de éxito.");
            throw error;
        }


        console.log("LIBRO CREADO OK");
        console.log("TEST OK");
    }
}

// Ejecutar el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
