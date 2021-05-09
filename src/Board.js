import React from "react"
import Square from "./Square"

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill({ letter: null, color: "black" }),
            xNext: true,
            finished: false,
            //Guardamos el ganador en el estado
            winner: null,
        };
    }

    maybeRenderRestart() {
        if (this.state.finished) {
            return <button onClick={() => this.reset()}> restart
          </button>
        }
    }

    //Controlamos el fin del juego en una única función
    //Esta función se encargará de gestionar el estado para determinar si se ha acabado y si hay un ganador
    checkFinished(squares) {
        if (this.state.finished) {
            //Si ya estaba acabado sigue acabado
            return true
        }
        let winner = this.calculateWinner(squares)
        if (winner) {
            //Si hay un ganador, lo guardamos en el estado
            this.setState({
                finished: true,
                winner: winner
            })
            return true
        }
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].letter === null) {
                return false
            }
        }
        // Si no quedan casillas libres, el juego se ha acabado sin ganador
        this.setState({
            finished: true,
            winner: null
        })
        return true
    }

    reset() {
        this.setState({
            squares: Array(9).fill({ letter: null, color: "black" }),
            xNext: true,
            finished: false,
            //Recordamos resetear el ganador para la proxima partida
            winner: null,
        })
    }

    mark(i) {
        let squares = this.state.squares
        // Se puede mover ficha si el juego no ha terminado y la casilla está vacía. Sabemos si está terminado directamente del estado.
        if (!this.state.finished && !squares[i].letter) {
            squares[i] = this.getTurn()
            this.setState({ squares: squares, xNext: !this.state.xNext })
            //Comprobamos si se acaba el juego después de marcar
            this.checkFinished(squares)
        }
    }

    renderSquare(i) {
        return <Square value={this.state.squares[i].letter} checkSquare={() => this.mark(i)} color={this.state.squares[i].color} />;
    }

    getTurn() {
        if (this.state.xNext) {
            return { letter: "X", color: "blue" };
        }
        return { letter: "O", color: "orange" };
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a].letter && squares[a].letter === squares[b].letter && squares[a].letter === squares[c].letter) {
                this.props.winFunction(squares[a].letter)
                squares[a].color = "red"; squares[b].color = "red"; squares[c].color = "red"
                // no es seguro comparar objetos con el triple = ; usar función equals que implementan los objetos para ver si son igual, pero es un poco más incómodo. difici establecer el criterio que los hace iguales. EJ: coche : modelos, gama, color, etc...
                return squares[a];
            }
        }
        return null;
    }

    renderStatus() {
        //Determinamos si se ha acabado leyendo el estado
        if (this.state.finished) {
            if (this.state.winner) {
                //Obtenemos al ganador leyendo del estado
                return <div>Winner: <a style={{ color: this.state.winner.color }}>
                    {this.state.winner.letter}</a>
                </div>
            } else {
                return "Game Finished: Draw"
            }
        } else {
            return <div>Next player: <a style={{ color: this.getTurn().color }}>{this.getTurn().letter}</a></div>
        }
    }

    render() {
        let status = this.renderStatus()
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
                <div button="restart">
                    {this.maybeRenderRestart()}
                </div>
            </div>
        );
    }
}

export default Board