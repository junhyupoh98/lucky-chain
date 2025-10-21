import React from 'react';

function TestPage({ onNavigate }) {
  console.log('🔴 TestPage 렌더링됨!');
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'red',
      color: 'white',
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>테스트 페이지</h1>
        <button 
          onClick={() => alert('버튼 작동!')}
          style={{
            padding: '20px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          테스트 버튼
        </button>
        <br />
        <button 
          onClick={() => {
            console.log('홈 버튼 클릭');
            if (onNavigate) {
              onNavigate('mainp');
            } else {
              alert('onNavigate 없음');
            }
          }}
          style={{
            padding: '20px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
}

export default TestPage;