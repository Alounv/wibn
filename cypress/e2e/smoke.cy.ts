import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /login with email/i }).click();
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /groups/i }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /login with email/i });
  });

  it("should allow you to make a group", () => {
    const testGroup = {
      name: faker.lorem.words(1),
      description: faker.lorem.sentences(1),
    };
    cy.login();

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /groups/i }).click({ force: true });
    cy.findByText("No group yet");

    cy.findByRole("link", { name: /create a new group/i }).click();

    cy.findByRole("textbox", { name: /name/i }).type(testGroup.name, {
      force: true,
    });
    cy.findByRole("textbox", { name: /description/i }).type(
      testGroup.description,
      { force: true }
    );
    cy.findByRole("button", { name: /save/i }).click({ force: true });

    cy.findByRole("link", { name: /delete/i }).click({ force: true });
    cy.findByRole("button", { name: /delete/i }).click({ force: true });

    cy.findByText("No group yet");
  });
});
