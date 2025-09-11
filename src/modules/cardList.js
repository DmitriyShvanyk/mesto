export { CardList };

import { Card } from "./card.js";

// Class Card List
class CardList {
  constructor(container) {
    this.container = container;
    this.cards = [];
    this.renderNoCards();
  }

  //  Add Card
  addCard(nameCard, urlCard, idCard, likeCard, idLike, authorCard) {
    const { cardElement } = new Card(nameCard, urlCard, idCard, likeCard, idLike, authorCard);
    this.cards.push(cardElement);
    this.container.appendChild(cardElement);
    this.renderNoCards();
  }

  // No Cards
  renderNoCards() {
    const noCards = document.querySelector('.no-cards');
    if (this.cards.length === 0) {
      noCards.classList.remove('no-cards_hidden');
    }
    else {
      noCards.classList.add('no-cards_hidden');
    }

  }

}