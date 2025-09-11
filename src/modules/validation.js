export { addAttributeNovalidate, hasError, showError, checkField };


// Add Attribute Novalidate
function addAttributeNovalidate() {
  const forms = document.querySelectorAll('.popup__form');
  for (let i = 0; i < forms.length; i++) {
    forms[i].setAttribute('novalidate', true);
    forms[i].querySelector('.popup__button').setAttribute('disabled', true);
  }
}


// Has Error
function hasError(field) {

  if (field.disabled || field.type === 'submit') {
    return;
  }

  let validity = field.validity;

  if (validity.valid) {
    return;
  }

  if (validity.valueMissing) {
    return 'This field is required';
  }

  if (validity.typeMismatch) {

    // URL
    if (field.type === 'url') {
      return 'There should be a link here';
    }

  }

  if (validity.tooShort || validity.tooLong) {
    return 'Must be from ' + field.getAttribute('minLength') + '  to ' + field.getAttribute('maxLength') + ' characters';
  }

  // General Error
  return 'This field is required';

}


//  Show Error
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


// Remove Error
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


// Check Field
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