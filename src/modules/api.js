export { Api };


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
       
        //return Promise.reject(`Ошибка: ${res.status}`);
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
        //return Promise.reject(`Ошибка: ${res.status}`);
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

