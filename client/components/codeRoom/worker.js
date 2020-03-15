export default () => {
  onmessage = function(e){
    result = new Function(e.data)()
    self.postMessage(result)
  }
}


