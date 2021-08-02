/// <reference types="cypress" />

import  {format, prepareLocalStorage} from '../support/utils'

beforeEach(() => {  // isto é um hook
    cy.visit('https://devfinance-agilizei.netlify.app/', {
        onBeforeLoad: (win) => {
            prepareLocalStorage(win)
        }
    });
});

context('Dev Finances Agilizei', () => {
    it('Cadastrar entradas', () => {
        //entender o fluxo manual
        //mapear os elementos que vamos interagir
        //descrever as interações com o cypress
        //adicionar as asserções necessárias        

        cy.get('#transaction .button').click(); //exemplo mapeando por id # e classe .
        cy.get('#description').type('Mesada'); //exemplo mapeando por id # 
        cy.get('[name=amount]').type(20);    //exemplo mapeando por atributo
        cy.get('[type=date]').type('2021-07-29');      //exemplo mapeando por atributo
        cy.get('button').contains('Salvar').click(); //exemplo mapeando pelo tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3);
    });

    it('Cadastrar saídas', () => {
        //entender o fluxo manual
        //mapear os elementos que vamos interagir
        //descrever as interações com o cypress
        //adicionar as asserções necessárias        

        cy.get('#transaction .button').click(); //exemplo mapeando por id # e classe .
        cy.get('#description').type('Sapato'); //exemplo mapeando por id # 
        cy.get('[name=amount]').type(-10);    //exemplo mapeando por atributo
        cy.get('[type=date]').type('2021-07-29');      //exemplo mapeando por atributo
        cy.get('button').contains('Salvar').click(); //exemplo mapeando pelo tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3);
    });

    it('Remover entradas e saídas', () => {
        const entrada = 'Mesada'
        const saida = 'sapato'

        cy.get('#transaction .button').click(); //exemplo mapeando por id # e classe .
        cy.get('#description').type(entrada); //exemplo mapeando por id # 
        cy.get('[name=amount]').type(20);    //exemplo mapeando por atributo
        cy.get('[type=date]').type('2021-07-29');      //exemplo mapeando por atributo
        cy.get('button').contains('Salvar').click(); //exemplo mapeando pelo tipo e valor

        cy.get('#transaction .button').click(); //exemplo mapeando por id # e classe .
        cy.get('#description').type(saida); //exemplo mapeando por id # 
        cy.get('[name=amount]').type(-10);    //exemplo mapeando por atributo
        cy.get('[type=date]').type('2021-07-29');      //exemplo mapeando por atributo
        cy.get('button').contains('Salvar').click(); //exemplo mapeando pelo tipo e valor

        //estratégia 1: voltar ao elemento pai e avançar para um td img e atributo
        cy.get('td.description')
            cy.contains(entrada)    //encontra o elemento âncora - texto da constante entrada
            .parent()
            .find('img[onclick*=remove]')
            .click()
        
        cy.get('td.description')
            cy.contains(entrada)    //encontra o elemento âncora - texto da constante entrada
            .parent()
            .find('img[onclick*=remove]')
            .click()

        //estratégia 2: buscar todos os irmãos; e buscar o que tem img + atributo
        cy.get('td.description')
            .contains(saida)
            .siblings()
            .children('img[onclick*=remove]')
            .click()

        cy.get('td.description')
            .contains(saida)
            .siblings()
            .children('img[onclick*=remove]')
            .click()    

        cy.get('#data-table tbody tr').should('have.length', 0);
    });

    it('Validar saldo com diversas transações', () => {
        //capturar as linhas com as transações
        //capturar o texto dessas colunas
        //formatar esses valores das linhas

        //capturar o texto do total
        //comparar o somatório de entradas e despesas com o total

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
            .each(($elemento, index, $list) => {    //index inicia com zero

                cy.get($elemento).find('td.income, td.expense').invoke('text').then(varText => {   //invoca, neste caso, a função text() do javascript
                    if(varText.includes('-')){
                        expenses = expenses + format(varText)
                    }else{
                        incomes = incomes + format(varText)
                    }
                })     
            })    

        cy.get('#totalDisplay').invoke('text').then(varText => {
            let totalFormatadoDisplay = format(varText)
            let totalEsperado = incomes + expenses

            expect(totalFormatadoDisplay).to.eq(totalEsperado)
        })
    });
});

