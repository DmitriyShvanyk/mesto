export { CardList };

import { Card } from "./card.js";

// Класс для хранения и отрисовки карточек
class CardList {
  constructor(container) {

    this.container = container;
    this.cards = [];
    this.renderNoCards();
  }

  // метод добавления одной карточки
  addCard(nameCard, urlCard, idCard, likeCard, idLike, authorCard) {
    const { cardElement } = new Card(nameCard, urlCard, idCard, likeCard, idLike, authorCard);
    this.cards.push(cardElement);
    this.container.appendChild(cardElement);
    this.renderNoCards();
  }

  // метод, если нет карточек
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