import { useNavigate } from 'react-router-dom';
import { LeftOutline } from 'antd-mobile-icons';
import { useState, useRef, useEffect } from 'react';
import { Space, Swiper, Stepper, Button, Image, Card } from 'antd-mobile';

const DATA_COUNT = 5;
const images = [
  'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60',
  'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
  'https://images.unsplash.com/photo-1603415526960-f67f7f094b61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60',
  'https://images.unsplash.com/photo-1603415526960-f67f7f094b61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60',
  'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60',
];

const articles = [
  { name: 'Artikel A', code: 'ART-001', description: 'Deskripsi untuk Artikel A', color: 'Merah', quantity: 10, location: 'Gudang A', date: '2024-01-01' },
  { name: 'Artikel B', code: 'ART-002', description: 'Deskripsi untuk Artikel B', color: 'Biru', quantity: 5, location: 'Gudang B', date: '2024-01-02' },
  { name: 'Artikel C', code: 'ART-003', description: 'Deskripsi untuk Artikel C', color: 'Hijau', quantity: 8, location: 'Gudang C', date: '2024-01-03' },
  { name: 'Artikel D', code: 'ART-004', description: 'Deskripsi untuk Artikel D', color: 'Kuning', quantity: 12, location: 'Gudang D', date: '2024-01-04' },
  { name: 'Artikel E', code: 'ART-005', description: 'Deskripsi untuk Artikel E', color: 'Ungu', quantity: 7, location: 'Gudang E', date: '2024-01-05' },
  { name: 'Artikel F', code: 'ART-006', description: 'Deskripsi untuk Artikel F', color: 'Merah', quantity: 15, location: 'Gudang A', date: '2024-01-06' },
  { name: 'Artikel G', code: 'ART-007', description: 'Deskripsi untuk Artikel G', color: 'Biru', quantity: 20, location: 'Gudang B', date: '2024-01-07' },
  { name: 'Artikel H', code: 'ART-008', description: 'Deskripsi untuk Artikel H', color: 'Hijau', quantity: 3, location: 'Gudang C', date: '2024-01-08' },
  { name: 'Artikel I', code: 'ART-009', description: 'Deskripsi untuk Artikel I', color: 'Kuning', quantity: 25, location: 'Gudang D', date: '2024-01-09' },
  { name: 'Artikel J', code: 'ART-010', description: 'Deskripsi untuk Artikel J', color: 'Ungu', quantity: 18, location: 'Gudang E', date: '2024-01-10' }
];

const PoDetail: React.FC = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);

  const [date, setDate] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [poNumber, setPoNumber] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<number[]>(articles.map(article => article.quantity));

  const handleFinish = () => {
  };

  const handleQuantityChange = (value: number, index: number) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  const handleTake = (index: number) => {
    if (index < DATA_COUNT - 1) {
      setCurrentIndex(index + 1);
      swiperRef.current?.swipeTo(index + 1);
    } else {
      setIsCompleted(true);
    }
  };

  useEffect(() => {
    setDate(articles[currentIndex].date)
    setColor(articles[currentIndex].color);
    setLocation(articles[currentIndex].location);
    setPoNumber(articles[currentIndex].code);
  }, [currentIndex]);

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <div style={{ display: 'flex', padding: '15px', color: '#00A19D', fontSize: '24px', marginTop: '10px', fontWeight: 'bold', alignItems: 'center' }}>
        <div style={{ display: 'flex', marginRight: '10px', alignItems: 'center' }}>
          <LeftOutline onClick={() => navigate('/beranda')} style={{ fontSize: '30px', cursor: 'pointer', marginLeft: '-20px' }} />
        </div>
        <span>Detail PO</span>
      </div>
      <Space direction='vertical' block>
        <Card style={{ 
          marginTop: '10px', borderRadius: '15px', border: '1px solid #00A19D' }}>
          <div style={{ display: 'flex', color: '#00A19D', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>{poNumber}</h3>
            <p style={{ margin: 0 }}>{date}</p>
          </div>
        </Card>
        <Card style={{ borderRadius: '15px', border: '1px solid #00A19D' }}>
          <div style={{ display: 'flex', color: '#00A19D', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Warna: {color}</h3>
          </div>
          <div style={{ height: '1px', margin: '10px 0', backgroundColor: '#00A19D' }} />
          <div style={{ display: 'flex', color: '#00A19D', justifyContent: 'space-between' }}>
            <p style={{ margin: 0 }}>Lokasi: {location}</p>
          </div>
        </Card>
        {!isCompleted ? (

          <Swiper ref={swiperRef} indicator={false} total={DATA_COUNT} allowTouchMove={false} stuckAtBoundary={false} defaultIndex={currentIndex}>
            {index => ( 
              <Swiper.Item key={index}>
                <Card style={{ padding: '10px', color: '#00A19D', borderRadius: '15px', border: '1px solid #00A19D',  }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                    <Image style={{ marginTop: '-10px' }} src={images[index % images.length]} width={250} height={250} fit="cover" />
                    <h4 style={{ margin: '0', color: '#00A19D' }}>{articles[index].name}</h4>
                    <p style={{ margin: '0', color: '#00A19D' }}>{articles[index].code}</p>
                    <div style={{ width: '100%', display: 'flex', marginTop: '10px', alignItems: 'center', flexDirection: 'column' }}>
                      <Stepper min={1} value={quantities[index]} style={{ width: '100%', marginBottom: '10px' }} onChange={(value) => handleQuantityChange(value, index)} />
                      <Button onClick={() => handleTake(index)} style={{ width: '100%', color: '#FFFFFF', borderRadius: '15px', backgroundColor: '#00A19D' }}>Ambil</Button>
                    </div>
                  </div>
                </Card>
              </Swiper.Item>
            )}
          </Swiper>
          
        ) : (
          <div>
            <div style={{ gap: '10px', display: 'flex', overflowY: 'auto', maxHeight: '500px', flexDirection: 'column' }}>
              {quantities.map((quantity, index) => (
                <div key={index} style={{ display: 'flex', padding: '10px', alignItems: 'center', borderRadius: '15px', border: '1px solid #00A19D', justifyContent: 'space-between' }}>
                  <div style={{ color: '#00A19D' }}>
                    <div style={{ fontWeight: 'bold' }}>{articles[index].name}</div>
                    <div>{articles[index].code}</div>
                  </div>
                  <div style={{ color: '#00A19D' }}>{quantity}</div>
                </div>
              ))} 
            </div>
            <Button color='success' onClick={handleFinish} style={{ width: '100%', color: '#FFFFFF', marginTop: '10px', borderRadius: '15px', backgroundColor: '#00A19D' }}>Selesai</Button>
          </div>
        )}
      </Space>
    </div>
  );
};

export default PoDetail;
