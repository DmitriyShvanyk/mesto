export { Popup };

// Class Popup
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

  // Open Popup
  openPopup() {
    this.popupElement.classList.add('popup_is-opened');
  }

  // Close Popup
  closePopup() {
    this.popupElement.classList.remove('popup_is-opened');
  }

  // Remove Error When Close Popup
  removeErrorWhenClosePopup(event) {
    const target = event.target;
    let message = target.closest('.popup').querySelectorAll('.popup__error--show');
    for (let i = 0; i < message.length; i++) {
      message[i].textContent = '';
      message[i].classList.remove('popup__error--show');
    }
  }

  // Reset Fields When Close Popup
  resetFieldsWhenClosePopup() {
    this.popupElement.querySelector('.popup__form').reset();
  }

}



