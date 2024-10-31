import { JumboTabs } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetOutline, BellOutline, LeftOutline, TextOutline, RightOutline, SearchOutline, UserCircleOutline, UnorderedListOutline } from 'antd-mobile-icons';

interface POData {
  id_po: number;
  no_po: string;
  tanggal: string;
  status: number;
  jml_barang: number;
}

export default () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataList, setDataList] = useState<POData[]>([]);

  const filteredData = dataList.filter(item =>
    item.no_po.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.12.7:3001/po');
        const data: POData[] = await response.json();
        setDataList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (id: number) => {
    try {
      await fetch(`http://192.168.12.7:3001/po/pilih/${id}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCardClick = async (item: POData) => {
    if (item.status === 0) {
      await updateStatus(item.id_po);
    }
    navigate(`/podetail/${item.id_po}`, { state: { id_po: item.id_po } });
  };

  const renderContent = () => {
    if (activeKey === '1') {
      return (
        <div style={{ marginTop: '10px' }}>
          <div style={{ width: '100%', display: 'flex', position: 'relative' }}>
            <SearchOutline style={{ top: '45%', left: '10px', color: '#00A19D', fontSize: '20px', position: 'absolute', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Cari NO. PO ..." value={searchTerm.toUpperCase()} onChange={e => setSearchTerm(e.target.value.toUpperCase())} style={{ width: '100%', color: '#00A19D', borderRadius: '15px', textTransform: 'uppercase', border: '1px solid #00A19D', padding: '10px 10px 10px 40px' }} />
            <style>{`input::placeholder {color: #A0A0A0 }`}</style>
          </div>
          <div style={{ marginTop: '10px', overflowY: 'auto', maxHeight: '500px' }}>
            {filteredData.map(item => (
              <div key={item.id_po} onClick={() => handleCardClick(item)} style={{ padding: '30px', marginBottom: '10px', position: 'relative', borderRadius: '15px', backgroundColor: '#FFFFFF', border: '1px solid #00A19D' }}>
                <div style={{ top: '10px', left: '10px', color: '#00A19D', fontWeight: 'bold', position: 'absolute' }}>{item.no_po}</div>
                <div style={{ top: '10px', right: '10px', color: '#00A19D', position: 'absolute' }}>{formatDate(item.tanggal)}</div>
                <div style={{ left: '10px', bottom: '10px', color: '#00A19D', position: 'absolute' }}>Jumlah: {item.jml_barang}</div>
                <div style={{ right: '10px', bottom: '10px', padding: '2px', color: '#00A19D', position: 'absolute', borderRadius: '15px', border: '1px solid #00A19D' }}>{item.status === 0 ? 'Pick Up' : 'Lanjutkan Pick Up'} <RightOutline /></div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <div style={{ padding: '10px', color: '#00A19D' }}>Tab {activeKey} content goes here.</div>;
  };

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <div style={{ display: 'flex', padding: '15px', color: '#00A19D', fontSize: '24px', marginTop: '10px', fontWeight: 'bold', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ marginLeft: '-10px' }}>Beranda</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SetOutline style={{ fontSize: '30px', cursor: 'pointer', marginRight: '10px' }} />
          <LeftOutline style={{ fontSize: '30px', cursor: 'pointer', marginRight: '-20px' }} />
        </div>
      </div>
      <div style={{ padding: '10px', color: '#00A19D', fontSize: '16px', marginTop: '10px', borderRadius: '15px', backgroundColor: '#FFFFFF', border: '1px solid #00A19D' }}>
        <div style={{ display: 'flex', fontSize: '16px', alignItems: 'center' }}>Selamat Datang, User</div>
      </div>
      <div style={{ color: '#00A19D', marginTop: '10px', overflow: 'hidden', borderRadius: '15px', backgroundColor: '#FFFFFF', border: '1px solid #00A19D' }}>
        <JumboTabs defaultActiveKey="1" activeKey={activeKey} onChange={key => setActiveKey(key)}>
          <JumboTabs.Tab key="1" title={<UnorderedListOutline style={{ fontSize: '30px' }} />} description={<span style={{ color: activeKey === "1" ? '#FFFFFF' : '#00A19D', fontSize: '16px' }}>Beranda</span>} />
          <JumboTabs.Tab key="2" title={<TextOutline style={{ fontSize: '30px' }} />} description={<span style={{ color: activeKey === "2" ? '#FFFFFF' : '#00A19D', fontSize: '16px' }}>History</span>} />
          <JumboTabs.Tab key="3" title={<BellOutline style={{ fontSize: '30px' }} />} description={<span style={{ color: activeKey === "3" ? '#FFFFFF' : '#00A19D', fontSize: '16px' }}>Notifikasi</span>} />
          <JumboTabs.Tab key="4" title={<UserCircleOutline style={{ fontSize: '30px' }} />} description={<span style={{ color: activeKey === "4" ? '#FFFFFF' : '#00A19D', fontSize: '16px' }}>Profil</span>} />
        </JumboTabs>
      </div>
      {renderContent()}
    </div>
  );
};
