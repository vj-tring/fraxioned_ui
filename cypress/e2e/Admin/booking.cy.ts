describe("Booking Test", () => {
    const login = () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click()
    }
    it("Sidebar toggle check", () => {
        login();
        cy.get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click()
            .get("button[class='sidepanel-module__toggleButton___YfTUu'] svg").click()
            .get("img[alt='Fraxioned Owners' Portal']").click();
    })
})