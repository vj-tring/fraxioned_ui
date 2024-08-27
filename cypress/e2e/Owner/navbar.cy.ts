describe("Navigation Bar and Side Bar Test", () => {
    it("popup and sidebar check", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("owner@fraxioned.com")
            .get("input[placeholder='Password']").type("Owner@123")
            .get("button").contains("Sign in").click()
            .get(".MuiTypography-root.MuiTypography-body2.monsterrat.p-2.css-1mh082i").click()
            .get("div[id='account-menu'] li:nth-child(1)").contains("Reset").wait(1500)
            .get("div").contains("Logout").click().wait(1500)
            .get(".btn-confirm").contains("Logout").click().wait(1500)
    })
})