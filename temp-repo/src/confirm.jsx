
import React from 'react';
import MobileHeader from './components/MobileHeader';

function Confirm({ onNavigate }) {
    return (
        <div style={{width: 402, height: 874, position: 'relative', background: '#380D44', overflow: 'hidden'}}>
  {/* 헤더 컴포넌트 사용 */}
  <MobileHeader />
  <div style={{width: 362, height: 653, left: 20, top: 110, position: 'absolute', background: 'linear-gradient(136deg, #450058 0%, #6E0058 100%)', borderRadius: 10, border: '1px #F8F8F8 solid'}} />
  <div style={{width: 305, height: 268, left: 48, top: 348, position: 'absolute', background: 'rgba(178.13, 166.86, 181.23, 0.40)', borderRadius: 10}} />
  {/* 취소 버튼 */}
  <div 
    style={{
      width: 135, 
      height: 50, 
      left: 48, 
      top: 655, 
      position: 'absolute', 
      background: 'rgba(178.13, 166.86, 181.23, 0.40)', 
      borderRadius: 10, 
      border: '0.50px white solid',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    onClick={() => onNavigate('choosep')}
  >
    <div style={{
      textAlign: 'center', 
      color: 'white', 
      fontSize: 18, 
      fontFamily: 'SF Pro', 
      fontWeight: '590', 
      letterSpacing: 1.80
    }}>취소</div>
  </div>
  
  {/* 구매 확정 버튼 */}
  <div 
    style={{
      width: 135, 
      height: 50, 
      left: 218, 
      top: 655, 
      position: 'absolute', 
      background: 'rgba(134, 216, 4, 0.85)', 
      borderRadius: 10, 
      border: '0.50px white solid',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    onClick={() => onNavigate('confirm2')}
  >
    <div style={{
      textAlign: 'center', 
      color: 'white', 
      fontSize: 18, 
      fontFamily: 'SF Pro', 
      fontWeight: '590', 
      letterSpacing: 1.80
    }}>구매 확정</div>
  </div>
  <div style={{left: 66, top: 486, position: 'absolute', color: '#DDBBFF', fontSize: 15, fontFamily: 'SF Pro', fontWeight: '510', letterSpacing: 1.50, wordWrap: 'break-word'}}>방식</div>
  <div style={{left: 66, top: 550, position: 'absolute', color: '#FFC400', fontSize: 15, fontFamily: 'SF Pro', fontWeight: '510', letterSpacing: 1.50, wordWrap: 'break-word'}}>총액</div>
  <div style={{left: 301, top: 487, position: 'absolute', textAlign: 'right', color: 'white', fontSize: 15, fontFamily: 'SF Pro', fontWeight: '400', letterSpacing: 1.50, wordWrap: 'break-word'}}>수동</div>
  <div style={{left: 234, top: 550, position: 'absolute', textAlign: 'right', color: 'white', fontSize: 15, fontFamily: 'SF Pro', fontWeight: '400', letterSpacing: 1.50, wordWrap: 'break-word'}}>0.0010 BTC</div>
  <div style={{left: 279, top: 576, position: 'absolute', textAlign: 'right', color: '#E8B4F8', fontSize: 11, fontFamily: 'SF Pro', fontWeight: '400', letterSpacing: 1.10, wordWrap: 'break-word'}}>$ 112.64</div>
  <div style={{width: 119, height: 35, left: 141, top: 251, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 20, fontFamily: 'SF Pro', fontWeight: '700', wordWrap: 'break-word'}}>구매 확인</div>
  <div style={{width: 284, height: 35, left: 58, top: 292, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#E6E6E6', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>정말 구매하시겠습니까?</div>
  <div style={{left: 66, top: 404, position: 'absolute', color: '#DDBBFF', fontSize: 15, fontFamily: 'SF Pro', fontWeight: '510', letterSpacing: 1.50, wordWrap: 'break-word'}}>코인</div>
  <div style={{left: 284, top: 405, position: 'absolute', textAlign: 'right', color: 'white', fontSize: 15, fontFamily: 'SF Pro', fontWeight: '400', letterSpacing: 1.50, wordWrap: 'break-word'}}>USDC</div>
  <div style={{left: 66, top: 447, position: 'absolute', color: '#DDBBFF', fontSize: 15, fontFamily: 'SF Pro', fontWeight: '510', letterSpacing: 1.50, wordWrap: 'break-word'}}>수량</div>
  <div style={{left: 308, top: 448, position: 'absolute', textAlign: 'right', color: 'white', fontSize: 15, fontFamily: 'SF Pro', fontWeight: '400', letterSpacing: 1.50, wordWrap: 'break-word'}}>1장</div>
  <div style={{width: 265, height: 0, left: 66, top: 536, position: 'absolute', outline: '0.50px rgba(255, 255, 255, 0.53) solid', outlineOffset: '-0.25px'}}></div>
  <div style={{width: 71, height: 71, left: 165, top: 159, position: 'absolute', overflow: 'hidden'}}>
    <div data-svg-wrapper style={{left: 0, top: 0, position: 'absolute'}}>
      <svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35.5 71C55.1061 71 71 55.1061 71 35.5C71 15.8939 55.1061 0 35.5 0C15.8939 0 0 15.8939 0 35.5C0 55.1061 15.8939 71 35.5 71Z" fill="#2775C9"/>
      </svg>
    </div>
    <div data-svg-wrapper style={{left: 8.88, top: 8.88, position: 'absolute'}}>
      <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.5 54.125C12.7939 54.125 0.875 42.2061 0.875 27.5C0.875 12.7939 12.7939 0.875 27.5 0.875C42.2061 0.875 54.125 12.7939 54.125 27.5C54.125 34.5614 51.3199 41.3336 46.3267 46.3267C41.3336 51.3199 34.5614 54.125 27.5 54.125ZM25.9138 17.6204C24.4571 17.6927 23.0799 18.3069 22.0528 19.3424C21.0256 20.3779 20.4226 21.76 20.3622 23.2173C20.3622 25.9591 22.039 27.7493 25.5966 28.497L28.0891 29.0862C30.5137 29.6527 31.5107 30.4684 31.5107 31.8506C31.5107 33.2329 29.766 34.5924 27.5 34.5924C26.6951 34.6662 25.8857 34.512 25.1644 34.1473C24.4431 33.7827 23.839 33.2223 23.4213 32.5304C23.2975 32.2679 23.1021 32.0457 22.8576 31.8893C22.613 31.733 22.3293 31.6489 22.039 31.6467H20.7021C20.5993 31.6657 20.5013 31.7049 20.4137 31.762C20.3261 31.8191 20.2506 31.8929 20.1916 31.9792C20.1327 32.0656 20.0914 32.1627 20.0701 32.2651C20.0488 32.3675 20.048 32.4731 20.0677 32.5757C20.3933 33.9049 21.1505 35.0885 22.2206 35.9413C23.2908 36.7942 24.6135 37.2681 25.9818 37.2889V39.1923C25.9818 39.616 26.1501 40.0224 26.4497 40.3219C26.7493 40.6215 27.1556 40.7898 27.5793 40.7898C28.003 40.7898 28.4093 40.6215 28.7089 40.3219C29.0085 40.0224 29.1768 39.616 29.1768 39.1923V37.2663C30.724 37.2487 32.2032 36.6279 33.2993 35.5359C34.3955 34.444 35.0221 32.9672 35.0456 31.4201C35.0456 28.5423 33.3915 26.8882 29.4714 26.0498L27.2054 25.5513C24.9395 24.9848 23.8745 24.237 23.8745 22.9681C23.8745 21.6991 25.234 20.2943 27.5 20.2943C28.2136 20.2197 28.9336 20.3534 29.5729 20.6791C30.2122 21.0048 30.7436 21.5086 31.1029 22.1297C31.2485 22.4399 31.4791 22.7024 31.7678 22.8869C32.0566 23.0714 32.3917 23.1702 32.7344 23.172H33.7994C34.0415 23.1128 34.2507 22.9609 34.3821 22.7491C34.5134 22.5372 34.5564 22.2823 34.5018 22.039C34.1948 20.8119 33.5081 19.713 32.5397 18.8992C31.5712 18.0854 30.3705 17.5982 29.1088 17.5071V15.9436C29.1088 15.5199 28.9405 15.1136 28.6409 14.814C28.3413 14.5144 27.935 14.3461 27.5113 14.3461C27.0876 14.3461 26.6813 14.5144 26.3817 14.814C26.0821 15.1136 25.9138 15.5199 25.9138 15.9436V17.6204ZM7.53691 27.5C7.53951 31.674 8.85337 35.7418 11.2929 39.1287C13.7325 42.5156 17.1744 45.0506 21.1327 46.3754H21.4499C21.7203 46.3754 21.9797 46.268 22.1709 46.0768C22.3621 45.8855 22.4696 45.6262 22.4696 45.3557V44.8799C22.4703 44.4581 22.3458 44.0456 22.1118 43.6946C21.8779 43.3436 21.545 43.07 21.1553 42.9085C18.0727 41.6643 15.4323 39.5272 13.5729 36.7716C11.7136 34.016 10.7202 30.7676 10.7202 27.4434C10.7202 24.1191 11.7136 20.8707 13.5729 18.1151C15.4323 15.3595 18.0727 13.2224 21.1553 11.9782C21.5432 11.8206 21.8753 11.5512 22.1094 11.2041C22.3434 10.857 22.4688 10.4481 22.4696 10.0295V9.5083C22.471 9.35528 22.4356 9.20416 22.3662 9.06775C22.2968 8.93135 22.1956 8.81369 22.0711 8.72474C21.9466 8.63579 21.8024 8.57819 21.6509 8.55681C21.4994 8.53542 21.3449 8.5509 21.2006 8.60191C17.2261 9.91638 13.7667 12.4497 11.3139 15.8422C8.86107 19.2347 7.53951 23.3137 7.53691 27.5ZM47.4631 27.5C47.4557 23.3298 46.1397 19.2671 43.7005 15.8847C41.2612 12.5023 37.8219 9.97087 33.8673 8.64723H33.5274C33.245 8.64723 32.9741 8.75944 32.7744 8.95916C32.5746 9.15889 32.4624 9.42978 32.4624 9.71223V10.0521C32.4716 10.4892 32.6069 10.9142 32.8522 11.2761C33.0974 11.6379 33.4421 11.9211 33.8447 12.0915C36.9202 13.3394 39.5535 15.4766 41.4075 18.2296C43.2615 20.9826 44.2519 24.2262 44.2519 27.5453C44.2519 30.8644 43.2615 34.108 41.4075 36.861C39.5535 39.614 36.9202 41.7513 33.8447 42.9991C33.4498 43.1713 33.1122 43.4524 32.8714 43.8096C32.6306 44.1668 32.4966 44.5852 32.4851 45.0159V45.4011C32.487 45.569 32.5287 45.7342 32.6066 45.883C32.6846 46.0318 32.7967 46.1601 32.9337 46.2573C33.0707 46.3545 33.2287 46.418 33.3949 46.4424C33.5611 46.4669 33.7308 46.4517 33.89 46.3981C37.8476 45.0681 41.2873 42.5281 43.7229 39.137C46.1585 35.7459 47.4668 31.6751 47.4631 27.5Z" fill="white"/>
      </svg>
    </div>
  </div>
</div>
    )
}

export default Confirm;