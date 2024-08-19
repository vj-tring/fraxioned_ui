describe("Forget password", () => {
    describe("Unsuccessfull", () => {
        it("Check empty email ", () => {
            cy.visit("/login")
                .get("a").contains("Forgot password?").click()
                .get("button[type='submit']").contains("Submit").click()
                .get("div").contains("Please fill in the Email ID")
        })
        it("Invalid Email", () => {
            cy.visit("/login")
                .get("a").contains("Forgot password?").click()
                .get("input[placeholder='Email']").type("email")
                .get("button[type='submit']").contains("Submit").click()
                .get("div").contains("Please enter a valid email ID")
        })
        it("User Not Found", () => {
            cy.visit("/login")
                .get("a").contains("Forgot password?").click()
                .get("input[placeholder='Email']").type("email@email.com")
                .get("button[type='submit']").contains("Submit").click({ force: true })
                .wait(2000)
                .get("div[role='alert']").contains("The account associated with this user was not found")
        })
    })
    describe("Successfull", () => {
        it("Successfully sended reset email", () => {
            cy.visit("/login")
                .get("a").contains("Forgot password?").click()
                .get("input[placeholder='Email']").type("owner@fraxioned.com")
                .get("input[type='checkbox']").check().should('be.checked')
                .get("input[type='checkbox']").uncheck().should('not.be.checked')
                .get("input[type='checkbox']").check().should('be.checked')
                .get("button[type='submit']").contains("Submit").click()
                .wait(2000)
                .get("div[role='alert']").contains("Password reset link sent successfully!")
        })
    })
})