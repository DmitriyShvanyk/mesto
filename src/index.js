export const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort3' : 'https://praktikum.tk/cohort3';
export { root, userName, popupImage, api };

import "./index.css";
import { LoadData } from "./modules/load.js";
import { Api } from "./modules/api.js";
import { CardList } from "./modules/cardList.js";
import { PopupImage } from "./modules/popupImage.js";
import { Popup } from "./modules/popup.js";
import { addAttributeNovalidate, hasError, showError, checkField } from "./modules/validation.js"


// Переменные  
const root = document.querySelector('.root');
const popupEdit = root.querySelector('.popup--edit');
const btnUserEdit = root.querySelector('.user-info__edit');
const popupAddPlace = root.querySelector('.popup--add-place');
const btnUserAddPlace = root.querySelector('.user-info__button');
const popupUpdateAvatar = root.querySelector('.popup--update-avatar');
const formAddPlace = root.querySelector('.popup__form--add-place');
const formEdit = root.querySelector('.popup__form--edit');
const formUpdateAvatar = root.querySelector('.popup__form--update-avatar');
const userName = root.querySelector('.user-info__name');
const userJob = root.querySelector('.user-info__job');
const userPhoto = root.querySelector('.user-info__photo');
const preloader = root.querySelector('.preloader');


const loadData = new LoadData();

loadData.load(1500).then(function () {
  preloader.classList.add('preloader--hidden');
}).catch(function () {
  preloader.classList.remove('preloader--hidden');
});


const api = new Api(`${serverUrl}`, {
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


const cardList = new CardList(document.querySelector('.place-cards'));
const popupImage = new PopupImage(document.querySelector('.popup__image'));


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

const editPopup = new EditPopup(popupEdit, btnUserEdit);
const addPlacePopup = new AddPlacePopup(popupAddPlace, btnUserAddPlace);
const updateAvatarPopup = new UpdateAvatarPopup(popupUpdateAvatar, userPhoto);



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













