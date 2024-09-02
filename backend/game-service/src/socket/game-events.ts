import { Server, Socket } from 'socket.io';
// get data from QuizData.json
import data from "./QuizData.json";

let isGameActive = false;

interface TimeFrame {
  start: Date;
  end: Date;
}

export const gameEvents = (io: Server, socket: Socket) => {
    console.log('Socket connected:', socket.id);

    // Gửi trạng thái trò chơi hiện tại khi người chơi kết nối
    socket.emit('gameStatus', { isGameActive });

    // Lắng nghe sự kiện bắt đầu trò chơi từ admin
    socket.on('startGame', (timeFrame: TimeFrame) => {
        isGameActive = true;

        // Thông báo tới tất cả người chơi rằng trò chơi đã bắt đầu
        io.emit('gameStarted', { isGameActive, data });
        console.log(`Game started.`);
    });

    // Lắng nghe sự kiện kết thúc trò chơi
    socket.on('endGame', () => {
        isGameActive = false;

        // Thông báo tới tất cả người chơi rằng trò chơi đã kết thúc
        io.emit('gameEnded');
        console.log('Game ended by admin.');
    });

    // Lắng nghe sự kiện từ người chơi gửi câu trả lời
    socket.on('submitAnswer', (data: { playerId: string; answer: string }) => {
        console.log(`Player ${data.playerId} submitted answer: ${data.answer}`);

        // Phát câu trả lời của người chơi đến admin hoặc xử lý logic kiểm tra câu trả lời
        io.emit('answerReceived', { playerId: data.playerId, answer: data.answer });
    });

    // Lắng nghe sự kiện chat giữa các người chơi trong trò chơi
    socket.on('chatMessage', (msg: { playerId: string; message: string }) => {
        console.log(`Player ${msg.playerId} sent message: ${msg.message}`);

        // Phát tin nhắn chat tới tất cả người chơi trong trò chơi
        io.emit('chatMessage', { playerId: msg.playerId, message: msg.message });
    });

    // Xử lý sự kiện khi người chơi rời khỏi trò chơi
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
};
