describe("Reset Password", () => {
    const login = () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click()
            .get(".MuiBox-root.css-1hg4z9e").click()
            .get("div[id='account-menu'] li:nth-child(1)").click();
    }
    describe("Unsuccessful Reset Password", () => {
        it("Empty Old Password", () => {
            login();
            cy.get("button[type='submit']").click()
                .get(".reset-module__errorMessage___uLwXH").contains("Please enter your old password").wait(2000);
        })
        it("Empty New Password", () => {
            login();
            cy.get("#oldPassword").type("Password")
                .get("button[type='submit']").click()
                .get(".reset-module__errorMessage___uLwXH").contains("Please enter a new password").wait(2000);
        })
        it("Empty Confirm New Password", () => {
            login();
            cy.get("#oldPassword").type("Password")
                .get("#newPassword").type("Password")
                .get("button[type='submit']").click()
                .get(".reset-module__errorMessage___uLwXH").contains("Please confirm your new password").wait(2000);
        })
        it("Old Password is incorrect", () => {
            login();
            cy.get("#oldPassword").type("Admin")
                .get("#newPassword").type("Admin@123")
                .get("#confirmPassword").type("Admin@123")
                .get("button[type='submit']").click()
                .get("div[role='alert']").contains("The provided old password is incorrect").wait(2000);
        })
        it("Password does not match", () => {
            login();
            cy.get("#oldPassword").type("Admin@123")
                .get("#newPassword").type("Admin@1")
                .get("#confirmPassword").type("Admin@12")
                .get("button[type='submit']").click()
                .get(".reset-module__errorMessage___uLwXH").contains("New passwords do not match").wait(2000);
        })
    })
    describe("Successful Reset Password", () => {
        it("Reset password with valid credentials", () => {
            login();
            cy.get("#oldPassword").type("Admin@123")
                .get("#newPassword").type("Admin@123")
                .get("#confirmPassword").type("Admin@123")
                .get("button[type='submit']").click().wait(2000);
        })
    })
})
