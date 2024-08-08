describe("Navigation Bar Test",()=>{
    it("navigate and popup check",()=>{
        cy.visit("/login")
        .get("input[placeholder='Email']").type("dharshanramk@gmail.com")
        .get("input[placeholder='Password']").type("Admin@12")
        .get("button").contains("Sign in").click()
        .get(".MuiBox-root.css-1hg4z9e").click()
    })
})