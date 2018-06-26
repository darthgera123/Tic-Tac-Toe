import React from 'react';
import ReactDOM from 'react-dom'
import './index.css'
/*This is my first React project. This will be a detailed step by step guide to each and every step*/
/* This class has capital letter meaning its a component. In react the component are only refreshed instead of the entire page */ 
/* Now we will add state which will remember previous changes */
/* we initialize a state with a simple constructor */
/* Square is one component, Board is a component that has 9 squares. */

/* class Square extends React.Component {
    constructor(props){
        super(props);       //whenever a constructor is called this has to be done
        this.state = {      //State is treated as a private member
            value:null,
        };
    }
    render() {
        return (
            
            <button 
            className = "square" 
            onClick={()=>this.props.onClick()}>
            {this.props.value} {/* Before what happened was we had printed property value. Now for each component we set state value as Null and on click it becomes 'X }
            </button>
        );
    }
} */
/* Now we are making a functional component where we generalize and its easier to maintain as we dont have to worry about states */
function Square(props){
    return (
        <button 
        className= "square"
        onClick = {props.onClick}
        >
        {props.value}
        </button>
    );
}
/* Earlier we were passing props value to be displayed. however that will change now since state ignores it */ 
/* Now we created the board state and all the squares as functional component. Now we created a handleClick function which basically
is a property for each square.Think of board as a class and square as an object.We are using slice inorder to maintain immutability */
class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            squares : Array(9).fill(null),
            xIsNext:true,
        };
    }
    handleClick(i){
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i])
        {
            return;
        }
        squares[i]=this.state.xIsNext ? 'X' : 'O'; 
        this.setState({
            squares: squares,
            xIsNext : !this.state.xIsNext,
        });

    }
    renderSquare(i) {
        return <Square 
        value={this.state.squares[i]}
        onClick = {()=>this.handleClick(i)} 
        />; 
    }
    
    render() {
        const winner =calculateWinner(this.state.squares);
        let status;
        if(winner){
            status = 'Winner ' + winner;
        }
        else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
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
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
            <div className="game-board">
            <Board />
            </div>
            <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
            </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares){
    /* Winning combinations */
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if(squares[a]&& squares[a] === squares[b] && squares[a] === squares[c])
        {    
            return squares[a];
        }
    }
    return null;
}