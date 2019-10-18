export { addAttributeNovalidate, hasError, showError, checkField };


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