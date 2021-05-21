import React from "react"
import Board, {Ficha, Player as Chip} from "./Board"
import {gameStyle, boardContainer,scoresTable, scoresContainer, rankingStyle } from './css/game'

type GameProps = {
}

type Player = {
  chip : Chip,
  name : string,
  victories: number
}

type GameState={
  players :Player[]
  xFirst: boolean
}

class Game extends React.Component<GameProps, GameState>{
  ranking = [];

  constructor(props: GameProps) {
    super(props);
    this.state = {
      xFirst : false,
      players : []
    };
  }

  async loadStandings(players: any[]) :Promise<void> {
    //let response  = await fetch("https://f7930cb7c99c.ngrok.io/api/v1/players")
    //this.ranking = await response.json()
    for (let i in players) { 
      let n = (i as unknown)as number
      let p = players[n]
      p.victories = 0
      p.chip = (n < 1) ? 'X' : 'O'
      console.log("Loading stadings", p, i)
    } 
  }

  async publishResult(players :Player[], winner :string) :Promise<void> {
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

  getPlayer(letter:string) :number{
    return this.state.players.findIndex(p => p.chip === letter)
  }

  gameWon(winner :string) :void {
    let winnerPos = this.getPlayer(winner)
    let players = this.state.players
    let playerWinner = players[winnerPos]
    alert("Enhorabuena, " + playerWinner.name)
    this.gameFinished(winner)
    players[winnerPos].victories = players[winnerPos].victories +1
    this.setState({players: players})
  }

  gameFinished(winner :string) :void {
    this.publishResult(this.state.players, winner)
    this.setState({ xFirst: !this.state.xFirst })
  }



  // ###########
  // # RENDERING
  // ###########

  renderBoardAndScoreboard() :JSX.Element {
    return (<>
      <div  style={boardContainer}>
        <Board winFunction={(w) => this.gameWon(w)} />
      </div>
      <div style={scoresContainer}>
        <table style={scoresTable}>
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
  }

  renderPlayerIntro() :JSX.Element {
    return (<>
      Introduzca el jugador #{this.state.players.length+1}: <input type="text" onKeyDown={async (event) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
              let newPlayer = (event.target as any).value as string
              let players = this.state.players;
              players.push({name: newPlayer, victories:0, chip: "X"})
              if (players.length === 2) {
                await this.loadStandings(players)
              } else {
                (event.target as any).value = "" //reset text after first input
              }
              this.setState({players: players})
            }
          }}></input>
      </>)
  }

  maybeRenderGame() :JSX.Element {
    if (this.state.players.length === 2) {
      return this.renderBoardAndScoreboard()
    } else {
      return this.renderPlayerIntro()
    }
  }

  render(): JSX.Element {
    return (
      <div style={gameStyle}>
        {this.maybeRenderGame()}
        <div id="ranking" style={rankingStyle}>
          {this.ranking.map(p => <>{p}</>)}
        </div>
      </div>
    );
  }
}

export default Game;