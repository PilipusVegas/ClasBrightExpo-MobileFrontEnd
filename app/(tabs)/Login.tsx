import Home from './index';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const colors = ['#00A19D', '#FFB344', '#E05D5D'];

const App = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isButtonDisabled = !username || password.trim() === '';

  const handleLogin = () => {
    const usernames = ['pjs', 'checker'];
    if (password === '1234' && username && usernames.includes(username)) {
      setIsLoggedIn(true);
    } else {
      alert('username atau password yang anda masukkan salah');
    }
  };

  const CustomSwiper = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const items = colors.map((color, index) => (
      <div key={index} style={{ margin: '0', width: '100%', height: '220px', color: '#ffffff', fontSize: '36px', background: color, userSelect: 'none', alignItems: 'center', justifyContent: 'center', display: currentIndex === index ? 'flex' : 'none' }}>
        {index + 1}
      </div>
    ));

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % colors.length);
      }, 2000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{ width: '100%', overflow: 'hidden' }}>
        {items}
      </div>
    );
  };

  if (isLoggedIn) {
    return <Home />;
  }

  return (
    <div style={{ backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <header style={{ display: 'flex', justifyContent: 'center', width: '100%', borderBottom: '2px solid #00A19D' }}>
        <CustomSwiper />
      </header>
      
      <main style={{ flex: 1, zIndex: 1, display: 'flex', padding: '20px', marginTop: '-20px', position: 'relative', alignItems: 'center', flexDirection: 'column', backgroundColor: '#fff', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '340px', border: '2px solid #00A19D', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
          <MaterialCommunityIcons name="account" size={24} color="#00A19D" style={{ marginRight: 10 }} />
          <input value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '340px', border: '2px solid #00A19D', borderRadius: '10px', padding: '10px', marginTop: '20px' }}>
          <MaterialCommunityIcons name="lock" size={24} color="#00A19D" style={{ marginRight: 10 }} />
          <input value={password} placeholder="password" type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px' }} />
          <MaterialCommunityIcons size={24} color="#00A19D" name={showPassword ? "eye-off" : "eye"} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', marginLeft: 10 }} />
        </div>

        <div style={{ width: '100%', maxWidth: '340px', marginTop: '5px', textAlign: 'right' }}>
          <a href="#" style={{ color: '#00A19D', fontSize: '14px', textDecoration: 'none' }} onClick={() => alert('reset password')}>Lupa Password?</a>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '360px' }}>
          <button onClick={handleLogin} disabled={isButtonDisabled} style={{ width: '80%', padding: '12px', color: '#ffffff', fontSize: '18px', borderRadius: '10px', border: '2px solid #00A19D', cursor: isButtonDisabled ? 'not-allowed' : 'pointer', backgroundColor: isButtonDisabled ? '#b0b0b0' : '#00A19D' }}>LOGIN</button>
          <div style={{ width: '20%', marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button style={{ width: '100%', padding: '12px', color: '#ffffff', fontSize: '18px', borderRadius: '10px', border: '2px solid #00A19D', backgroundColor: '#00A19D', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => alert('finger print')}>
              <MaterialCommunityIcons name="fingerprint" size={24} color="#ffffff" />
            </button>
          </div>
        </div>

        <p style={{ color: '#888888', fontSize: '12px' }}>SIGULPIN EXPO</p>
      </main>
    </div>
  );
};

export default App;
