

function Adminm() {
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
          fontSize: '100px',
          fontWeight: 'bold',
          fontFamily: 'SF Compact Rounded, Arial, sans-serif',
          lineHeight: '18px',
          display: 'flex', gap: '21px', margin: '21px' }}>
  <button className="luckychain-btn" onClick={() => setPage('main')}>추첨하기</button>

      </div>
    </div>
  );
}

export default Adminm;
