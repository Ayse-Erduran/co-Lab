import React, {Component} from 'react'
import AceEditor from 'react-ace'
import {languages, themes, fontSizes} from './editorOptions'
import "ace-builds/src-noconflict/mode-jsx"
import WebWorker from "./workerSetup"
import worker from './worker'

import {socket} from '../coLab'

//import different languages to dynamically set mode in AceEditor
Object.keys(languages).forEach(lang => {
  require(`ace-builds/src-noconflict/mode-${lang}`)
  require(`ace-builds/src-noconflict/snippets/${lang}`)
})

//import different themes to dynamically set theme in AceEditor
Object.keys(themes).forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`))



export default class CodeRoom extends Component{
  constructor(){
    super()
    this.state = {
      mode: "javascript",
      theme: "github",
      fontSize: 14,
      value: '',
      result: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.setFontSize = this.setFontSize.bind(this)
    this.executeCode = this.executeCode.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(newValue){
    socket.emit('code', {room: this.props.room, value: newValue})
    console.log('CHANGE')
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

  componentDidMount(){
    this.worker = new WebWorker(worker)
    // socket.emit('subscribe', this.props.client, this.props.room)
    socket.on('code', (newValue) => {
      console.log('CODE')
      this.setState({
        value: newValue
      })
      console.log('I AM HERE')
    })
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
