(function () {

  'use strict';

  // Переменные  
  const root = document.querySelector('.root');
  const popopEdit = root.querySelector('.popup--edit');
  const btnUserEdit = root.querySelector('.user-info__edit');
  const popopAddPlace = root.querySelector('.popup--add-place');
  const btnUserAddPlace = root.querySelector('.user-info__button');
  const popopUpdateAvatar = root.querySelector('.popup--update-avatar');
  const formAddPlace = root.querySelector('.popup__form--add-place');
  const formEdit = root.querySelector('.popup__form--edit');
  const formUpdateAvatar = root.querySelector('.popup__form--update-avatar');
  const userName = root.querySelector('.user-info__name');
  const userJob = root.querySelector('.user-info__job');
  const userPhoto = root.querySelector('.user-info__photo');
  const preloader = root.querySelector('.preloader');


  // класс Предзагрузка данных (UX)
  class LoadData {
    contructor() {
      this.load(ms);
    }
    load(ms) {
      return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
      });
    }
  }

  const loadData = new LoadData();

  loadData.load(1500).then(function () {
    preloader.classList.add('preloader--hidden');
  }).catch(function () {
    preloader.classList.remove('preloader--hidden');
  });



  // класс API
  class Api {
    constructor(url, headers) {
      this.url = url;
      this.headers = headers;
    }

    getInitialProfile() {

      return fetch(`${this.url}/users/me`, {
        headers: this.headers
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Ошибка: ${res.status}`);
        });

    }

    getInitialCards() {
      return fetch(`${this.url}/cards`, {
        headers: this.headers
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Ошибка: ${res.status}`);
        });
    }


    editProfile(nameUser = 'Dmitriy Shvanyk', aboutUser = 'Погромист') {

      return fetch(`${this.url}/users/me`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          name: nameUser,
          about: aboutUser
        })
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Ошибка: ${res.status}`);
        });
    }


    addNewCard(nameCard, linkCard) {
      return fetch(`${this.url}/cards`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          name: nameCard,
          link: linkCard
        })
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Ошибка: ${res.status}`);
        });
    }

    deleteCard(idCard) {
      return fetch(`${this.url}/cards/${idCard}`, {
        method: 'DELETE',
        headers: this.headers,
        body: JSON.stringify({
          _id: idCard
        })
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Ошибка: ${res.status}`);
        });
    }


    addLikeCard(idCard) {
      return fetch(`${this.url}/cards/like/${idCard}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({
          _id: idCard
        })
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Ошибка: ${res.status}`);
        });
    }

    removeLikeCard(idCard) {
      return fetch(`${this.url}/cards/like/${idCard}`, {
        method: 'DELETE',
        headers: this.headers,
        body: JSON.stringify({
          _id: idCard
        })
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Ошибка: ${res.status}`);
        });
    }

    updateAvatar(avatar) {
      return fetch(`${this.url}/users/me/avatar`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          avatar: avatar
        })
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Ошибка: ${res.status}`);
        });
    }


  }

  const api = new Api('http://95.216.175.5/cohort3', {
    authorization: '890a4847-3c0f-4e3b-87b9-24524491049c',
    'Content-Type': 'application/json'
  });



  api.getInitialProfile()
    .then(function (result) {
      userName.textContent = result.name;
      userJob.textContent = result.about;
      userPhoto.style.backgroundImage = `url(${result.avatar})`;
    }).catch(function (err) {
      console.log(err);
    });

  api.getInitialCards()
    .then(function (result) {

      console.log(result);

      for (let i = 0; i < result.length; i++) {

        cardList.addCard(result[i].name, result[i].link, result[i]._id, result[i].likes.length, result[i].owner.name);

        for (let j = 0; j < result[i].likes.length; j++) {

          if (result[i].likes[j].name === userName.textContent) {
            const likeIcons = document.querySelectorAll('.place-card__like-icon');
            for (let k = 0; k < likeIcons.length; k++) {
              likeIcons[i].classList.add('place-card__like-icon_liked');
            }

          }

        }

      }

      // Кол-во добавленных карточек
      const cardCounts = document.querySelector('.places-cards__count');
      const cardCountsMy = document.querySelector('.places-cards__count--my');
      const cardsMy = document.querySelectorAll('[data-card=my]');
      cardCounts.textContent = `Количество карточек - ${result.length}`;
      cardCountsMy.textContent = `Количество моих карточек - ${cardsMy.length}`;


    })
    .catch(function (err) {
      console.log(err);
    });
   



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

      function errorImage(){
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

            console.log(result); // message: "Пост удалён"  
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
      // console.log(this.link)      
      popupImage.createPopupImage(this.link);
    }

  }


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

  const cardList = new CardList(document.querySelector('.place-cards'));



  // Класс, для создания всплывающего окна с изображением
  class PopupImage {
    constructor(popupImageElement) {
      this.popupImageElement = popupImageElement;
      this.createPopupImage = this.createPopupImage.bind(this);
    }

    createPopupImage() {
      const target = event.target;
      const popupFragment = document.createDocumentFragment();
      let popup = document.createElement('div');
      let popupOverlay = document.createElement('div');
      let popupContent = document.createElement('div');
      let popupCaption = document.createElement('div');
      let popupImage = document.createElement('img');
      let popupClose = document.createElement('button');

      popup.classList.add('popup', 'popup_is-opened');
      popupOverlay.classList.add('popup__overlay', 'popup__overlay_image');
      popupContent.classList.add('popup__content', 'popup__content_image');
      popupCaption.classList.add('popup__caption');
      popupCaption.textContent = `${target.parentElement.nextElementSibling.children[0].textContent}`;
      popupImage.classList.add('popup__image');
      popupImage.src = target.src;
      popupImage.setAttribute('alt', `${target.parentElement.nextElementSibling.children[0].textContent}`);
      popupClose.classList.add('popup__close', 'popup__close_image');
      popupClose.textContent = 'X';

      popup.appendChild(popupOverlay);
      popupContent.appendChild(popupImage);
      popupContent.appendChild(popupCaption);
      popupContent.appendChild(popupClose);
      popup.appendChild(popupContent);
      popupFragment.appendChild(popup);
      root.appendChild(popupFragment);

      popupClose.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('popup__close_image')) {
          root.removeChild(target.closest('.popup'));
        }
      });
      popupOverlay.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('popup__overlay_image')) {
          root.removeChild(target.closest('.popup'));
        }
      });

    }

  }
  const popupImage = new PopupImage(document.querySelector('.popup__image'));



  // Класс для всплывающего окна
  class Popup {
    constructor(popupElement, btnElement) {
      this.popupElement = popupElement;
      this.btnElement = btnElement;

      this.openPopup = this.openPopup.bind(this);
      this.closePopup = this.closePopup.bind(this);
      this.resetFieldsWhenClosePopup = this.resetFieldsWhenClosePopup.bind(this);

      this.btnElement.addEventListener('click', this.openPopup);

      this.popupElement.querySelector('.popup__close').addEventListener('click', this.closePopup);
      this.popupElement.querySelector('.popup__overlay').addEventListener('click', this.closePopup);
    }

    // метод для открытия окна
    openPopup() {
      this.popupElement.classList.add('popup_is-opened');
    }

    // метод для закрытия окна
    closePopup() {
      this.popupElement.classList.remove('popup_is-opened');
    }

    // метод для удаления ошибок валидации при закрытии всплывающего окна
    removeErrorWhenClosePopup(event) {
      const target = event.target;
      let message = target.closest('.popup').querySelectorAll('.popup__error--show');
      for (let i = 0; i < message.length; i++) {
        message[i].innerHTML = '';
        message[i].classList.remove('popup__error--show');
      }
    }

    // метод для очистки полей при закрытии всплывающего окна
    resetFieldsWhenClosePopup() {
      this.popupElement.querySelector('.popup__form').reset();
    }

  }


  // Класс наследник EditPopup
  class EditPopup extends Popup {

    // метод для открытия окна Edit
    openPopup(event) {
      super.openPopup(event);
      event.target.closest('.root').querySelector('.popup__input_user-name').value = userName.textContent;
      event.target.closest('.root').querySelector('.popup__input_user-job').value = userJob.textContent;
      formEdit.lastElementChild.removeAttribute('disabled');
    }

    // метод для закрытия окна Edit
    closePopupEdit(event) {
      const target = event.target;
      if (target.matches('.popup--edit .popup__close') || target.matches('.popup--edit .popup__overlay')) {
        popupEdit.resetFieldsWhenClosePopup(event);
        popupEdit.removeErrorWhenClosePopup(event);
        popupEdit.openPopupEdit();
      }
    }

  }


  // Класс наследник AddPlacePopup
  class AddPlacePopup extends Popup {
    closePopup(event) {
      super.closePopup(event);
      const target = event.target;
      if (target.matches('.popup--add-place .popup__close') || target.matches('.popup--add-place .popup__overlay')) {
        addPlacePopup.resetFieldsWhenClosePopup(event);
        target.closest('.popup--add-place').querySelector('.popup__button--add-place').setAttribute('disabled', true);
        addPlacePopup.removeErrorWhenClosePopup(event);
      }
    }
  }


  // Класс наследник UpdateAvatarPopup
  class UpdateAvatarPopup extends Popup {
    closePopup(event) {
      super.closePopup(event);
      const target = event.target;
      if (target.matches('.popup--update-avatar .popup__close') || target.matches('.popup--update-avatar .popup__overlay')) {
        addPlacePopup.resetFieldsWhenClosePopup(event);
        target.closest('.popup--update-avatar').querySelector('.popup__button--update-avatar').setAttribute('disabled', true);
        addPlacePopup.removeErrorWhenClosePopup(event);
      }
    }
  }



  const editPopup = new EditPopup(popopEdit, btnUserEdit);
  const addPlacePopup = new AddPlacePopup(popopAddPlace, btnUserAddPlace);
  const updateAvatarPopup = new UpdateAvatarPopup(popopUpdateAvatar, userPhoto);



  // Добавляем атрибут novalidate
  function addAttributeNovalidate() {
    const forms = document.querySelectorAll('.popup__form');
    for (let i = 0; i < forms.length; i++) {
      forms[i].setAttribute('novalidate', true);
      forms[i].querySelector('.popup__button').setAttribute('disabled', true);
    }
  }


  // Функция наличия ошибок
  function hasError(field) {

    if (field.disabled || field.type === 'submit') {
      return;
    }

    let validity = field.validity;

    if (validity.valid) {
      return;
    }

    if (validity.valueMissing) {
      return 'Это обязательное поле';
    }

    if (validity.typeMismatch) {

      // URL
      if (field.type === 'url') {
        return 'Здесь должна быть ссылка';
      }

    }

    if (validity.tooShort || validity.tooLong) {
      return 'Должно быть от ' + field.getAttribute('minLength') + ' до ' + field.getAttribute('maxLength') + ' символов';
    }

    // Общая ошибка
    return 'Это обязательное поле';

  }


  // Функция отображения ошибок валидации
  function showError(field, error) {

    let name = field.name;
    if (!name) {
      return;
    }

    let message = field.form.querySelector('.popup__error#popup__error-' + name);
    if (!message) {
      message = document.createElement('div');
      message.classList.add('popup__error');
      message.id = 'popup__error-' + name;

      field.parentElement.insertBefore(message, field.nextSibling);
    }

    message.innerHTML = error;
    message.classList.add('popup__error--show');
  }


  // Функция удаления ошибок валидации
  function removeError(field) {

    let name = field.name;
    if (!name) {
      return;
    }

    let message = field.form.querySelector('.popup__error#popup__error-' + name + '');
    if (!message) {
      return;
    }

    message.innerHTML = '';
    message.classList.remove('popup__error--show');
  }


  // Функция проверки поля
  function checkField(event) {

    const target = event.target;

    if (!target.form.classList.contains('popup__form')) {
      return;
    }

    let error = hasError(target);

    if (error) {
      target.closest('.popup__form').querySelector('.popup__button').setAttribute('disabled', true);
      showError(target, error);
      return;
    }
    const fields = target.closest('.popup__form').elements;


    for (let i = 0; i < fields.length; i++) {
      error = hasError(fields[i]);
      if (error) {
        target.closest('.popup__form').querySelector('.popup__button').setAttribute('disabled', true);
        removeError(event.target);
        return;
      }
      else {
        target.closest('.popup__form').querySelector('.popup__button').removeAttribute('disabled');
      }
    }

    target.closest('.popup__form').querySelector('.popup__button').removeAttribute('disabled');

    removeError(target);
  }


  // Функция валидации формы Добавить место
  function validationFormAddPlace(event) {
    event.preventDefault();

    const target = event.target;

    if (!target.classList.contains('popup__form')) {
      return;
    }

    let fields = target.elements;

    let error, hasErrors;
    for (let i = 0; i < fields.length; i++) {
      error = hasError(fields[i]);
      if (error) {
        showError(fields[i], error);
        if (!hasErrors) {
          hasErrors = fields[i];
        }
      }
    }

    if (hasErrors) {
      event.preventDefault();
      hasErrors.focus();
    }

    else {

      api.addNewCard(target.elements.name.value, target.elements.link.value)
        .then(function (result) {

          cardList.addCard(result.name, result.link, result._id, result.likes.length, result.owner.name);

          setTimeout(function () {

            target.querySelector('.popup__button--add-place').textContent = '+';

            if (target.classList.contains('popup__form')) {
              addPlacePopup.closePopup(event);
            }

            target.reset();
            target.lastElementChild.setAttribute('disabled', true);

          }, 1000);


        }).catch(function (err) {

          console.log(err);

        }).finally(function () {
          target.querySelector('.popup__button--add-place').textContent = 'Загрузка ...';
        });


    }

  }


  // Функция валидации формы Edit
  function validationFormEdit(event) {

    const target = event.target;

    if (!target.classList.contains('popup__form')) {
      return;
    }

    let fields = target.elements;

    let error, hasErrors;
    for (let i = 0; i < fields.length; i++) {
      error = hasError(fields[i]);
      if (error) {
        showError(fields[i], error);
        if (!hasErrors) {
          hasErrors = fields[i];
        }
      }
    }

    if (hasErrors) {
      event.preventDefault();
      hasErrors.focus();
    }

    else {

      //console.log(target);

      event.preventDefault();

      target.querySelector('.popup__button--edit').textContent = 'Сохранить';

      api.editProfile(target.elements.userName.value, target.elements.userJob.value)
        .then(function (result) {
          userName.textContent = result.name;
          userJob.textContent = result.about;

          setTimeout(function () {

            target.querySelector('.popup__button--edit').textContent = 'Сохранить';

            if (target.classList.contains('popup__form')) {
              editPopup.closePopup(event);
            }

          }, 1000);

        }).catch(function (err) {
          console.log(err);

        }).finally(function () {

          target.querySelector('.popup__button--edit').textContent = 'Загрузка ...';

        });

    }

  }


  // Функция валидации формы Добавить место
  function validationFormUpdateAvatar(event) {
    event.preventDefault();

    const target = event.target;

    if (!target.classList.contains('popup__form')) {
      return;
    }

    let fields = target.elements;

    let error, hasErrors;
    for (let i = 0; i < fields.length; i++) {
      error = hasError(fields[i]);
      if (error) {
        showError(fields[i], error);
        if (!hasErrors) {
          hasErrors = fields[i];
        }
      }
    }

    if (hasErrors) {
      event.preventDefault();
      hasErrors.focus();
    }

    else {

      api.updateAvatar(target.elements.avatar.value)
        .then(function (result) {

          userPhoto.style.backgroundImage = `url(${result.avatar})`;

          setTimeout(function () {

            target.querySelector('.popup__button--update-avatar').textContent = 'Обновить';

            if (target.classList.contains('popup__form')) {
              updateAvatarPopup.closePopup(event);
            }

            target.reset();
            target.lastElementChild.setAttribute('disabled', true);

          }, 1000);

        }).catch(function (err) {
          console.log(err);

        }).finally(function () {

          target.querySelector('.popup__button--update-avatar').textContent = 'Загрузка ...';

        });


    }

  }


  /* Слушатели событий */
  root.addEventListener('input', checkField);
  formAddPlace.addEventListener('submit', validationFormAddPlace);
  formEdit.addEventListener('submit', validationFormEdit);
  formUpdateAvatar.addEventListener('submit', validationFormUpdateAvatar);

  /* Вызовы функций */
  addAttributeNovalidate();



})();


/**
 *
 * Хорошая работа и хорошо что сделали всё обязательные задания

 *  Можно лучше: обычно названия, для примера  'Загрузка ...'
 * выносят в отдельный объект. Допустим может появится задача сделать многоязычный сайт
 * Для примера : const lang = { load: 'Загрузка ...' }
 *
 *

  Очень рекомендую для чтения https://refactoring.guru/ru/refactoring

  @koras

  */