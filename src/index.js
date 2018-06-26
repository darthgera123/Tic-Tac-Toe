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
    /* constructor(props){
        super(props);
        this.state = {
            squares : Array(9).fill(null),
            xIsNext:true,
        };
    } we dont need this since now we are using Game as state */
    /* handleClick(i){
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

    }Again not required */
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    
    render() {
        return (
            <div>
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
/* Now we are trying to implement undo component. SO we have to lift state from board and then allow game to have access into it */
class Game extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
           history: [{
               squares:Array(9).fill(null),
           }],
           stepNumber:0,
           xIsNext:true,
        };
    }
    /* handleClick(i) {
        /* const history = this.state.history; 
        const history = this.state.history.slice(0,this.state.history+1)
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber :history.length,
            xIsNext: !this.state.xIsNext,
        });
    } */
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step){
        this.setState({
            stepNumber : step,
            xIsNext : (step%2)===0,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step,move) => {
            const desc = move ?
            'Go to move #'+move :
            'Go to game start';
            return (
                <li key = {move}>
                    <button onClick = {() => this.jumpTo(move)} >{desc}</button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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