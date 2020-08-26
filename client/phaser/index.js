/** @type {import("../typings/phaser")} */
import Phaser from 'phaser'
import MainScene from './scenes/MainScene'
import BgScene from './scenes/BgScene'
import FgScene from './scenes/FgScene'
import StartScene from './scenes/StartScene'
import LobbyScene from './scenes/LobbyScene'

import config from './config/config'
/* The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.
If you experience problems with autocomplete, try opening the phaser.d.ts file and scrolling up and down in it.
That may fix the problem -- some weird quirk with VSCode. A new typing file is released with
every new release of Phaser. Make sure it's up-to-date!
At some point, the typings will
be officially added to the official release so that all you'll have to do is do:
npm install @types/phaser
But this hasn't happened yet!
*/

// Bring in all the scenes

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
    this.scene.add('StartScene', StartScene)
    this.scene.add('LobbyScene', LobbyScene)

    // Start the game with the mainscene
    this.scene.start('StartScene', StartScene)
    // << START GAME WITH MAIN SCENE HERE >>
  }
}
// Create new instance of game
window.onload = function() {
  window.game = new Game()
}

export default Game
