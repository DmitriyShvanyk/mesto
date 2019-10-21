export { Card };

import { userName, popupImage, api } from "./../index.js";


// Класс, создающий карточку
class Card {

  constructor(nameCard, urlCard, idCard, likeCard, authorCard) {
    this.link = urlCard;
    this.cardElement = this.createCard(nameCard, urlCard, idCard, likeCard, authorCard);
    this.removeCard = this.removeCard.bind(this);
    this.addLike = this.addLike.bind(this);
    this.createCardPopupImage = this.createCardPopupImage.bind(this);

    this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.removeCard);
    this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.addLike);
    this.cardElement.querySelector('.place-card__image').addEventListener('click', this.createCardPopupImage);
  }

  // метод создания карточки
  createCard(nameCardValue, urlBgValue, idCard, likeCard, authorCard) {
    const placeCardFragment = document.createDocumentFragment();
    let placeCard = document.createElement('div');
    let placeCardPicure = document.createElement('div');
    let placeCardImage = document.createElement('img');
    let placeCardDelete = document.createElement('button');
    let placeCardDescription = document.createElement('div');
    let placeCardName = document.createElement('h3');
    let placeCardLike = document.createElement('div');
    let placeCardLikeIcon = document.createElement('button');
    let placeCardLikeCount = document.createElement('div');

    placeCard.classList.add('place-card');
    placeCard.dataset.id = idCard;
    placeCard.dataset.author = authorCard;

    if (placeCard.dataset.author === userName.textContent) {
      placeCard.dataset.card = 'my';
    }

    placeCardPicure.classList.add('place-card__picture');
    placeCardImage.classList.add('place-card__image');
    placeCardImage.src = urlBgValue;
    placeCardImage.setAttribute('alt', nameCardValue);

    function errorImage() {
      placeCardImage.src = 'https://cdn.browshot.com/static/images/not-found.png';
    }
    placeCardImage.addEventListener('error', errorImage);


    placeCardDelete.classList.add('place-card__delete-icon');
    placeCardDescription.classList.add('place-card__description');
    placeCardName.classList.add('place-card__name');
    placeCardName.textContent = nameCardValue;

    placeCardLike.classList.add('place-card__like');
    placeCardLikeIcon.classList.add('place-card__like-icon');
    placeCardLikeIcon.dataset.id = idCard;

    placeCardLikeCount.classList.add('place-card__like-count');
    placeCardLikeCount.textContent = likeCard;

    placeCardPicure.appendChild(placeCardImage);
    placeCardPicure.appendChild(placeCardDelete);
    placeCardDescription.appendChild(placeCardName);
    placeCardDescription.appendChild(placeCardLike);
    placeCardLike.appendChild(placeCardLikeIcon);
    placeCardLike.appendChild(placeCardLikeCount);
    placeCard.appendChild(placeCardPicure);
    placeCard.appendChild(placeCardDescription);
    placeCardFragment.appendChild(placeCard);

    return placeCard;

  }

  // метод удаления карточки
  removeCard(event) {

    const removeSure = confirm('Вы уверенны?');

    if (removeSure) {
      api.deleteCard(this.cardElement.dataset.id)
        .then(function (result) {

          //console.log(result); // message: "Пост удалён"  
          event.target.closest('.place-cards').removeChild(event.target.closest('.place-card'));

        }).catch(function (err) {
          console.log(err);
        });
    }
    else {
      return;
    }


    const cards = document.querySelectorAll('.place-card');
    const noCards = document.querySelector('.no-cards');

    if (cards.length === 0) {
      noCards.classList.remove('no-cards_hidden');
    }
    else {
      noCards.classList.add('no-cards_hidden');
    }
  }

  // метод для лайков
  addLike(event) {

    const target = event.target;

    target.classList.toggle('place-card__like-icon_liked');

    const like = target.closest('.place-card__like').querySelector('.place-card__like-count');

    if (target.matches('.place-card__like-icon_liked')) {
      api.addLikeCard(target.dataset.id)
        .then(function (result) {
          like.textContent = result.likes.length;
        }).catch(function (err) {
          console.log(err);
        });
    }
    else {
      api.removeLikeCard(target.dataset.id)
        .then(function (result) {
          like.textContent = result.likes.length;
        }).catch(function (err) {
          console.log(err);
        });
    }

  }

  // метод создания всплывающего окна для изображения
  createCardPopupImage() {
    popupImage.createPopupImage(this.link);
  }

}