function Userm() {
  return (
    <div
      style={{
        width: '402px',
        height: '874px',
        position: 'relative',
        background: '#380d44',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
            width: '258px',
          height: '61px',
          position: 'absolute',
          left: '110px',
          top: '362px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '40px',
          fontWeight: 'bold',
          fontFamily: 'SF Compact Rounded, Arial, sans-serif',
          lineHeight: '18px',
          display: 'flex', gap: '8px', margin: '8px' }}>
  <button className="luckychain-btn" onClick={() => setPage('main')}>지갑연결</button>
      </div>
    </div>
  );
}

export default Userm;
