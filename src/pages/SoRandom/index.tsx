import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, message, Typography, Row, Col, Progress, Divider } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Title, Text } = Typography;

const GuessingGame: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [guessCount, setGuessCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [guessHistory, setGuessHistory] = useState<Array<{guess: number, result: string}>>([]);
  const MAX_GUESSES = 10;

  const historyContainerRef = useRef<HTMLDivElement>(null);

  const initializeGame = () => {
    const newRandomNumber = Math.floor(Math.random() * 100) + 1;
    setRandomNumber(newRandomNumber);
    setUserGuess('');
    setGuessCount(0);
    setFeedback('Hãy nhập số từ 1 đến 100');
    setGameOver(false);
    setGameWon(false);
    setGuessHistory([]);
    console.log('Số ngẫu nhiên mới:', newRandomNumber);
  };

  // Khởi tạo trò chơi khi component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Xử lý khi người dùng thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số
    if (value === '' || /^[0-9]+$/.test(value)) {
      setUserGuess(value);
    }
  };

  // Xử lý khi người dùng gửi đoán
  const handleGuess = () => {
    // Kiểm tra nếu input rỗng
    if (userGuess.trim() === '') {
      message.warning('Vui lòng nhập một số!');
      return;
    }

    const guess = parseInt(userGuess);
    
    // Kiểm tra phạm vi hợp lệ
    if (guess < 1 || guess > 100) {
      message.error('Vui lòng nhập số từ 1 đến 100!');
      return;
    }

    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);
    
    let result = '';
    // Kiểm tra kết quả đoán
    if (guess < randomNumber) {
      result = 'Bạn đoán quá thấp!';
      setFeedback(result);
    } else if (guess > randomNumber) {
      result = 'Bạn đoán quá cao!';
      setFeedback(result);
    } else {
      result = 'Chúc mừng! Bạn đã đoán đúng! Số cần tìm là: '+ randomNumber;
      setFeedback(result);
      setGameWon(true);
      setGameOver(true);
      message.success('Bạn đã chiến thắng!');
    }

    // Cập nhật lịch sử đoán
    setGuessHistory([...guessHistory, { guess, result }]);
    setUserGuess('');

    // Kiểm tra nếu đã hết lượt
    if (newGuessCount >= MAX_GUESSES && !gameWon) {
      setFeedback(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
      setGameOver(true);
      message.error(`Trò chơi kết thúc! Số đúng là ${randomNumber}.`);
    }
  };

  // Bắt đầu trò chơi mới
  const handleRestart = () => {
    initializeGame();
    message.info('Trò chơi mới đã bắt đầu!');
  };

  // Bắt sự kiện phím Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameOver) {
      handleGuess();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card 
        title={<Title level={2} style={{ textAlign: 'center' }}>Trò Chơi Đoán Số</Title>}
        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <Row gutter={[16, 16]} justify="center">
          <Col span={24}>
            <Progress 
              percent={guessCount * 10} 
              status={gameWon ? "success" : guessCount >= MAX_GUESSES ? "exception" : "active"}
              format={() => `${guessCount}/${MAX_GUESSES} lượt`}
            />
          </Col>

          <Col span={24}>
            <Card type="inner" style={{ backgroundColor: '#f5f5f5', textAlign: 'center' }}>
              <Title level={4} style={{ color: gameWon ? '#52c41a' : gameOver ? '#f5222d' : '#1890ff' }}>
                {feedback}
              </Title>
            </Card>
          </Col>

          <Col span={18}>
            <Input 
              placeholder="Nhập số đoán của bạn"
              value={userGuess}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={gameOver}
              size="large"
              type="number"
              min={1}
              max={100}
            />
          </Col>
          <Col span={6}>
            <Button 
              type="primary" 
              onClick={handleGuess} 
              disabled={gameOver} 
              block
              size="large"
            >
              Đoán
            </Button>
          </Col>

          <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button 
              type="default" 
              icon={<ReloadOutlined />} 
              onClick={handleRestart}
              size="large"
            >
              Chơi Lại
            </Button>
          </Col>
        </Row>

        {guessHistory.length > 0 && (
          <>
            <Divider>Lịch sử đoán</Divider>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {guessHistory.map((entry, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: '8px', 
                    margin: '5px 0', 
                    backgroundColor: entry.result.includes('Chúc mừng') ? '#f6ffed' : entry.result.includes('thấp') ? '#e6f7ff' : '#fff2e8',
                    borderLeft: entry.result.includes('Chúc mừng') ? '4px solid #52c41a' : entry.result.includes('thấp') ? '4px solid #1890ff' : '4px solid #fa8c16',
                    borderRadius: '4px'
                  }}
                >
                  <Text strong>Lần {index + 1}: </Text>
                  <Text>Đoán {entry.guess} - </Text>
                  <Text type={entry.result.includes('Chúc mừng') ? 'success' : 'secondary'}>
                    {entry.result}
                  </Text>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default GuessingGame;