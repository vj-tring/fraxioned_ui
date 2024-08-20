describe("Login & Logout", () => {
    describe("Unsuccessful Login", () => {
        it("Empty Email", () => {
            cy.visit("/login")
                .get("button").contains("Sign in").click()
            cy.get("div").contains("Please fill in the Email ID").wait(2000);
        })
        it("Invalid Email", () => {
            cy.visit("/login")
            cy.get("input[placeholder='Email']").type("email")
            cy.get("button").contains("Sign in").click()
            cy.get("div").contains("Please enter a valid email ID").wait(2000);
        })
        it("Empty Password", () => {
            cy.visit("/login")
            cy.get("input[placeholder='Email']").type("email@email.com")
            cy.get("button").contains("Sign in").click()
                .wait(2000)
            cy.get("div").contains("Please fill in the Password").wait(2000);
        })
        it("User Not Found", () => {
            cy.visit("/login")
            cy.get("input[placeholder='Email']").type("example@example.com")
            cy.get("input[placeholder='Password']").type("Password")
            cy.get("button").contains("Sign in").click()
                .wait(2000)
                .get("div").contains("User not found").wait(2000);
        })
        it("Invalid Credentials", () => {
            cy.visit("/login")
            cy.get("input[placeholder='Email']").type("owner@fraxioned.com")
            cy.get("input[placeholder='Password']").type("Password")
            cy.get("button").contains("Sign in").click()
                .wait(2000)
                .get("div").contains("Invalid credentials").wait(2000);
        })
    })
    describe("Successful Login", () => {
        it("Login With Valid Credentials and logout", () => {
            cy.visit("/login")
            cy.get("input[placeholder='Email']").type("owner@fraxioned.com")
            cy.get("input[placeholder='Password']").type("Owner@123")
            cy.get("input[type='checkbox']").check().should('be.checked')
            cy.get("input[type='checkbox']").uncheck().should('not.be.checked')
            cy.get("input[type='checkbox']").check().should('be.checked')
            cy.get("button").contains("Sign in").click()
                .wait(2000)
            cy.get("nav")
                .get("img[alt='User']").click()
                .get('li').contains("Logout").click().wait(2000)
                .get(".btn-confirm").contains("Logout").click()
        })

    })
})