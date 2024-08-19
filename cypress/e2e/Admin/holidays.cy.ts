describe("Check Holiday Functionalities",()=>{
    it("Should have holiday title and button",()=>{
        cy.visit("/login")
        .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
        .get("input[placeholder='Password']").type("Admin@123")
        .get("button").contains("Sign in").click()
        .get(".holiday-module__title___7yD1l")
    })
})