import React, { useState, useEffect } from 'react';  
import './Gomoku.css'; // 确保 CSS 文件存在  

function Square({ value, onSquareClick }) {  
    return (  
        <button className="square" onClick={onSquareClick}>  
            {value}  
        </button>  
    );  
}  

function Board({ squares, onPlay }) {  
    const handleClick = (i) => {  
        if (squares[i]) return; // 忽略已填充格子  
        const nextSquares = squares.slice();  
        nextSquares[i] = 'X'; // 玩家为 X  
        onPlay(nextSquares);  
    };  

    return (  
        <div className="board">  
            {squares.map((value, index) => (  
                <Square key={index} value={value} onSquareClick={() => handleClick(index)} />  
            ))}  
        </div>  
    );  
}  

export default function Game() {  
    const [squares, setSquares] = useState(Array(400).fill(null)); // 20x20 棋盘  
    const [xIsNext, setXIsNext] = useState(true);  
    const [winner, setWinner] = useState(null);  
    const [showMessage, setShowMessage] = useState('');  
    const [nickname, setNickname] = useState(''); // 玩家昵称  
    const [password, setPassword] = useState(''); // 玩家密码  
    const [isRegistered, setIsRegistered] = useState(false); // 注册状态  

    const handlePlay = (nextSquares) => {  
        setSquares(nextSquares);  
        setXIsNext(!xIsNext);  
    };  

    useEffect(() => {  
        const win = calculateWinner(squares);  
        if (win) {  
            setWinner(win);  
            if (win === 'X') {  
                setShowMessage("太厉害了，恭喜您获得胜利！");  
            } else {  
                setShowMessage("很遗憾您失败了，再来一局吧。");  
            }  
        } else if (squares.every(square => square !== null)) {  
            setShowMessage("平局!");  
        } else if (!xIsNext) {  
            // AI 下棋逻辑  
            setTimeout(() => {  
                const move = getAIMove(squares);  
                const nextSquares = squares.slice();  
                nextSquares[move] = 'O'; // 电脑为 O  
                handlePlay(nextSquares);  
            }, 500); // 模拟 AI 决策时间  
        }  
    }, [squares, xIsNext]);  

    const getAIMove = (squares) => {  
        const size = 20;  
        const directions = [  
            { x: 1, y: 0 }, // 水平  
            { x: 0, y: 1 }, // 垂直  
            { x: 1, y: 1 }, // 主对角线  
            { x: 1, y: -1 }, // 副对角线  
        ];  

        const findBlockFour = () => {  
            for (let i = 0; i < size; i++) {  
                for (let j = 0; j < size; j++) {  
                    if (squares[i * size + j] === null) {  
                        for (const { x, y } of directions) {  
                            let count = 0;  
                            for (let k = 1; k <= 4; k++) {  
                                const ni = i + k * y;  
                                const nj = j + k * x;  
                                if (ni < size && nj < size && squares[ni * size + nj] === 'X') {  
                                    count++;  
                                }  
                            }  

                            // 检查反向的 X  
                            for (let k = 1; k <= 4; k++) {  
                                const ni = i - k * y;  
                                const nj = j - k * x;  
                                if (ni >= 0 && nj >= 0 && squares[ni * size + nj] === 'X') {  
                                    count++;  
                                }  
                            }  

                            // 如果有四子连，阻止 X  
                            if (count === 4) {  
                                return i * size + j; // 返回可阻止位置  
                            }  
                        }  
                    }  
                }  
            }  
            return null; // 没有可以阻止的位置  
        };  

        // 检查阻止四子线场景，优先阻止  
        const blockFourMove = findBlockFour();  
        if (blockFourMove !== null) {  
            return blockFourMove;  
        }  

        // 检查 AI 是否可以胜利  
        for (let i = 0; i < squares.length; i++) {  
            if (squares[i] === null) {  
                const nextSquares = squares.slice();  
                nextSquares[i] = 'O'; // 尝试下 O  
                if (calculateWinner(nextSquares) === 'O') {  
                    return i; // 如果这个位置会导致 AI 胜利，选择这个位置  
                }  
            }  
        }  

        // 随机选择其他空位  
        const emptySquares = squares.map((val, index) => (val === null ? index : null)).filter(val => val !== null);  
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];  
    };  

    const restartGame = () => {  
        setSquares(Array(400).fill(null)); // 重置棋盘  
        setXIsNext(true); // 重置为 X  
        setWinner(null); // 清除胜负状态  
        setShowMessage(''); // 隐藏消息  
    };  

    // 注册逻辑
    const handleRegister = () => {  
      setShowMessage('');  
  
      fetch('http://localhost:5000/register', {    // 实际的注册接口地址  
          method: 'POST',  
          headers: {  
              'Content-Type': 'application/json'  
          },  
          body: JSON.stringify({ nickname: 'testUser', password: 'testPassword' })   // 实际注册接口需要的参数  
      })  
      .then(response => {  
          // 检查响应状态  
          if (!response.ok) {  
              throw new Error(`HTTP error! status: ${response.status}`);  // 处理 HTTP 错误
          }  
          return response.json();  // 确保这个是有效的 JSON  
      })  
      .then(data => {  
          console.log('注册成功:', data);  
          // 处理注册成功逻辑  
          if (data.success) {  
              setIsRegistered(true);  
              setShowMessage("注册成功！开始游戏吧！");  
              setNickname('');  
              setPassword('');  
          } else {  
              setShowMessage("注册失败，请尝试其他昵称或密码。");  
          }  
      })  
      .catch(error => {  
          console.error('请求失败:', error);  
          setShowMessage("发生错误，请重试。");  
      });  
  };

    const buttonText = winner ? '再来一局' : '开始游戏'; // 根据胜利状态更改按钮文字  
    const status = winner ? '' : (xIsNext ? '请您下棋' : '轮到电脑下棋');  

    return (  
        <div className="game-container">  
            <h1 className="title">五子棋</h1>  
            {!isRegistered ? (  
                <div className="register">  
                    <h2>注册新玩家</h2>  
                    <input  
                        type="text"  
                        placeholder="昵称"  
                        value={nickname}  
                        onChange={(e) => setNickname(e.target.value)}  
                    />  
                    <input  
                        type="password"  
                        placeholder="密码"  
                        value={password}  
                        onChange={(e) => setPassword(e.target.value)}  
                    />  
                    <button onClick={handleRegister}>注册</button>  
                    {showMessage && <div className="message">{showMessage}</div>}  
                </div>  
            ) : (  
                <React.Fragment>  
                    <Board squares={squares} onPlay={handlePlay} />  
                    <div className="info">  
                        <button className="restart-button" onClick={restartGame}>{buttonText}</button>  
                        <div className="status">{status}</div>  
                    </div>  
                    {showMessage && <div className="message">{showMessage}</div>}  
                </React.Fragment>  
            )}  
        </div>  
    );  
}  

// 检查胜利条件的函数  
function calculateWinner(squares) {  
    const size = 20;  
    const directions = [  
        { x: 1, y: 0 },  // 水平  
        { x: 0, y: 1 },  // 垂直  
        { x: 1, y: 1 },  // 主对角线  
        { x: 1, y: -1 }, // 副对角线  
    ];  

    for (let i = 0; i < size; i++) {  
        for (let j = 0; j < size; j++) {  
            const current = squares[i * size + j];  
            if (current) {  
                for (const { x, y } of directions) {  
                    let count = 1; // 计数当前的棋子  
                    for (let k = 1; k < 5; k++) {  
                        const ni = i + k * y;  
                        const nj = j + k * x;  
                        if (ni >= size || nj >= size || ni < 0 || nj < 0 || squares[ni * size + nj] !== current) {  
                            break;  
                        }  
                        count++;  
                    }  
                    if (count === 5) {  
                        return current; // 返回胜利者  
                    }  
                }  
            }  
        }  
    }  
    return null; // 未发现胜利者  
}