export { LoadData };

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