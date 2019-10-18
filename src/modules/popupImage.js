export { PopupImage };

import {root} from "./../index.js";



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