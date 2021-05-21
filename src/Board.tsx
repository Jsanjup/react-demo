import React from "react"
import Square from "./Square"
import { boardStyle, boardRowStyle } from "./css/game"

type BoardProps = {
    winFunction: (letter: Player) => void
}

type BoardState = {
    squares: Ficha[],
    xNext: boolean,
    finished: boolean,
    winner: Ficha | null
}

export type Player = 'X' | 'O'

export type Ficha = {
    letter: Player | null
    color: string
}


class Board extends React.Component<BoardProps, BoardState> {
    constructor(props: BoardProps) {
        super(props);
        this.state = {
            squares: Array(9).fill({ letter: null, color: "black" }),
            xNext: true,
            finished: false,
            //Guardamos el ganador en el estado
            winner: null,
        };
    }

    maybeRenderRestart(): JSX.Element | undefined {
        if (this.state.finished) {
            return <button onClick={() => this.reset()}>
                restart
          </button>
        }
    }

    //Controlamos el fin del juego en una única función
    //Esta función se encargará de gestionar el estado para determinar si se ha acabado y si hay un ganador
    checkFinished(squares: Ficha[]): boolean {
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

    reset(): void {
        this.setState({
            squares: Array(9).fill({ letter: null, color: "black" }),
            xNext: true,
            finished: false,
            //Recordamos resetear el ganador para la proxima partida
            winner: null,
        })
    }

    mark(i: number): void {
        let squares = this.state.squares
        // Se puede mover ficha si el juego no ha terminado y la casilla está vacía. Sabemos si está terminado directamente del estado.
        if (!this.state.finished && !squares[i].letter) {
            squares[i] = this.getTurn()
            this.setState({ squares: squares, xNext: !this.state.xNext })
            //Comprobamos si se acaba el juego después de marcar
            this.checkFinished(squares)
        }
    }

    renderSquare(i: number): JSX.Element {
        return <Square letter={this.state.squares[i].letter} checkSquare={() => this.mark(i)} color={this.state.squares[i].color} />;
    }

    getTurn(): Ficha {
        if (this.state.xNext) {
            return { letter: "X", color: "blue" };
        }
        return { letter: "O", color: "orange" };
    }

    calculateWinner(squares: Ficha[]): Ficha | null {
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
                this.props.winFunction(squares[a].letter as Player)
                squares[a].color = "red"; squares[b].color = "red"; squares[c].color = "red"
                // no es seguro comparar objetos con el triple = ; usar función equals que implementan los objetos para ver si son igual, pero es un poco más incómodo. difici establecer el criterio que los hace iguales. EJ: coche : modelos, gama, color, etc...
                return squares[a];
            }
        }
        return null;
    }


    // ###########
    // # RENDERING
    // ###########

    renderStatus(): JSX.Element {
        //Determinamos si se ha acabado leyendo el estado
        if (this.state.finished) {
            if (this.state.winner) {
                //Obtenemos al ganador leyendo del estado
                return <div>
                    Winner: <a style={{ color: this.state.winner.color }}>
                    {this.state.winner.letter}</a>
                </div>
            } else {
                return <div>
                    Game Finished: Draw
                </div>
            }
        } else {
            return <div>Next player: <a style={{ color: this.getTurn().color, padding:40 }}>{this.getTurn().letter}</a></div>
        }
    }

    render(): JSX.Element {
        let status = this.renderStatus()
        return (
            <div >
                <div className="status" style={{
                    display:"flex",
                    backgroundColor:"green",
                    fontFamily:"sans-serif" ,
                    fontSize:32,  
                    justifyContent: "center"    
                    }}>
                        {status}
                </div>
                <div style={{ backgroundColor: "blue", ...boardStyle }}>
                    <div style={boardRowStyle}>
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div style={boardRowStyle}>
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div style={boardRowStyle}>
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>
                <button onClick={() => this.maybeRenderRestart()}>
                    Restart
                </button>
            </div>
        );
    }
}

export default Board