// Cargamos las librerías
const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");

// Cargar variables de entorno
require("dotenv").config();

class MyTest extends BaseTest {
    async test() {
        var site = process.env.URL;
        var driver = this.driver;
        await driver.get(site + "/admin/login/");

        // 1 Buscar inputs de login
        let usernameInput = await driver.wait(until.elementLocated(By.id("id_username")), 10000);
        let passwordInput = await driver.wait(until.elementLocated(By.id("id_password")), 10000);

        // 2 Introducir usuario y contraseña
        usernameInput.sendKeys(process.env.username + "pepe");
        passwordInput.sendKeys(process.env.password + "pepe");

        // 3 Clic en el botón de iniciar sesión
        let sendButton = await driver.wait(until.elementLocated(By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        try {
            // 4 Verificar si el botón "Iniciar sessió" sigue presente
            await driver.wait(until.elementLocated(By.css('input[value="Iniciar sessió"]')), 5000);
            console.log("TEST OK - Login fallido.");
        } catch (error) {
            console.error("TEST FAILED - No se pudo verificar la página de login.");
        }
    }
}

// Ejecutar el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
