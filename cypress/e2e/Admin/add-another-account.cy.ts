describe("Add another account", () => {
    it("Unsuccessful flow", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click().wait(100)
            .get("img[alt='User']").click()
            .get("body > div:nth-child(2) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(3)").click()
            .get("button").contains("Register").click()
            .get(".register-module__errorMessage___2R1GM").contains("First name is required").wait(1500)
            .get('#firstName').type("FirstName")
            .get("button").contains("Register").click()
            .get(".register-module__errorMessage___2R1GM").contains("Last name is required").wait(1500)
            .get("#lastName").type("Lastname")
            .get("button").contains("Register").click()
            .get(".register-module__errorMessage___2R1GM").contains("Email is required").wait(1500)
            .get("#email").type("email")
            .get("button").contains("Register").click().wait(1500)
            .get("#email").clear()
            .get("#email").type("email@email.com")
            .get("button").contains("Register").click()
            .get(".register-module__errorMessage___2R1GM").contains("Address Line 1 is required").wait(1500)
            .get("#addressLine1").type("Address")
            .get("button").contains("Register").click()
            .get(".register-module__errorMessage___2R1GM").contains("Phone number is required").wait(1500)
            .get("#phoneNumber").type("9876543211")
            .get("button").contains("Register").click()
            .get(".register-module__errorMessage___2R1GM").contains("Role is required").wait(1500)
            .get("#roleId").select("Admin").wait(1000)
            .get("button").contains("Register").click()
            .get("#roleId").select("Owner").wait(1000)
            .get("button").contains("Register").click()
            .get(".register-module__errorMessage___2R1GM").contains("Property ID is required").wait(1500)
            .get("#propertyID").select("Paradise Shores (eighths)").wait(1000)
            .get("#propertyID").select("Paradise Shores (tenths)").wait(1000)
            .get("#propertyID").select("Crown Jewel").wait(1000)
            .get("#propertyID").select("Modern Lagoon").wait(1000)
            .get("#propertyID").select("Blue Bear Lake").wait(1000)
            .get("#propertyID").select("Bear Lake Bluffs").wait(1000)
            .get("#propertyID").select("Swan Creek").wait(1000)
            .get("#propertyID").select("Huckleberry House").wait(1000)
            .get("#propertyID").select("Lake Escape").wait(1000)
    })
    it("Email already exist", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click().wait(100)
            .get("img[alt='User']").click()
            .get("body > div:nth-child(2) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(3)").click()
            .get('#firstName').type("FirstName").wait(1000)
            .get("#lastName").type("Lastname").wait(1000)
            .get("#email").type("fraxionedownersportal@gmail.com").wait(1000)
            .get("#addressLine1").type("Address").wait(1000)
            .get("#phoneNumber").type("9876543211").wait(1000)
            .get("#roleId").select("Admin").wait(1000)
            .get("#propertyID").select("Paradise Shores (eighths)").wait(1000)
            .get("button").contains("Register").click()
            .get("div[role='alert']").contains("Email already exists").wait(1500)
    })
    it("Successful flow for owner invitation", () => {
        const email = `user${Math.floor(Math.random() * 10000)}@email.com`;
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click().wait(100)
            .get("img[alt='User']").click()
            .get("body > div:nth-child(2) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(3)").click()
            .get('#firstName').type("FirstName").wait(1000)
            .get("#lastName").type("Lastname").wait(1000)
            .get("#email").type(email).wait(1000)
            .get("#addressLine1").type("Address").wait(1000)
            .get("#phoneNumber").type("9876543211").wait(1000)
            .get("#roleId").select("Owner").wait(1000).wait(1000)
            .get("#propertyID").select("Paradise Shores (eighths)").wait(1000).wait(1000)
            .get("button").contains("Register").click().wait(2000)
            .get("div[role='alert']").contains("Invite sent successfully").wait(2000)
    })
    it("Successful flow for admin invitation", () => {
        const email = `user${Math.floor(Math.random() * 10000)}@email.com`;
        cy.visit("/login")
            .get("input[placeholder='Email']").type("fraxionedownersportal@gmail.com")
            .get("input[placeholder='Password']").type("Admin@123")
            .get("button").contains("Sign in").click().wait(100)
            .get("img[alt='User']").click()
            .get("body > div:nth-child(2) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(3)").click()
            .get('#firstName').type("FirstName").wait(1000)
            .get("#lastName").type("Lastname").wait(1000)
            .get("#email").type(email).wait(1000)
            .get("#addressLine1").type("Address").wait(1000)
            .get("#phoneNumber").type("9876543211").wait(1000)
            .get("#roleId").select("Admin").wait(1000).wait(1000)
            .get("#propertyID").select("Paradise Shores (eighths)").wait(1000).wait(1000)
            .get("button").contains("Register").click().wait(2000)
            .get("div[role='alert']").contains("Invite sent successfully").wait(2000)
    })
})