export { Popup };

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



