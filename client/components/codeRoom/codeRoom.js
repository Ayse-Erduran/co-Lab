import React, {Component,  useCallback} from 'react'
import AceEditor from 'react-ace'
import {languages, themes, fontSizes} from './editorOptions'
import "ace-builds/src-noconflict/mode-jsx"
import WebWorker from "./workerSetup"
import worker from './worker'
import {socket} from '../coLab'
import Dropzone from 'react-dropzone'

//import different languages to dynamically set mode in AceEditor
Object.keys(languages).forEach(lang => {
  require(`ace-builds/src-noconflict/mode-${lang}`)
  require(`ace-builds/src-noconflict/snippets/${lang}`)
})

//import different themes to dynamically set theme in AceEditor
Object.keys(themes).forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`))

let filenames = []

export default class CodeRoom extends Component{
  constructor(){
    super()
    this.state = {
      mode: "javascript",
      theme: "github",
      fontSize: 14,
      value: '',
      result: null,
      upload: false,
      files: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.setFontSize = this.setFontSize.bind(this)
    this.executeCode = this.executeCode.bind(this)
    this.onChange = this.onChange.bind(this)
    this.toggleUpload = this.toggleUpload.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.selectFile = this.selectFile.bind(this)
  }

  onChange(newValue){
    socket.emit('code', {room: this.props.room, value: newValue})
  }


  handleChange(evt){
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  setFontSize(evt){
    this.setState({
      fontSize: +evt.target.value
    })
  }

  executeCode(){
    this.worker.postMessage(this.state.value)

    this.worker.addEventListener("message", (event) => {
      this.setState({
        result: event.data
      })
    })
  }

  toggleUpload(){
    const prevState = this.state.upload
    this.setState({
      upload: !prevState
    })
  }

  onDrop(acceptedFiles){
    acceptedFiles.forEach((file) => {
      const fr = new FileReader()
      filenames.push(file.name)
      fr.onload = e => {
        this.setState({
          files: [...this.state.files, fr.result]
        })
      }
      fr.readAsText(file)
    })
  }

  selectFile(evt){
    this.setState({
      value: this.state.files[evt.target.value]
    })
  }

  componentDidMount(){
    this.worker = new WebWorker(worker)
    socket.on('code', (newValue) => {
      console.log('HERE')
      this.setState({
        value: newValue
      })
    })
    // socket.on('upload', (files) => {
    //   this.setState({
    //     files: [...this.state.files, files]
    //   })
    // })
  }

  render(){
    return (
      <div id="codeRoom-outer-container">
        <div id="ace-options-container">
          <div id="language-option">
            <label htmlFor="language">Language</label>
            <select name="mode" value={this.state.mode} onChange={this.handleChange}>
              {Object.keys(languages).map(key => (
                <option value={key}>{languages[key]}</option>
              ))}
            </select>
          </div>
          <div id="theme-option">
            <label htmlFor="theme">Theme</label>
            <select name="theme" value={this.state.theme} onChange={this.handleChange}>
              {Object.keys(themes).map(key => (
                <option value={key}>{themes[key]}</option>
              ))}
            </select>
          </div>
          <div id="fontSize-option">
            <label htmlFor="fontSize">Font Size</label>
            <select name="fontSize" value={this.state.fontSize} onChange={this.setFontSize}>
              {fontSizes.map(size => (
                <option value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
        <div id="file-options">
          <button onClick={this.toggleUpload}>Upload</button>
          <button> Save </button>
            {this.state.upload &&
            <div id="dropzone">
              <Dropzone onDrop={this.onDrop}>
              {({getRootProps, getInputProps}) => (
                <section className="container">
                  <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                  <aside>
                    <h4>Files</h4>
                    <div id="filenames-container">
                      {this.state.files.length > 0 && this.state.files.map((file, idx) => (
                        <button value={idx} onClick={this.selectFile}>{filenames[idx]}</button>))}
                    </div>
                    <div id="close-option">
                      <button onClick={this.toggleUpload}>Done</button>
                    </div>
                  </aside>
                </section>
              )}
              </Dropzone>
            </div>}
          </div>
          <div id="ace-editor-container">
            <AceEditor
              mode={this.state.mode}
              theme={this.state.theme}
              onChange={this.onChange}
              value={this.state.value}
              fontSize={this.state.fontSize}
              setOptions={{
                highlightActiveLine: true,
                tabSize: 2
              }}/>
          </div>
          <div id="console-container">
            <button id="green-button" onClick={this.executeCode}> Run </button>
            <div id="result-console">{this.state.result}</div>
            {/* <div id="result-console">{results !== undefined ? results.map(result => {
            <p>{result}</p>
          }): <p>''</p>} */}
            {/* </div> */}
          </div>
      </div>
    )

  }
}
