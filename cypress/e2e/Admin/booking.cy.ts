describe("Check Booking Functionalities", () => {
    it("Sidebar toggle check", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click()
            .get(".sidepanel-module__toggleButton___YfTUu").click()
            .get(".sidepanel-module__logoContainer___XyiIp").click();
    })
    it("Should have month,week and holiday buttons", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click()
            .get("button").contains("Week").click()
            .get("button").contains("Day").click()
            .get("button").contains("Month").click()
    })
    it("Should route previous month and next month", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click()
            .get("button").contains("Back").click()
            .get("button").contains("Next").click()
            .get("button").contains("Today").click()
            .get(".rbc-day-bg.rbc-today")
    })
})