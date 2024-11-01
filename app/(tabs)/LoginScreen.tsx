import Home from './index';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EyeFill, EyeInvisibleFill } from 'antd-mobile-icons';
import { Swiper, Toast, Footer, Button, Input, Space } from 'antd-mobile';

const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac'];

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isButtonDisabled = username.trim() === '' || password.trim() === '';

  const handleResetPassword = () => {
    Toast.show('Tombol reset password diklik');
  };

  const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
      <div onClick={() => {Toast.show(`Anda mengklik kartu ${index + 1}`)}} style={{height: '200px', display: 'flex', color: '#ffffff', fontSize: '48px', background: color, userSelect: 'none', alignItems: 'center', justifyContent: 'center'}}>{index + 1}</div>
    </Swiper.Item>
  ));

  const handleLogin = () => {
    if (username === 'user' && password === '1234') {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return <Home />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1 }}>
        <Swiper loop autoplay>{items}</Swiper>
        <div style={{ padding: '20px', marginTop: '20px' }}>
          <label style={{ marginBottom: '5px', display: 'block', color: '#00A19D' }}>Username</label>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
            <Input value={username} onChange={setUsername} style={{ flex: 1, border: 'none', color: '#00A19D', marginLeft: '5px'}} />
          </div>
          <label style={{ marginBottom: '5px', display: 'block', color: '#00A19D' }}>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
            <Input value={password} onChange={setPassword} type={showPassword ? 'text' : 'password'} style={{ flex: 1, border: 'none', color: '#00A19D', marginLeft: '5px'}} />
            {showPassword ? (
              <EyeFill onClick={() => setShowPassword(false)} style={{ color: '#00A19D', fontSize: '24px', cursor: 'pointer', marginLeft: '8px', marginRight: '5px'}} />
            ) : (
              <EyeInvisibleFill onClick={() => setShowPassword(true)} style={{ color: '#00A19D', fontSize: '24px', cursor: 'pointer', marginLeft: '8px', marginRight: '5px'}} />
            )}
          </div>
          <Space style={{ justifyContent: 'flex-end', width: '100%', marginTop: '10px' }}>
            <span onClick={handleResetPassword} style={{ color: '#00A19D', cursor: 'pointer' }}>Lupa Password</span>
          </Space>
          <Space style={{ marginTop: '10px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Button color="primary" onClick={handleLogin} disabled={isButtonDisabled} style={{ flex: 1, fontSize: '18px', borderColor: '#00A19D', backgroundColor: isButtonDisabled ? '#b0b0b0' : '#00A19D'}}>Masuk</Button>
              <div style={{ padding: '5px', display: 'flex', marginLeft: '8px', borderRadius: '5px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00A19D' }}>
                <MaterialCommunityIcons name="fingerprint" size={24} color="#FFFFFF" />
              </div>
            </div>
          </Space>
          <Space style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}>
            <span onClick={handleResetPassword} style={{color: '#00A19D', fontSize: '16px', cursor: 'pointer', textAlign: 'center', padding: '10px 20px', display: 'inline-block'}}>Masuk menggunakan akun lain</span>
          </Space>
        </div>
      </div>
      <Footer content="@ 2004-2020 Alipay.com All rights reserved" style={{ marginTop: '20px' }} />
    </div>
  );
};

export default App;
