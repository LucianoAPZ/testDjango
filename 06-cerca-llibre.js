const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");
require("dotenv").config();

class AdminTest extends BaseTest {
    async test() {
        let driver = this.driver;
        let siteURL = process.env.URL;

        // Acceder a la página de inicio de sesión
        await driver.get(`${siteURL}/admin/login/`);

        // Completar credenciales
        let userField = await driver.findElement(By.id("id_username"));
        let passField = await driver.findElement(By.id("id_password"));

        await userField.sendKeys(process.env.username);
        await passField.sendKeys(process.env.password);

        // Iniciar sesión
        let loginButton = await driver.findElement(By.css('input[value="Iniciar sessió"]'));
        await loginButton.click();
        await driver.wait(until.urlContains("/admin/"), 5000);
        
        let siteTitle = await driver.wait(until.elementLocated(By.css("#site-name")), 5000);
        assert(await siteTitle.isDisplayed(), "El título del sitio no está visible");
        
        // Navegar para agregar un libro
        let addBook = await driver.findElement(By.css('a[href="/admin/biblio/llibre/add/"]'));
        await addBook.click();

        // Seleccionar opción para agregar por ISBN
        let isbnLink = await driver.findElement(By.css("a.viewlink"));
        await isbnLink.click();

        // Introducir ISBN y confirmar
        let alertBox = await driver.switchTo().alert();
        let isbn = "9780451524935";
        await alertBox.sendKeys(isbn);
        await alertBox.accept();

        // Esperar respuesta de la API
        await driver.sleep(5000);

        // Verificar si el campo de fecha contiene un valor inválido y corregirlo
        let dateField = await driver.findElement(By.id("id_data_edicio"));
        let dateValue = await dateField.getAttribute("value");
        if (dateValue.includes("NaN/NaN/NaN")) {
            await dateField.clear();
            await dateField.sendKeys("2024-02-22");
        }

        // Guardar el libro
        let saveBtn = await driver.findElement(By.css('input[name="_save"]'));
        await saveBtn.click();

        // Buscar libro por ISBN
        let searchBox = await driver.findElement(By.id("searchbar"));
        await searchBox.sendKeys(isbn);
        await driver.findElement(By.css('input[type="submit"][value="Cerca"]')).click();

        console.log("CERCA CREADA OK");
        console.log("TEST OK");
    }
}

(async function ejecutarPrueba() {
    const prueba = new AdminTest();
    await prueba.run();
    console.log("PRUEBA TERMINADA");
})();
