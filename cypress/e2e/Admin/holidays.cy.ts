describe("Check Holiday Functionalities",()=>{
    it("Add holiday(Success Flow)",()=>{
        cy.visit("/login")
        .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
        .get("input[placeholder='Password']").type("Admin@123")
        .get("button").contains("Sign in").click().wait(1500)
        .get("a").contains("Holidays").click()
        .get("button").contains("Add Holiday").click()
        .get("body > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > form:nth-child(2) > div:nth-child(1) > div:nth-child(1)")
        .contains("Name").type("HolidayName").wait(1500)
        .get("body > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > form:nth-child(2) > div:nth-child(1) > div:nth-child(2)")
        .click().type("2024").wait(1500)
        .get("body > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > form:nth-child(2) > div:nth-child(1) > div:nth-child(3)")
        .click().type("07072024").wait(1500)
        .get("body > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > form:nth-child(2) > div:nth-child(1) > div:nth-child(4)")
        .click().type("08072024").wait(1500)
        .get("input[name='1']").check().wait(1500)
        .get("button[type='submit']").contains("Add Holiday").click()
    })
})