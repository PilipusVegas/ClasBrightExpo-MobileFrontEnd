import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface POData {
  no_po: string;
  sumber: string;
  tanggal: string;
  id_po: number;
  status: number;
  jml_barang: number;
}

export default () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataList, setDataList] = useState<POData[]>([]);

  const barangMasukCount = 0;
  const barangKeluarCount = dataList.filter(item => [0, 1, 2, 3].includes(item.status)).length;

  const handleLogout = () => {
    navigate('/');
  };

  const filteredData = dataList.filter(item =>
    item.no_po.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
  };

  const handleCardClick = async (item: POData) => {
    if (item.status === 0) {
      await updateStatus(item.id_po);
    }
    navigate(`/podetail/${item.id_po}`, { state: { id_po: item.id_po } });
  };

  const updateStatus = async (id: number) => {
    try {
      await fetch(`http://192.168.12.13:3001/po/pilih/${id}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.12.13:3001/po');
        const data: POData[] = await response.json();
        setDataList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (activeKey === '2') {
      return (
        <div style={{ marginTop: '-20px' }}>
          <hr style={{ border: 'none', borderTop: '2px solid #00A19D' }} />
          <div style={{ width: '100%', display: 'flex', marginTop: '10px', position: 'relative' }}>
            <MaterialCommunityIcons name="magnify" style={{ left: 10, top: '45%', fontSize: 20, color: '#00A19D', position: 'absolute', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Cari NO. PO ..." value={searchTerm.toUpperCase()} onChange={e => setSearchTerm(e.target.value.toUpperCase())} style={{ width: '100%', color: '#00A19D', borderRadius: '15px', textTransform: 'uppercase', border: '1px solid #00A19D', padding: '10px 10px 10px 40px' }} />
            <style>{`input::placeholder {color: #A0A0A0 }`}</style>
          </div>
          <div style={{ marginTop: '10px', overflowY: 'auto', maxHeight: '510px' }}>
            {filteredData.map(item => (
              <div key={item.id_po} onClick={() => handleCardClick(item)} style={{ padding: '30px', marginBottom: '10px', position: 'relative', borderRadius: '15px', backgroundColor: '#FFFFFF', border: '1px solid #00A19D' }}>
                <div style={{ top: '10px', left: '10px', color: '#00A19D', fontWeight: 'bold', position: 'absolute' }}>{item.no_po}</div>
                <div style={{ top: '10px', right: '10px', color: '#00A19D', position: 'absolute' }}>{formatDate(item.tanggal)}</div>
                <div style={{ left: '10px', bottom: '10px', color: '#00A19D', position: 'absolute' }}>{item.sumber}</div>
                <div style={{ right: '10px', bottom: '10px', padding: '2px', color: '#00A19D', position: 'absolute', borderRadius: '5px', border: '1px solid #00A19D' }}>
                  {item.status === 0 ? 'Pick Up >' : 'Lanjutkan >'}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <div style={{ padding: '10px', color: '#00A19D' }}>Tab {activeKey} content goes here.</div>;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', backgroundColor: '#F5F5F5' }}>
      <div style={{ display: 'flex', padding: '25px', alignItems: 'center', backgroundColor: '#00A19D', justifyContent: 'space-between' }}>
        <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 'bold', margin: '-10px 0 0 -10px' }}>Beranda</span>
        <MaterialCommunityIcons name="logout" size={24} color="#FFFFFF" onClick={handleLogout} style={{ marginTop: -10, marginRight: -10, cursor: 'pointer' }} />
      </div>
      <main style={{ padding: '10px', marginTop: '-15px', position: 'relative', alignItems: 'center', flexDirection: 'column', backgroundColor: '#fff', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
        <div style={{ display: 'flex', color: '#00A19D', fontSize: '16px', alignItems: 'center', margin: '10px 0 0 10px' }}>
          <div style={{ marginRight: '10px' }}>HALO,</div>
          <div style={{ fontWeight: 'bold' }}>PILIPUS VEGAS.</div>
        </div>
        <hr style={{ borderTop: '2px solid #00A19D' }} />
        <div style={{ color: '#00A19D', marginTop: '10px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', padding: '10px', cursor: 'pointer', justifyContent: 'space-around' }}>
            <div onClick={() => setActiveKey('1')} style={{ flex: 1, padding: '10px', marginTop:'-10px', textAlign: 'center', position: 'relative' }}>
              <MaterialCommunityIcons name="package" style={{ fontSize: 30, color: activeKey === '1' ? '#00A19D' : '#F5F5F5' }} />
              <div style={{ fontSize: '16px', color: activeKey === '1' ? '#00A19D' : '#A0A0A0' }}>Barang Masuk</div>
              {barangMasukCount > 0 && (
                <span style={{ top: 0, right: '35%', color: 'white', fontSize: '12px', padding: '2px 6px', borderRadius: '50%', position: 'absolute', backgroundColor: 'red' }}>{barangMasukCount}</span>
              )}
            </div>
            <div onClick={() => setActiveKey('2')} style={{ flex: 1, padding: '10px', marginTop:'-10px', textAlign: 'center', position: 'relative' }}>
              <MaterialCommunityIcons name="package-up" style={{ fontSize: 30, color: activeKey === '2' ? '#00A19D' : '#F5F5F5' }} />
              <div style={{ fontSize: '16px', color: activeKey === '2' ? '#00A19D' : '#A0A0A0' }}>Barang Keluar</div>
              {barangKeluarCount > 0 && (
                <span style={{ top: 0, right: '35%', color: 'white', fontSize: '12px', padding: '2px 6px', borderRadius: '50%', position: 'absolute', backgroundColor: 'red' }}>{barangKeluarCount}</span>
              )}
            </div>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
