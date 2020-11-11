/*
 * @Description: 文件说明
 * @Author: wangbin
 * @Date: 2020-11-11 15:12:57
 * @LastEditTime: 2020-11-11 21:01:34
 * @LastEditors: wangbin
 * @FilePath: \my-app\src\index.js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.isColor ? 'moveClick square' : 'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let isColor = false
    if (this.props.arr && this.props.arr.length === 3) {
      isColor = this.props.arr.includes(i) ? true : false
    }
    return (
      <Square
        key={i}
        isColor={isColor}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  // 渲染行数
  renderContent(x, y) {
    let content = []
    for (let i = 0; i < x; i++) {
      content.push(
        <div className="board-row" key={i}>{this.renderRow(i, y)}</div>
      )
    }
    return content
  }
  // 渲染行内容
  renderRow(x, y) {
    let content = []
    for (let i = 0; i < y; i++) {
      let num = x * 3 + i
      content.push(
        this.renderSquare(num)
      )
    }
    return content
  }
  render() {
    return (
      <div>
        {this.renderContent(3, 3)}
        {/* <div className="board-row">
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
        </div> */}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      positionArr: [],
      win: false,
      arr: []
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    const positionArr = this.state.positionArr.slice(0, this.state.stepNumber)
    positionArr.push(i)
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      positionArr: positionArr,
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,

    });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  rederContent() {
    const positionArr = this.state.positionArr
    if (positionArr.length === 0) {
      return ''
    }
    else {
      const arr = [[1, 1], [1, 2], [1, 3],
      [2, 1], [2, 2], [2, 3],
      [3, 1], [3, 2], [3, 3]]

      const content = positionArr.map((item, index) => {
        if (index >= this.state.stepNumber) {
          return
        }
        let position = arr[item]
        const text = `第${index + 1}步:   ${index % 2 === 0 ? 'X' : 'O'}`
        const text1 = `落子第${position[0]}行，第${position[1]}列`
        return (
          <div key={index}>
            <span className='content-span'>{text}</span>
            <span>{text1}</span>
          </div>
        );
      });
      return content
    }
  }

  jumpToNext(v) {
    let num = this.state.stepNumber
    if (v) {
      if (num === this.state.history.length - 1) {
        alert('当前是最后一步')
      } else {
        this.setState({
          stepNumber: num + 1,
          xIsNext: ((num + 1) % 2) === 0
        })
      }
    } else {
      if (num === 0) {
        alert('当前是第一步')
      } else {
        this.setState({
          stepNumber: num - 1,
          xIsNext: ((num - 1) % 2) === 0
        })
      }
    }
  }
  jumpToBegin() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      positionArr: [],
      win: false,
      arr: []
    }
    )
  }

  calculateWinner(squares, flag = false) {
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        if (flag) {
          return [a, b, c]
        } else { return squares[a]; }

      }
    }
    return null;
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    let arr = []
    if (winner) {
      arr = this.calculateWinner(current.squares, true);
    }

    const moves = history.map((step, move) => {
      if (!move) {
        return
      }
      const desc = move ?
        '返回第' + move + '步' :
        '返回一开始';
      return (
        <li key={move} className={move === this.state.stepNumber ? 'moveClick' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === 9) {
      status = '游戏结束！双方平局！'
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }


    return (
      <div>

        <div className="game">
          <div className="game-board">
            <h2 className="title">{status}</h2>
            <Board
              arr={arr}
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
            <div><button onClick={() => this.jumpToNext()} className='game-board-button'>上一步</button>
              <button onClick={() => this.jumpToNext(true)} className='game-board-button'>下一步</button>
              <button onClick={() => this.jumpToBegin()} className='game-board-button'>重新开始</button></div>
          </div>
          <div className="game-info">
            <ol>{moves}</ol>

          </div>
          <div className={this.state.stepNumber === 0 ? 'game-step hidding' : 'game-step'}><span>落子详情:</span>
            {this.rederContent()}</div>
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
