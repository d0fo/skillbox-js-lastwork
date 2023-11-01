/* eslint-disable no-undef */
describe('template spec', () => {
  it('загружает, авторизуется, отображает аккаунты, создает аккаунт, переводит со счета на счет и с нового счета на другой счет', () => {
    cy.viewport(1500, 1100);
    cy.visit('http://localhost:8080'); // change URL to match your dev URL
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'developer',
      password: 'skillbox',
    }).then((data) => {
      const token = data.body.payload.token;
      expect(data.body.payload).not.to.be.null;
      cy.get('#input-login').type('developer');
      cy.get('#input-password').type('skillbox');
      cy.get('form').contains('Войти').click().click();
      cy.request({
        method: 'GET',
        url: 'http://localhost:3000/accounts', // baseUrl is prepend to URL
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
      }).then((responseAccaunts) => {
        let accountsResp = JSON.parse(responseAccaunts.body);
        // проверка открытия списка счетов
        cy.get('.account-number').should(
          'contain.text',
          `${accountsResp.payload[0].account}`
        );
        cy.get('.new-account-btn').click(); //создаем новый аккаунт
        cy.wait(500);
        const accountsList = [];
        cy.get('.account-number')
          .each((el) => {
            accountsList.push(el.text());
          })
          .then(() => {
            console.log(accountsList);
            expect(accountsList.length > 1);
            cy.wrap(accountsList.length).should('be.gt', 1); //проверяем, что аккаунт создан
          });
        cy.get('.account-number')
          .eq(1)
          .then((accountNumber) => {
            console.log(accountNumber.text());
            cy.get('.account-detail-btn').first().click();
            cy.wait(2000);
            cy.get('.recipient-input').type(`${accountNumber.text()}`);
            cy.get('.account-details-number').click();
            cy.get('.transaction-count-input').type('1');
            cy.get('.push-transaction-btn').click();
            cy.wait(2000);
            //проверяем что перевод прошел
            cy.get('.transaction-amount')
              .first()
              .should('contain.text', `- 1 \u20bd`);
            cy.get('.transaction-recipient')
              .first()
              .should('contain.text', `${accountNumber.text()}`);
            //возвращаемся к списку счетов
            cy.get('.back-btn').click();
            //заходим во второй счет
            cy.get('.account-detail-btn').eq(1).click();
            // заполняем форму перевода и отправляем
            cy.get('.recipient-input').type(
              `${accountsResp.payload[0].account}`
            );
            cy.get('.account-details-number').click();
            cy.get('.transaction-count-input').type('1');
            cy.get('.push-transaction-btn').click();
            cy.wait(2000);
            //проверяем что перевод прошел
            cy.get('.transaction-amount')
              .first()
              .should('contain.text', `- 1 \u20bd`);
            cy.get('.transaction-recipient')
              .first()
              .should('contain.text', `${accountsResp.payload[0].account}`);
          });
      });
    });
  });
});
