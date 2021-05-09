import React from "react"
import Board from "./Board"

class Game extends React.Component {
  ranking = [];

  constructor(props) {
    super(props);
    this.state = {
      players : []
    };
  }

  async loadStandings(players) {
    //let response  = await fetch("https://f7930cb7c99c.ngrok.io/api/v1/players")
    //this.ranking = await response.json()
    for (let i in players) {
      let p = players[i]
      p.victories = 0
      p.chip = (i < 1) ? 'X' : 'O'
      console.log("Loading stadings", p, i)
    } 
  }

  async publishResult(players, winner) {
    let xPlayer = this.getPlayer('X');
    let game = {
      players: {
        X: players[xPlayer].name,
        O: players[(xPlayer+1)%2].name,
      },
      winner: winner,
    }
    fetch("https://f7930cb7c99c.ngrok.io/api/v1/games", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify(game)
    })
  }

  getPlayer(letter){
    return this.state.players.findIndex(p => p.chip === letter)
  }

  gameWon(winner) {
    let winnerPos = this.getPlayer(winner)
    let players = this.state.players
    let playerWinner = players[winnerPos]
    alert("Enhorabuena, " + playerWinner.name)
    this.gameFinished(winner)
    players[winnerPos].victories = players[winnerPos].victories +1
    this.setState({players: players})
  }

  gameFinished(winner) {
    this.publishResult(this.state.players, winner)
    this.setState({ xFirst: !this.state.xFirst })
  }

  maybeRenderGame() {
    if (this.state.players.length === 2) {
      return (<>
        <div className="game-board">
          <Board winFunction={(w) => this.gameWon(w)} />
        </div>
        <div className="game-info">
          <table>
            <th>Marcador</th>
            {this.state.players.map(player => (<tr>
              <td>{player.name} [{player.chip}]</td>
              <td>{player.victories}</td>
              </tr>
              )
            )}
          </table>
        </div>
      </>)
    } else {
      return (<>
      Introduzca el jugador #{this.state.players.length+1}: <input type="text" onKeyDown={async (event) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
              let newPlayer = event.target.value
              let players = this.state.players;
              players.push({name: newPlayer})
              if (players.length === 2) {
                await this.loadStandings(players)
              } else {
                event.target.value = "" //reset text after first input
              }
              this.setState({players: players})
            }
          }}></input>
      </>)
    }
  }

  render() {
    return (
      <div className="game">
        {this.maybeRenderGame()}
        <div id="ranking">
          {this.ranking.map(p => <>{p}</>)}
        </div>
      </div>
    );
  }
}

export default Game;