const filters = {
  changeCount (x) {
    x = x / 10000
    var y = x.toFixed(1) + '万'
    return y
  }
}
export default filters
