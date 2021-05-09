import React from 'react';

class Square extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: null,
      };
    }
   
    render() {
      return (
        <button
          className="square"
          onClick={this.props.checkSquare}
          style={{color:this.props.color}}
        >
          {this.props.value}
        </button>
      );
    }
  }

export default Square;