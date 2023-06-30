package ru.yandex.praktikum;// импортируем RestAssured
import io.restassured.RestAssured;
// импортируем Before
import io.restassured.response.Response;
import org.junit.Before;
// импортируем Test
import org.junit.Test;
// дополнительный статический импорт нужен, чтобы использовать given(), get() и then()
import java.io.File;
import java.net.ResponseCache;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;

public class PraktikTest {

    // аннотация Before показывает, что метод будет выполняться перед каждым тестовым методом
    @Before
    public void setUp() {
        // повторяющуюся для разных ручек часть URL лучше записать в переменную в методе Before
        // если в классе будет несколько тестов, указывать её придётся только один раз
        RestAssured.baseURI = "https://qa-mesto.praktikum-services.ru";
    }

    // создаём метод автотеста
    @Test
    public void getMyInfoStatusCode() {
        // метод given() помогает сформировать запрос
        given()
                // указываем протокол и данные авторизации
                .auth().oauth2("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDIxOGRkMjI0OGQ0NTAwMzYyN2Y4ZjMiLCJpYXQiOjE2ODc5NjE0MTcsImV4cCI6MTY4ODU2NjIxN30.W1qgUljymd7yeDT135cH0w-77AfnTafQYBNzr_gIO4c")
                // отправляем GET-запрос с помощью метода get, недостающую часть URL (ручку) передаём в него в качестве параметра
                .get("/api/users/me")
                // проверяем, что статус-код ответа равен 200
                .then().assertThat().body("data.email", equalTo("test95@example.com"));
    }

    @Test
    public void getMyPost() {
        File json = new File("src/main/resources/newCard.json");
        Response response =
        given()
                .header("Content-Type", "application/json")
                .auth().oauth2("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDIxOGRkMjI0OGQ0NTAwMzYyN2Y4ZjMiLCJpYXQiOjE2ODc5NjE0MTcsImV4cCI6MTY4ODU2NjIxN30.W1qgUljymd7yeDT135cH0w-77AfnTafQYBNzr_gIO4c")
                .and()
                .body(json)
                .when()
                .patch("/api/users/me");
                 response.then().assertThat().body("data.name", equalTo("Василий Васильев"))
                .and()
                .statusCode(200);
        System.out.println(response.body().asString());
    }

}