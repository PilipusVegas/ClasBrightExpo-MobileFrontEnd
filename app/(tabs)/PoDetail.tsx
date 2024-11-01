import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LeftOutline, AudioOutline, AudioMutedOutline } from 'antd-mobile-icons';
import { Space, Swiper, Stepper, Button, Image, Card, Switch, SpinLoading } from 'antd-mobile';

interface PoData {
  no_po: string;
  id_po: string;
  tanggal: string;
  detail: DetailItem[];
}

interface DetailItem {
  noLed: number;
  jmlLed: number; 
  status: number;
  jmlMinta: number;
  barang: string;
  noAlat?: string;
  detailId?: string;
  kodeBarang: string;
}

const PoDetail = () => {
  const navigate = useNavigate();
  const { id_po } = useParams();
  const swiperRef = useRef<any>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [poData, setPoData] = useState<PoData | null>(null);
  const [loadingFinish, setLoadingFinish] = useState(false);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [allItemsApproved, setallItemsApproved] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState<boolean>(false);
  const [isFirstStatusCheckDone, setIsFirstStatusCheckDone] = useState(false);

  const imagePlaceholder = 'http://gmt.globalindo-group.com/wp-content/uploads/2024/10/HICOOP_HBKL.png';

  const handleSwitchChange = (checked: boolean) => {
    setIsSoundActive(checked);
  };

  const handleQuantityChange = (value: number, index: number) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  const handleFinish = async () => {
    setLoadingFinish(true);
    if (!poData) {
      setLoadingFinish(false);
      return;
    }
    const noAlat = poData.detail[currentIndex]?.noAlat || "";
    const poId = poData.id_po;
    const dataToSend = { 
      poId: poId,
      noAlat: noAlat,
      aksi: "selesai"
    };
    console.log("Data yang dikirim:", dataToSend);
    try {
      const response = await fetch('http://192.168.12.7:3001/po/selesai', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error('Gagal mengirim data');
      }
      const result = await response.json();
      navigate('/beranda');
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    } finally {
      setLoadingFinish(false);
    }
  };

  const handleTake = async (index: number) => {
    setLoading(true);
    const itemsWithStatus0 = poData?.detail.filter((item: DetailItem) => item.status === 0);
    const detailItem = itemsWithStatus0[index];
    if (!detailItem) {
      console.error('Detail item tidak ditemukan');
      setLoading(false);
      return;
    }
    const dataToSend = {
      detailId: detailItem.detailId,
      jml: quantities[index],
    };
    console.log('Data yang dikirim:', dataToSend);
    try {
      const response = await fetch('http://192.168.12.7:3001/po/ambil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error('Gagal mengirim data');
      }
      const result = await response.json();
      await sendLedData(detailItem.noAlat, poData.id_po);
      setTimeout(async () => {
        if (index < (itemsWithStatus0.length - 1)) {
          setCurrentIndex(index + 1);
          swiperRef.current?.swipeTo(index + 1);
        } else {
          try {
            const response = await fetch(`http://192.168.12.7:3001/po/${id_po}`);
            if (response.ok) {
              const data = await response.json();
              setallItemsApproved(true);
            } else {
              console.error('Error fetching data:', response.status);
            }
          } catch (error) {
            console.error('Network error:', error);
          }
        }
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      setLoading(false);
    }
  };

  const sendLedData = async () => {
    if (!poData) return;
    const currentItem = poData.detail[currentIndex];
    if (!currentItem) return;
    const noAlat = currentItem.noAlat;
    const poId = poData.id_po;
    const noLed = currentItem.noLed;
    const jmlLed = currentItem.jmlLed;
    const warna = "red";
    const dataToSend = {
      poId: poId,
      noLed: noLed,
      warna: warna,
      noAlat: noAlat,
      jmlLed: jmlLed,
    };
    console.log("Mengirim data ke API:", dataToSend);
    try {
      const response = await fetch('http://192.168.12.7:3001/led/pick', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error('Gagal mengirim data ke LED API');
      }
      const result = await response.json();
      console.log("Response dari API LED:", result);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengirim data ke LED API:', error);
    }
  };

  useEffect(() => {
    if (poData && !isFirstStatusCheckDone) {
      const firstItemWithStatus0 = poData.detail.find(item => item.status === 0);
      if (firstItemWithStatus0) {
        setCurrentIndex(poData.detail.indexOf(firstItemWithStatus0));
        sendLedData();
        setIsFirstStatusCheckDone(true);
      }
    } else if (poData) {
      sendLedData();
    }
  }, [poData, currentIndex, isFirstStatusCheckDone]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.12.7:3001/po/${id_po}`);
        const result = await response.json();
        if (result.success) {
          const availableArticles = result.data.detail.filter((item: DetailItem) => item.status === 0);
          setPoData(result.data);
          setQuantities(availableArticles.map((item: DetailItem) => item.jmlMinta));
        } else {
          console.error('Failed to fetch data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id_po]);

  if (!poData) {
    return <div>Error: Data not found.</div>;
  }

  const itemsWithStatus0 = poData.detail.filter(item => item.status === 0);
  const isTaking = itemsWithStatus0.length > 0;

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <div style={{ display: 'flex', padding: '15px', color: '#00A19D', fontSize: '24px', marginTop: '10px', fontWeight: 'bold', alignItems: 'center' }}>
        <div style={{ display: 'flex', marginRight: '10px', alignItems: 'center' }}>
          <LeftOutline onClick={() => navigate('/beranda')} style={{ fontSize: '30px', cursor: 'pointer', marginLeft: '-20px' }} />
        </div>
        <span>Detail PO</span>
      </div>
      <Space direction='vertical' block>
        <Card style={{ marginTop: '10px', borderRadius: '15px', border: '1px solid #00A19D' }}>
          <div style={{ display: 'flex', color: '#00A19D', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>{poData.no_po}</h3>
            <p style={{ margin: 0 }}>{new Date(poData.tanggal).toLocaleDateString()}</p>
          </div>
        </Card>
        <Card style={{ borderRadius: '15px', border: '1px solid #00A19D' }}>
          <div style={{ display: 'flex', color: '#00A19D', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Warna: Merah</h3>
          </div>
          <div style={{ height: '1px', margin: '10px 0', backgroundColor: '#00A19D' }} />
          <div style={{ display: 'flex', color: '#00A19D', justifyContent: 'space-between' }}>
            <p style={{ margin: 0 }}>Lokasi: Rak A</p>
          </div>
        </Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0px' }}>
          <p style={{ fontSize: '16px', color: '#00A19D', fontWeight: 'bold', position: 'relative', borderRadius: '25px' }}>
            {isTaking ? '⦿ Sedang Diambil' : '⦿ Sudah Diambil'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isSoundActive ? (
              <AudioOutline style={{ marginRight: '10px', color: '#00A19D', width: '30px', height: '30px' }} />
            ) : (
              <AudioMutedOutline style={{ marginRight: '10px', color: '#00A19D', width: '30px', height: '30px' }} />
            )}
            <Switch checked={isSoundActive} onChange={handleSwitchChange} />
          </div>
        </div>
        {allItemsApproved == false ? (
          <Swiper ref={swiperRef} indicator={false} total={itemsWithStatus0.length} allowTouchMove={false} stuckAtBoundary={false} defaultIndex={currentIndex}>
            {itemsWithStatus0.map((item, index) => (
              <Swiper.Item key={index}>
                <div style={{ height: '100%', display: 'flex', marginTop: '100px', alignItems: 'center', justifyContent: 'center' }}>
                  <Card style={{ marginTop: '-60px', width: '60%', color: '#00A19D', minHeight: '100px', borderRadius: '20px', border: '1px solid #00A19D', background: 'linear-gradient(#FFF8E5, #00A19D)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                      <Image style={{ marginTop: '-100px' }} src={imagePlaceholder} width={350} height={350} fit="cover" />
                      <h4 style={{ marginTop: '-60px', color: '#000000', fontSize: '20px' }}>{item.kodeBarang}</h4>
                      <p style={{ marginTop: '-20px', color: '#000000', fontSize: '14px', textAlign: 'center' }}>{item.barang}</p>
                      <div style={{ width: '100%', display: 'flex', marginTop: '10px', alignItems: 'center', flexDirection: 'column' }}>
                        <Stepper min={1} value={quantities[index]} style={{ width: '100%', marginBottom: '10px' }} onChange={(value: number) => handleQuantityChange(value, index)} />
                        <Button onClick={() => handleTake(index)} style={{ width: '100%', color: '#FFFFFF', position: 'relative', borderRadius: '15px', backgroundColor: '#FFB344' }}>
                          {loading && (<SpinLoading color='white' style={{ top: '50%', left: '50%', width: '20px', height: '20px', position: 'absolute', transform: 'translate(-50%, -50%)' }} />)}
                          <span style={{ visibility: loading ? 'hidden' : 'visible' }}>Ambil</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </Swiper.Item>
            ))}
          </Swiper>
        ) : (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '2px solid #00A19D', padding: '10px', color: '#00A19D', textAlign: 'left' }}>Artikel</th>
                  <th style={{ borderBottom: '2px solid #00A19D', padding: '10px', color: '#00A19D', textAlign: 'right' }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {poData.detail.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #00A19D' }}>
                    <td style={{ padding: '5px', color: '#00A19D' }}>
                      <div>{item.kodeBarang}</div>
                      <div>{item.barang}</div>
                    </td>
                    <td style={{ color: '#00A19D', textAlign: 'right' }}>{quantities[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button color='success' onClick={handleFinish} style={{ width: '100%', color: '#FFFFFF', marginTop: '10px', borderRadius: '15px', backgroundColor: '#00A19D' }}>{loadingFinish ? 'Mengirim...' : 'Selesai'}</Button>
          </div>
        ) }
      </Space>
    </div>
  );
};

export default PoDetail;
