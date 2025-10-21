import { UsdtIcon } from './components/coinIcon.jsx'

function Rando({ onNavigate }) {
  // 랜덤 코인 선택

  const generateRandomNumbers = () => {
    const numbers = [];
    while (numbers.length < 7) {
      const randomNum = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    return numbers.sort((a, b) => a - b);
  };
  const randomNumbers = generateRandomNumbers();
  return <div style={{
    width: 402,
    height: 874,
    position: 'relative',
    background: '#380D44',
    overflow: 'hidden'
  }}>
  <div style={{
      width: 402,
      left: 0,
      top: 0,
      position: 'absolute',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      display: 'inline-flex'
    }}>
    <div style={{
        alignSelf: 'stretch',
        height: 60,
        background: '#380D44'
      }} />
  </div>
  <div data-svg-wrapper style={{
      left: 351.33,
      top: 14,
      position: 'absolute'
    }}>
    <svg width="23" height="12" viewBox="0 0 23 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.35" x="0.833984" y="0.5" width="21" height="10.3333" rx="2.16667" fill="white" stroke="#333333" />
    </svg>
  </div>
  <div data-svg-wrapper style={{
      left: 374.33,
      top: 17.67,
      position: 'absolute'
    }}>
    <svg width="2" height="5" viewBox="0 0 2 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.4" d="M0.333984 0.666748V4.66675C1.13872 4.32797 1.66202 3.53988 1.66202 2.66675C1.66202 1.79361 1.13872 1.00552 0.333984 0.666748Z" fill="white" />
    </svg>
  </div>
  <div data-svg-wrapper style={{
      left: 353.33,
      top: 16,
      position: 'absolute'
    }}>
    <svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.333984" width="18" height="7.33333" rx="1.33333" fill="white" />
    </svg>
  </div>
  <div data-svg-wrapper style={{
      left: 331,
      top: 14,
      position: 'absolute'
    }}>
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.44824 8.42676C6.7289 7.34449 8.60508 7.34449 9.88574 8.42676C9.95009 8.48497 9.98748 8.56758 9.98926 8.6543C9.99092 8.74093 9.95644 8.82406 9.89453 8.88477L7.88965 10.9072C7.83087 10.9666 7.7506 11 7.66699 11C7.5834 11 7.5031 10.9666 7.44434 10.9072L5.43848 8.88477C5.37688 8.82407 5.34303 8.74072 5.34473 8.6543C5.34656 8.56762 5.3839 8.48492 5.44824 8.42676ZM2.77246 5.72949C5.53159 3.16511 9.80431 3.16517 12.5635 5.72949C12.6258 5.78963 12.6612 5.87245 12.6621 5.95898C12.6629 6.04533 12.6293 6.12818 12.5684 6.18945L11.4092 7.36035C11.2897 7.47965 11.0971 7.48151 10.9746 7.36523C10.0685 6.54547 8.88933 6.09172 7.66699 6.0918C6.4456 6.09232 5.26772 6.54616 4.3623 7.36523C4.23975 7.48158 4.04622 7.47986 3.92676 7.36035L2.76855 6.18945C2.70747 6.12825 2.67312 6.0454 2.67383 5.95898C2.67465 5.87251 2.71026 5.78961 2.77246 5.72949ZM0.0966797 3.03906C4.32849 -1.01301 11.0044 -1.01285 15.2363 3.03906C15.2976 3.09926 15.3325 3.18173 15.333 3.26758C15.3334 3.35334 15.2997 3.43622 15.2393 3.49707L14.0791 4.66699C13.9595 4.78709 13.765 4.78817 13.6436 4.66992C12.0312 3.13852 9.89158 2.28428 7.66699 2.28418C5.4421 2.28419 3.30199 3.13829 1.68945 4.66992C1.56817 4.78829 1.3744 4.7871 1.25488 4.66699L0.09375 3.49707C0.0333193 3.43619 -0.000480886 3.35331 0 3.26758C0.000565275 3.18173 0.0353775 3.09922 0.0966797 3.03906Z" fill="white" />
    </svg>
  </div>
  <div data-svg-wrapper style={{
      left: 309,
      top: 14,
      position: 'absolute'
    }}>
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175969 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.66699 4.66699C7.21913 4.66717 7.66699 5.11482 7.66699 5.66699V9.66699C7.66682 10.219 7.21902 10.6668 6.66699 10.667H5.66699C5.11482 10.667 4.66717 10.2191 4.66699 9.66699V5.66699C4.66699 5.11471 5.11471 4.66699 5.66699 4.66699H6.66699ZM11.333 2.33301C11.8852 2.33301 12.3328 2.78087 12.333 3.33301V9.66699C12.3328 10.2191 11.8852 10.667 11.333 10.667H10.333C9.78098 10.6668 9.33318 10.219 9.33301 9.66699V3.33301C9.33318 2.78098 9.78098 2.33318 10.333 2.33301H11.333ZM16 0C16.5523 0 17 0.447715 17 1V9.66699C16.9998 10.2191 16.5522 10.667 16 10.667H15C14.4478 10.667 14.0002 10.2191 14 9.66699V1C14 0.447715 14.4477 0 15 0H16Z" fill="white" />
    </svg>
  </div>
  <div style={{
      left: 32,
      top: 10,
      position: 'absolute',
      color: 'white',
      fontSize: 15,
      fontFamily: 'SF Pro Text',
      fontWeight: '600',
      lineHeight: 2,
      wordWrap: 'break-word'
    }}>9:41</div>
  <div style={{
      width: 362,
      height: 653,
      left: 20,
      top: 110,
      position: 'absolute',
      background: 'linear-gradient(136deg, #450058 0%, #6E0058 100%)',
      borderRadius: 10,
      border: '1px #F8F8F8 solid'
    }} />
  <div style={{
      left: 84,
      top: 540,
      position: 'absolute',
      textAlign: 'center',
      color: 'white',
      fontSize: 27,
      fontFamily: 'SF Pro',
      fontWeight: '700',
      lineHeight: 1.5,
      letterSpacing: 2.70,
      wordWrap: 'break-word',
      zIndex: 10
    }}>이 번호로 복권을 <br />구매하시겠습니까?</div>
  <div style={{
      width: 79,
      height: 63,
      left: 84,
      top: 326,
      position: 'absolute',
      overflow: 'hidden'
    }}>
    <div data-svg-wrapper style={{
        left: 12,
        top: 1,
        position: 'absolute'
      }}>
      <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="54" height="54" rx="8.5" fill="url(#paint0_linear_334_471)" stroke="#B084B5" strokeWidth="3" />
      <defs>
      <linearGradient id="paint0_linear_334_471" x1="54.5217" y1="50.1719" x2="-8.45809" y2="24.6454" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6E0058" />
      <stop offset="1" stop-color="#450058" />
      </linearGradient>
      </defs>
      </svg>
    </div>
    <div style={{
        width: 40,
        height: 20,
        left: 20,
        top: 19,
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        fontFamily: 'SF Pro',
        fontWeight: '590',
        lineHeight: 0.8,
        wordWrap: 'break-word',
        zIndex: 10
      }}>
      {randomNumbers[0]}
    </div>
  </div>
  <div style={{
      width: 75,
      height: 71,
      left: 163,
      top: 318,
      position: 'absolute',
      overflow: 'hidden'
    }}>
    <div data-svg-wrapper style={{
        left: 10,
        top: 9,
        position: 'absolute'
      }}>
      <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="57" height="57" rx="10" fill="url(#paint0_linear_334_476)" />
      <rect x="1.5" y="1.5" width="54" height="54" rx="8.5" stroke="#B084B5" stroke-opacity="0.85" strokeWidth="3" />
      <defs>
      <linearGradient id="paint0_linear_334_476" x1="54.5217" y1="50.1719" x2="-8.45809" y2="24.6454" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6E0058" />
      <stop offset="1" stop-color="#450058" />
      </linearGradient>
      </defs>
      </svg>
    </div>
     <div style={{
        width: 40,
        height: 20,
        left: 19,
        top: 27,
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        fontFamily: 'SF Pro',
        fontWeight: '590',
        lineHeight: 0.8,
        wordWrap: 'break-word',
        zIndex: 10
      }}>{randomNumbers[1]}</div>
  </div>
  <div style={{
      width: 65,
      height: 64,
      left: 246,
      top: 325,
      position: 'absolute',
      overflow: 'hidden'
    }}>
    <div data-svg-wrapper style={{
        left: 3,
        top: 2,
        position: 'absolute'
      }}>
      <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="57" height="57" rx="10" fill="url(#paint0_linear_334_477)" />
      <rect x="1.5" y="1.5" width="54" height="54" rx="8.5" stroke="#B084B5" stroke-opacity="0.85" strokeWidth="3" />
      <defs>
      <linearGradient id="paint0_linear_334_477" x1="54.5217" y1="50.1719" x2="-8.45809" y2="24.6454" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6E0058" />
      <stop offset="1" stop-color="#450058" />
      </linearGradient>
      </defs>
      </svg>
    </div>
     <div style={{
        width: 40,
        height: 19,
        left: 12,
        top: 19,
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        fontFamily: 'SF Pro',
        fontWeight: '590',
        lineHeight: 0.8,
        wordWrap: 'break-word',
        zIndex: 10
      }}>{randomNumbers[2]}</div>
  </div>
  <div style={{
      width: 64,
      height: 58,
      left: 55,
      top: 412,
      position: 'absolute',
      overflow: 'hidden'
    }}>
    <div data-svg-wrapper style={{
        left: 3,
        top: 1,
        position: 'absolute'
      }}>
      <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="57" height="57" rx="10" fill="url(#paint0_linear_334_472)" />
      <rect x="1.5" y="1.5" width="54" height="54" rx="8.5" stroke="#B084B5" stroke-opacity="0.85" strokeWidth="3" />
      <defs>
      <linearGradient id="paint0_linear_334_472" x1="54.5217" y1="50.1719" x2="-8.45809" y2="24.6454" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6E0058" />
      <stop offset="1" stop-color="#450058" />
      </linearGradient>
      </defs>
      </svg>
    </div>
     <div style={{
        width: 40,
        height: 20,
        left: 12,
        top: 19,
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        fontFamily: 'SF Pro',
        fontWeight: '590',
        lineHeight: 0.8,
        wordWrap: 'break-word',
        zIndex: 10
      }}>{randomNumbers[3]}</div>
  </div>
  <div style={{
      width: 65,
      height: 59,
      left: 132,
      top: 411,
      position: 'absolute',
      overflow: 'hidden'
    }}>
    <div data-svg-wrapper style={{
        left: 3,
        top: 2,
        position: 'absolute'
      }}>
      <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="57" height="57" rx="10" fill="url(#paint0_linear_334_473)" />
      <rect x="1.5" y="1.5" width="54" height="54" rx="8.5" stroke="#B084B5" stroke-opacity="0.85" strokeWidth="3" />
      <defs>
      <linearGradient id="paint0_linear_334_473" x1="54.5217" y1="50.1719" x2="-8.45809" y2="24.6454" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6E0058" />
      <stop offset="1" stop-color="#450058" />
      </linearGradient>
      </defs>
      </svg>
    </div>
      <div style={{
        width: 40,
        height: 20,
        left: 12,
        top: 20,
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        fontFamily: 'SF Pro',
        fontWeight: '590',
        lineHeight: 0.8,
        wordWrap: 'break-word',
        zIndex: 10
      }}>{randomNumbers[4]}</div>
  </div>
  <div style={{
      width: 62,
      height: 62,
      left: 209,
      top: 412,
      position: 'absolute',
      overflow: 'hidden'
    }}>
    <div data-svg-wrapper style={{
        left: 2,
        top: 1,
        position: 'absolute'
      }}>
      <svg width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="57" rx="10" fill="url(#paint0_linear_334_474)" />
      <rect x="1.5" y="1.5" width="53" height="54" rx="8.5" stroke="#B084B5" stroke-opacity="0.85" strokeWidth="3" />
      <defs>
      <linearGradient id="paint0_linear_334_474" x1="53.5652" y1="50.1719" x2="-8.61484" y2="25.4117" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6E0058" />
      <stop offset="1" stop-color="#450058" />
      </linearGradient>
      </defs>
      </svg>
    </div>
     <div style={{
        width: 40,
        height: 20,
        left: 10,
        top: 19,
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        fontFamily: 'SF Pro',
        fontWeight: '590',
        lineHeight: 0.8,
        wordWrap: 'break-word',
        zIndex: 10
      }}>{randomNumbers[5]}</div>
  </div>
  <div style={{
      width: 68,
      height: 63,
      left: 283,
      top: 411,
      position: 'absolute',
      overflow: 'hidden'
    }}>
    <div data-svg-wrapper style={{
        left: 4,
        top: 2,
        position: 'absolute'
      }}>
      <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="57" height="57" rx="10" fill="url(#paint0_linear_334_475)" />
      <rect x="1.5" y="1.5" width="54" height="54" rx="8.5" stroke="#B084B5" stroke-opacity="0.85" strokeWidth="3" />
      <defs>
      <linearGradient id="paint0_linear_334_475" x1="54.5217" y1="50.1719" x2="-8.45809" y2="24.6454" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6E0058" />
      <stop offset="1" stop-color="#450058" />
      </linearGradient>
      </defs>
      </svg>
    </div>
     <div style={{
        width: 40,
        height: 20,
        left: 12,
        top: 19,
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        fontFamily: 'SF Pro',
        fontWeight: '590',
        lineHeight: 0.8,
        wordWrap: 'break-word',
        zIndex: 10
      }}>{randomNumbers[6]}</div>
  </div>
  <div style={{
      width: 152,
      height: 44.10,
      left: 38,
      top: 673.90,
      position: 'absolute',
      background: 'rgba(178.13, 166.86, 181.23, 0.40)',
      borderRadius: 10,
      border: '0.50px white solid'
    }} />
  <div style={{
      width: 131,
      height: 19,
      left: 50,
      top: 685,
      position: 'absolute',
      textAlign: 'center',
      color: 'white',
      fontSize: 14,
      fontFamily: 'SF Pro',
      fontWeight: '590',
      letterSpacing: 1.40,
      wordWrap: 'break-word'
    }}>번호 다시 생성</div>
  <div style={{
      width: 153,
      height: 44,
      left: 211,
      top: 674,
      position: 'absolute',
      background: 'linear-gradient(315deg, rgba(217.49, 0, 173.99, 0.85) 0%, rgba(168.51, 17.38, 210.13, 0.85) 100%)',
      borderRadius: 10,
      border: '0.50px white solid'
    }} />
  <div 
    style={{
      width: 89.53,
      height: 18.48,
      left: 242,
      top: 685,
      position: 'absolute',
      textAlign: 'center',
      color: 'white',
      fontSize: 14,
      fontFamily: 'SF Pro',
      fontWeight: '590',
      letterSpacing: 1.40,
      wordWrap: 'break-word',
      cursor: 'pointer'
    }}
    onClick={() => {
      onNavigate('confirm2');
    }}
  >
    번호 확정
  </div>
  <div style={{
      width: 105,
      height: 119,
      left: 148,
      top: 150,
      position: 'absolute',
      overflow: 'hidden'
    }}>
    <div data-svg-wrapper style={{
        left: 12,
        top: 0,
        position: 'absolute'
      }}>
      <UsdtIcon size={'80'} />
      <div style={{width: 100, height: 35, left:-6, justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 20, fontFamily: 'SF Pro', fontWeight: '700', wordWrap: 'break-word', position: 'absolute'}}>USDT 복권</div>
    </div>
    <div data-svg-wrapper style={{
        left: 54.79,
        top: 32.39,
        position: 'absolute'
      }}>
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.791809 20.3612L20.2372 9.07059L0.791809 0.386719V20.3612Z" fill="white" fillOpacity="0.2" />
      </svg>
    </div>
    <div data-svg-wrapper style={{
        left: 35.34,
        top: 32.39,
        position: 'absolute'
      }}>
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.34375 9.07059L19.7917 20.3612V0.386719L0.34375 9.07059Z" fill="white" fillOpacity="0.602" />
      </svg>
    </div>
  </div>
  </div>;
}
export default Rando;