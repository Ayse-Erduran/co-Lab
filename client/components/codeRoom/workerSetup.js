// Prepare the worker to run the code passed
export default class WebWorker{
  constructor(worker){
    const code = worker.toString()
    const bb = new Blob(['('+code+')()'], {type: 'text/javascript'})
    const bbURL= URL.createObjectURL(bb)
    return new Worker(bbURL)
  }
}
