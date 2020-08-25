import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import MainScene from './phaser/scenes/MainScene'
import BgScene from './phaser/scenes/BgScene'
import FgScene from './phaser/scenes/FgScene'
import config from './phaser/config/config'

// establishes socket connection
import './socket'

class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config)

    // Add all the scenes
    // << ADD ALL SCENES HERE >>
    // Add all the scenes
    this.scene.add('BgScene', BgScene)
    this.scene.add('FgScene', FgScene)
    this.scene.add('MainScene', MainScene)
    // Start the game with the mainscene
    this.scene.start('MainScene')
    // << START GAME WITH MAIN SCENE HERE >>
  }
}

// Create new instance of game
window.onload = function() {
  window.game = new Game()
}

// const game = new Phaser.Game(config)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
