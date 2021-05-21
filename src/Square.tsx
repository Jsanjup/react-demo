import React from 'react';
import {style} from './css/square'
import {Ficha} from './Board'

type SquareProps = Ficha & {
  checkSquare : () => void
}

class Square extends React.Component<SquareProps> {
    constructor(props :SquareProps) {
      super(props);
    }
   
    render() :JSX.Element {
      return (
        <button
          className="square"
          onClick={this.props.checkSquare}
          style={{color:this.props.color,...style}}
        >
          {this.props.letter}
        </button>
      );
    }
  }

export default Square;