import React, { useState } from 'react';
import MobileHeader from './components/MobileHeader';

function Choose({ onNavigate }) {
  
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const maxSelections = 6; 

  const handleNumberClick = (number) => {
      if (selectedNumbers.includes(number)) {
          setSelectedNumbers(selectedNumbers.filter(n => n !== number));
      } else if (selectedNumbers.length < maxSelections) {
          setSelectedNumbers([...selectedNumbers, number]);
      }
}
  const isSelected = (number) => selectedNumbers.includes(number)
// ← 여기까지
const NumberButton = ({ number, isSelected, onClick }) => ( 
<button
onClick={() => onClick(number)}
style={{
  width: 40,
  height: 40,
  margin: 5,
  borderRadius: '50%',
  backgroundColor: isSelected ? '#6E0058' : 'white',
  color: isSelected ? 'white' : 'black',
  border: isSelected ? '3px solid #B084B5' : '1px solid #ccc',
  fontSize: 12,
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s'
}}
>
{number}
</button>
)
    
const renderNumberGrid = () => {
const numbers = Array.from({length: 45}, (_, i) => i + 1);
  
  return (
    <div style ={{top:'120px', left: '3px', position: 'relative'}}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)', // 7열
      gap: '3px',
      padding: '20px',
      maxWidth: '400px'
    }}>
      {numbers.map(number => (
        <NumberButton
          key={number}
          number={number}
          isSelected={isSelected(number)}
          onClick={handleNumberClick}
        />
      ))}
    </div>
    </div>
  );
}
const SelectedNumbers = () => (
  <div style={{ top: '100px', left:'0px', padding: '20px', textAlign: 'center', color: '#fff', position: 'relative'}}>
    <h3>선택된 번호 </h3>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {selectedNumbers.sort((a, b) => a - b).map(number => (
        <div key={number} style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#6E0058',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600'
        }}>
          {number}
        </div>
      ))}
    </div>
  </div>
)

  return (
    <div>
        <div className="page-container">
      <div className="page-content">
          <div className="page-container">
      <div className="page-scroll">
        <div style={{
    width: 402,
    height: 874,
    position: 'relative',
    background: '#380D44',
    overflow: 'hidden'
  }}>
    {/* 헤더 컴포넌트 사용 */}
    <MobileHeader />
    
    {/* 페이지 제목 */}
    <div style={{ 
      position: 'absolute',
      top: 40,
      left: 20,
      right: 0,
      textAlign: 'center',
      color: '#fff',
      fontSize: 16,
      fontWeight: '600'
    }}>복권 번호 선택</div>
        
        {/* 선택된 숫자 표시 */}
        <SelectedNumbers />
   {/* 숫자 그리드 */}
        {renderNumberGrid()}
        
        {/* 확정 버튼 */}
        <div style={{
  width: 135, 
  height: 50, 
  left: 30, 
  top: 700, 
  position: 'absolute', 
  background: 'rgba(178.13, 166.86, 181.23, 0.40)', 
  borderRadius: 10, 
  border: '0.50px white solid', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems:'center', 
  justifyContent:'center', 
  fontSize: 16, 
  fontWeight:'600',
  color: '#fff'  // 색상 추가
}}
onClick={() => {
  console.log('버튼 클릭됨! 선택된 번호 개수:', selectedNumbers.length, '최대 선택 수:', maxSelections);
  if (selectedNumbers.length === maxSelections) {
    console.log('조건 만족! 선택된 번호:', selectedNumbers);
    console.log('onNavigate 함수 호출 시도...');
    onNavigate('confirm2');
  } else {
    console.log('조건 불만족: 6개 번호를 먼저 선택해주세요');
  }
}}
>
번호 확정  {/* 내부 div 완전 제거 */}
</div>
        </div>
  </div>
  </div>
  </div></div>
  </div>
)
}
export default Choose;