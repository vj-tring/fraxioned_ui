describe("Owner Booking Check", () => {
    it("Check all properties and available nights", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("owner@fraxioned.com")
            .get("input[placeholder='Password']").type("Owner@123")
            .get("button").contains("Sign in").click()
            .get(".d-flex.align-items-start.flex-column.card-item").contains("My Home(s)Select Property").click({ scrollBehavior: 'center' }).wait(2000)
            .get("button").contains("Paradise Shores...").click().wait(1500)
            .get(".d-flex.align-items-start.flex-column.card-item").contains("My Home(s)Paradise Shores (eighths)")
            .get(".card-name.d-flex.justify-content-between.py-2.align-items-center.gy-1").contains("Paradise Shores (eighths)5367 S. Cyan Lane").click().wait(2000)
            .get("button").contains("2024").click().wait(1500)
            .get("button").contains("2025").click().wait(1500)
            .get("button").contains("2026").click().wait(1500)
            .get("button").contains("2024").click().wait(1500)
            .get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-13dqf2c").click().wait(1500).get(".BlueHead").contains("Paradise Shores (tenths)")
            .get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-13dqf2c").click().wait(1500).get(".BlueHead").contains("Crown Jewel")
            .get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-b5mijb").click().wait(1500).click().wait(1500)
            .get("div[class='dots-container'] div:nth-child(2)").click().wait(1500).get(".BlueHead").contains("Paradise Shores (tenths)")
            .get("button").contains("2024").click().wait(1500)
            .get("button").contains("2025").click().wait(1500)
            .get("button").contains("2026").click().wait(1500)
            .get("button").contains("2024").click().wait(1500)
            .get("div[class='dots-container'] div:nth-child(3)").click().wait(1500).get(".BlueHead").contains("Crown Jewel")
            .get("button").contains("2024").click().wait(1500)
            .get("button").contains("2025").click().wait(1500)
            .get("button").contains("2026").click().wait(1500)
            .get("button").contains("2024").click().wait(1500)
    })
    it("Validate add guest for property 1", () => {
        cy.visit("/login")
            .get("input[placeholder='Email']").type("owner@fraxioned.com")
            .get("input[placeholder='Password']").type("Owner@123")
            .get("button").contains("Sign in").click()
            .get(".d-flex.align-items-start.flex-column.card-item").contains("My Home(s)Select Property").click({ scrollBehavior: 'center' }).wait(2000)
            .get("button").contains("Paradise Shores...").click().go(-1).go(+1)
            .get("div[class='d-flex align-items-start flex-column']").contains("WhoAdd guests").click({ scrollBehavior: 'center' })
            .get("body > div:nth-child(2) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(1) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)")
            .then(($button) => {
                for (let i = 0; i < 24; i++) {
                    cy.wrap($button).click({ force: true })
                }
            });
        cy.get("body > div:nth-child(2) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)")
            .click().wait(1500)
            .get("div[class='validationMsg monsterrat'] p").contains("The total number of guests cannot exceed 24.")
            .get("li:nth-child(1) div:nth-child(1) div:nth-child(3) button:nth-child(1)").click().click()
            .get("body > div:nth-child(2) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)").click()
            .get("body > div:nth-child(2) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(4) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)").click().click()
            .get("li:nth-child(1) div:nth-child(1) div:nth-child(3) button:nth-child(1)")
            .then(($button) => {
                for (let i = 0; i < 22; i++) {
                    cy.wrap($button).click({ force: true })
                }
            });
        cy.get("div[class='validationMsg monsterrat'] p").contains("At least one adult is required.").go(-1).go(+1)
            .get("nav")
            .get("img[alt='User']").click()
            .get('li').contains("Logout").click().wait(2000)
            .get(".btn-confirm").contains("Logout").click()
    })
    // it.skip("Validate add guest for property 2", () => {
    //     cy.visit("/login")
    //         .get("input[placeholder='Email']").type("owner@fraxioned.com")
    //         .get("input[placeholder='Password']").type("Owner@123")
    //         .get("button").contains("Sign in").click()
    //         .get(".d-flex.align-items-start.flex-column.card-item").contains("My Home(s)Select Property").click({ scrollBehavior: 'center' }).wait(2000)
    //         .get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-1eynsu0-MuiSvgIcon-root").click()
    //         .get("button[class='MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary additionalproperty active css-1mwcpco-MuiButtonBase-root-MuiButton-root'] h4[class='property-name']").contains("Paradise Shores...").click().go(-1).go(+1)
    //         .get("div[class='d-flex align-items-start flex-column']").contains("WhoAdd guests").click({ scrollBehavior: 'center' })
    //         .get("body > div:nth-child(3) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(1) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)")
    //         .then(($button) => {
    //             for (let i = 0; i < 24; i++) {
    //                 cy.wrap($button).click({ force: true })
    //             }
    //         });
    //     cy.get("body > div:nth-child(3) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)")
    //         .click().wait(1500)
    //         .get("div[class='validationMsg monsterrat'] p").contains("The total number of guests cannot exceed 24.")
    //         .get("li:nth-child(1) div:nth-child(1) div:nth-child(3) button:nth-child(1)").click().click()
    //         .get("body > div:nth-child(3) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)").click()
    //         .get("body > div:nth-child(3) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(4) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)").click().click()
    //         .get("li:nth-child(1) div:nth-child(1) div:nth-child(3) button:nth-child(1)")
    //         .then(($button) => {
    //             for (let i = 0; i < 22; i++) {
    //                 cy.wrap($button).click({ force: true })
    //             }
    //         });
    //     cy.get("div[class='validationMsg monsterrat'] p").contains("At least one adult is required.")
    // })
    // it.skip("Validate add guest for property 3", () => {
    //     cy.visit("/login")
    //         .get("input[placeholder='Email']").type("owner@fraxioned.com")
    //         .get("input[placeholder='Password']").type("Owner@123")
    //         .get("button").contains("Sign in").click()
    //         .get(".d-flex.align-items-start.flex-column.card-item").contains("My Home(s)Select Property").click({ scrollBehavior: 'center' }).wait(2000)
    //         .get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-1eynsu0-MuiSvgIcon-root").click().click()
    //         .get("button").contains("Crown Jewel").click().go(-1).go(+1)
    //         .get("div[class='d-flex align-items-start flex-column']").contains("WhoAdd guests").click({ scrollBehavior: 'center' })
    //         .get("body > div:nth-child(3) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(1) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)")
    //         .then(($button) => {
    //             for (let i = 0; i < 14; i++) {
    //                 cy.wrap($button).click({ force: true })
    //             }
    //         });
    //     cy.get("body > div:nth-child(3) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)  ")
    //         .click().wait(1500)
    //         .get("div[class='validationMsg monsterrat'] p").contains("The total number of guests cannot exceed 14.")
    //         .get("li:nth-child(1) div:nth-child(1) div:nth-child(3) button:nth-child(1)").click().click()
    //         .get("body > div:nth-child(3) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)").click()
    //         .get("body > div:nth-child(3) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(4) > div:nth-child(1) > div:nth-child(3) > button:nth-child(3)").click().click()
    //         .get("li:nth-child(1) div:nth-child(1) div:nth-child(3) button:nth-child(1)")
    //         .then(($button) => {
    //             for (let i = 0; i < 12; i++) {
    //                 cy.wrap($button).click({ force: true })
    //             }
    //         });
    //     cy.get(".validationMsg.monsterrat").contains("At least one adult is required.")
    // })
    // it("Check IN and Check OUT",()=>{
    //     cy.visit("/login")
    //     .get("input[placeholder='Email']").type("owner@fraxioned.com")
    //     .get("input[placeholder='Password']").type("Owner@123")
    //     .get("button").contains("Sign in").click()
    //     .get("div[class='MainCard'] div:nth-child(3) div:nth-child(1)").click({ scrollBehavior: 'center' })
    // })
})









