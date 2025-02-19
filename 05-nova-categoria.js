const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require('assert');
const { Select } = require('selenium-webdriver');
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

        await usernameInput.sendKeys(process.env.username);
        await passwordInput.sendKeys(process.env.password);

        // 3 Hacer clic en el botón de login
        let sendButton = await driver.wait(until.elementLocated(By.css('input[value="Iniciar sessió"]')), 10000);
        await sendButton.click();

        // 5 Hacer clic en "Afegir" dentro de la sección "Categoria"
        let addBookLink = await driver.wait(until.elementLocated(By.css('tr.model-categoria .addlink')), 10000);
        await addBookLink.click();

        // 6 Esperar a que cargue la página de creación de categorias
        let nameInput = await driver.wait(until.elementLocated(By.id('id_nom')), 10000);

        // 7 Introducir los datos de la categoria padre
        await nameInput.sendKeys("Color");

        // 8 Hacer clic en el botón de guardar
        let saveButton = await driver.wait(until.elementLocated(By.css("input[value='Desar']")), 10000);
        await saveButton.click();

        // 9 Crear las categorías secundarias "Rojo", "Azul" y "Verde" con "Color" como padre
        let colors = ["Rojo", "Azul", "Verde"];

        for (let color of colors) {
            // 9.1 Acceder a la página de creación de categorías
            await driver.get(site + "/admin/biblio/categoria/add/");

            // 9.2 Introducir el nombre de la categoría
            nameInput = await driver.wait(until.elementLocated(By.id('id_nom')), 10000);
            await nameInput.sendKeys(color);

            // 9.3 Seleccionar la categoría padre "Color"
            let parentSelect = await driver.wait(until.elementLocated(By.id("id_parent")), 10000);
            let select = new Select(parentSelect);
            await select.selectByVisibleText("Color");

            // 9.4 Guardar la nueva categoría
            saveButton = await driver.wait(until.elementLocated(By.css("input[value='Desar']")), 10000);
            await saveButton.click();

            console.log(`Categoría '${color}' creada.`);
        }

        console.log("CATEGORIAS CREADAS OK");
        console.log("TEST OK");
    }
}

// Ejecutar el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();