package ru.yandex.praktikum;


import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class RestAssuredGetAllureTest {

    String bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDIxOGRkMjI0OGQ0NTAwMzYyN2Y4ZjMiLCJpYXQiOjE2ODc5NjE0MTcsImV4cCI6MTY4ODU2NjIxN30.W1qgUljymd7yeDT135cH0w-77AfnTafQYBNzr_gIO4c";

    @Before
    public void setUp() {
        RestAssured.baseURI = "https://qa-mesto.praktikum-services.ru";
    }

    @Test
    @DisplayName("Get info code")
    public void getMyInfoStatusCode() {
        given()
                .auth().oauth2(bearerToken)
                .get("/api/users/me")
                .then().statusCode(200);
    }

    @Test
    public void checkUserName() {
        given()
                .auth().oauth2(bearerToken)
                .get("/api/users/me")
                .then().assertThat().body("data.name",equalTo("Василий Васильев"));
    }

    @Test
    public void checkUserNameAndPrintResponseBody() {

        Response response =given().auth().oauth2(bearerToken).get("/api/users/me");
        // отправили запрос и сохранили ответ в переменную response - экземпляр класса Response

        response.then().assertThat().body("data.name",equalTo("Василий Васильев"));
        // проверили, что в теле ответа ключу name соответствует нужное имя пользователя

        System.out.println(response.body().asString()); // вывели тело ответа на экран

    }

}