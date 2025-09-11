export { LoadData };

// Class Load
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