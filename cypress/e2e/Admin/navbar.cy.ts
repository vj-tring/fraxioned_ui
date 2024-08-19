describe("Navigation Bar Test", () => {
    it("navigate and popup check", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click()
            .get(".MuiBox-root.css-1hg4z9e").click()
            .get("div[id='account-menu'] li:nth-child(1)").contains("Reset")
            .get("div").contains("Logout").click()
            .get(".btn-confirm").contains("Logout").click()
    })
})