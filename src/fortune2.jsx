import fortuneCookieData from '../fortuneData.mjs';

function FortuneOpen({
  onNavigate
}) {
  // 랜덤 포춘 메시지 선택 (이제 한 줄 배열에서 직접 선택)
  const getRandomFortune = () => {
    const randomIndex = Math.floor(Math.random() * fortuneCookieData.length);
    return fortuneCookieData[randomIndex];
  };
  
  const fortune = getRandomFortune();
  return <div style={{
    width: 402,
    height: 874,
    position: 'relative',
    background: '#380D44',
    overflow: 'hidden'
  }}>
        <div style={{
      width: 392,
      height: 78,
      left: -2,
      top: 0,
      position: 'absolute',
      overflow: 'hidden'
    }}>
            <div style={{transform: 'translate(20px, 0.1px)', position: 'relative'}}>
      <div style={{
        left: 0.8, top: 4, position:'absolute', color: 'white', fontSize: 12, fontFamily: 'SF Pro Text', fontWeight: '600', lineHeight: 3.1, wordWrap: 'break-word'}}>9:41</div>
    <div style={{transform: 'translate(23px, 10px)', position: 'relative'}}>
  <div data-svg-wrapper style={{left: 319.33, top: 4, position: 'absolute'}}>
    <svg width="23" height="12" viewBox="0 0 23 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.35" x="0.833984" y="0.5" width="21" height="10.3333" rx="2.16667" fill="white" stroke="#333333"/>
    </svg>
  </div>
  <div data-svg-wrapper style={{left: 342.33, top: 7.67, position: 'absolute'}}>
    <svg width="2" height="5" viewBox="0 0 2 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.4" d="M0.333984 0.666626V4.66663C1.13872 4.32785 1.66202 3.53976 1.66202 2.66663C1.66202 1.79349 1.13872 1.0054 0.333984 0.666626Z" fill="white"/>
    </svg>
  </div>
  <div data-svg-wrapper style={{left: 321.33, top: 2, position: 'absolute'}}>
    <svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.333984" width="18" height="7.33333" rx="1.33333" fill="white"/>
    </svg>
  </div>
  <div data-svg-wrapper style={{left: 299, top: 4, position: 'absolute'}}>
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.44824 8.42676C6.7289 7.34449 8.60508 7.34449 9.88574 8.42676C9.95009 8.48497 9.98748 8.56758 9.98926 8.6543C9.99092 8.74093 9.95644 8.82406 9.89453 8.88477L7.88965 10.9072C7.83087 10.9666 7.7506 11 7.66699 11C7.5834 11 7.5031 10.9666 7.44434 10.9072L5.43848 8.88477C5.37688 8.82407 5.34303 8.74072 5.34473 8.6543C5.34656 8.56762 5.3839 8.48492 5.44824 8.42676ZM2.77246 5.72949C5.53159 3.16511 9.80431 3.16517 12.5635 5.72949C12.6258 5.78963 12.6612 5.87245 12.6621 5.95898C12.6629 6.04533 12.6293 6.12818 12.5684 6.18945L11.4092 7.36035C11.2897 7.47965 11.0971 7.48151 10.9746 7.36523C10.0685 6.54547 8.88933 6.09172 7.66699 6.0918C6.4456 6.09232 5.26772 6.54616 4.3623 7.36523C4.23975 7.48158 4.04622 7.47986 3.92676 7.36035L2.76855 6.18945C2.70747 6.12825 2.67312 6.0454 2.67383 5.95898C2.67465 5.87251 2.71026 5.78961 2.77246 5.72949ZM0.0966797 3.03906C4.32849 -1.01301 11.0044 -1.01285 15.2363 3.03906C15.2976 3.09926 15.3325 3.18173 15.333 3.26758C15.3334 3.35334 15.2997 3.43622 15.2393 3.49707L14.0791 4.66699C13.9595 4.78709 13.765 4.78817 13.6436 4.66992C12.0312 3.13852 9.89158 2.28428 7.66699 2.28418C5.4421 2.28419 3.30199 3.13829 1.68945 4.66992C1.56817 4.78829 1.3744 4.7871 1.25488 4.66699L0.09375 3.49707C0.0333193 3.43619 -0.000480886 3.35331 0 3.26758C0.000565275 3.18173 0.0353775 3.09922 0.0966797 3.03906Z" fill="white"/>
    </svg>
  </div>
  <div data-svg-wrapper style={{left: 277, top: 4, position: 'absolute'}}>
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175969 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.66699 4.66699C7.21913 4.66717 7.66699 5.11482 7.66699 5.66699V9.66699C7.66682 10.219 7.21902 10.6668 6.66699 10.667H5.66699C5.11482 10.667 4.66717 10.2191 4.66699 9.66699V5.66699C4.66699 5.11471 5.11471 4.66699 5.66699 4.66699H6.66699ZM11.333 2.33301C11.8852 2.33301 12.3328 2.78087 12.333 3.33301V9.66699C12.3328 10.2191 11.8852 10.667 11.333 10.667H10.333C9.78098 10.6668 9.33318 10.219 9.33301 9.66699V3.33301C9.33318 2.78098 9.78098 2.33318 10.333 2.33301H11.333ZM16 0C16.5523 0 17 0.447715 17 1V9.66699C16.9998 10.2191 16.5522 10.667 16 10.667H15C14.4478 10.667 14.0002 10.2191 14 9.66699V1C14 0.447715 14.4477 0 15 0H16Z" fill="white"/>
    </svg>
  </div>
</div>
</div>
            <div data-svg-wrapper style={{
        left: 353.33,
        top: 16,
        position: 'absolute'
      }}>
            </div>
        </div>
        <div style={{
      left: 102,
      top: 109,
      position: 'absolute',
      textAlign: 'center',
      color: 'white',
      fontSize: 20,
      fontFamily: 'SF Pro',
      fontWeight: '700',
      lineHeight: 1,
      wordWrap: 'break-word'
    }}>포춘 쿠키가 열렸습니다!</div>
        <div style={{
      width: 761,
      height: 761,
      left: -183,
      top: 206,
      position: 'absolute',
      background: 'radial-gradient(ellipse 50.00% 50.00% at 50.00% 50.00%, #E700B1 25%, #870D6B 100%)',
      borderRadius: 9999
    }} />
        <div data-svg-wrapper style={{
      left: 66,
      top: 79,
      position: 'absolute'
    }}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
          mixBlendMode: "color-dodge"
        }}>
            <rect width="30" height="30" fill="black" />
            <ellipse cx="15" cy="15" rx="15" ry="1.5625" transform="rotate(-180 15 15)" fill="url(#paint0_radial_209_1159)" />
            <ellipse cx="15" cy="15" rx="15" ry="1.5625" transform="rotate(-90 15 15)" fill="url(#paint1_radial_209_1159)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_209_1159" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15 15) rotate(90) scale(1.5625 15)">
            <stop offset="0.109375" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="paint1_radial_209_1159" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15 15) rotate(90) scale(1.5625 15)">
            <stop offset="0.109375" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
        </div>
        <div style={{
      width: 18,
      height: 18,
      left: 63,
      top: 130,
      position: 'absolute'
    }}>
            <div data-svg-wrapper style={{
        left: 8.06,
        top: 0,
        position: 'absolute'
      }}>
            <svg width="2" height="18" viewBox="0 0 2 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
            mixBlendMode: "color-dodge"
          }}>
            <rect width="1.875" height="18" transform="translate(0.0625)" fill="black" />
            <ellipse cx="1" cy="9" rx="0.9375" ry="9" fill="url(#paint0_radial_209_1155)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_209_1155" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1 9) rotate(90) scale(9 0.9375)">
            <stop offset="0.151042" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
            </div>
            <div data-svg-wrapper style={{
        left: -0,
        top: 8.06,
        position: 'absolute'
      }}>
            <svg width="18" height="2" viewBox="0 0 18 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
            mixBlendMode: "color-dodge"
          }}>
            <rect width="1.875" height="18" transform="translate(0 1.9375) rotate(-90)" fill="black" />
            <ellipse cx="9" cy="1" rx="0.9375" ry="9" transform="rotate(-90 9 1)" fill="url(#paint0_radial_209_1157)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_209_1157" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9 1) rotate(90) scale(9 0.9375)">
            <stop offset="0.151042" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
            </div>
        </div>
        <div style={{
      width: 15,
      height: 15,
      left: 38,
      top: 104,
      position: 'absolute'
    }}>
            <div data-svg-wrapper style={{
        left: 6.72,
        top: 0,
        position: 'absolute'
      }}>
            <svg width="3" height="15" viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
            mixBlendMode: "color-dodge"
          }}>
            <rect width="1.5625" height="15" transform="translate(0.71875)" fill="black" />
            <ellipse cx="1.5" cy="7.5" rx="0.78125" ry="7.5" fill="url(#paint0_radial_209_1150)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_209_1150" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1.5 7.5) rotate(90) scale(7.5 0.78125)">
            <stop offset="0.0364583" stop-color="#FFF1E4" />
            <stop offset="1" stop-color="#3A71FF" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
            </div>
            <div data-svg-wrapper style={{
        left: -0,
        top: 6.72,
        position: 'absolute'
      }}>
            <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
            mixBlendMode: "color-dodge"
          }}>
            <rect width="1.5625" height="15" transform="translate(0 2.28125) rotate(-90)" fill="black" />
            <ellipse cx="7.5" cy="1.5" rx="0.78125" ry="7.5" transform="rotate(-90 7.5 1.5)" fill="url(#paint0_radial_209_1152)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_209_1152" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7.5 1.5) rotate(90) scale(7.5 0.78125)">
            <stop offset="0.0364583" stop-color="#FFF1E4" />
            <stop offset="1" stop-color="#3A71FF" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
            </div>
        </div>
        <div data-svg-wrapper style={{
      left: 306,
      top: 79,
      position: 'absolute'
    }}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
          mixBlendMode: "color-dodge"
        }}>
            <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="black" />
            <ellipse cx="15" cy="1.5625" rx="15" ry="1.5625" transform="matrix(1 -8.74228e-08 -8.74228e-08 -1 0 16.5625)" fill="url(#paint0_radial_209_1191)" />
            <ellipse cx="15" cy="1.5625" rx="15" ry="1.5625" transform="matrix(-1.31134e-07 -1 -1 1.31134e-07 16.5625 30)" fill="url(#paint1_radial_209_1191)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_209_1191" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15 1.5625) rotate(90) scale(1.5625 15)">
            <stop offset="0.109375" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="paint1_radial_209_1191" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15 1.5625) rotate(90) scale(1.5625 15)">
            <stop offset="0.109375" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
        </div>
        <div style={{
      width: 18,
      height: 18,
      left: 339,
      top: 148,
      position: 'absolute',
      transform: 'rotate(180deg)',
      transformOrigin: 'top left'
    }}>
            <div data-svg-wrapper style={{
        left: 8.06,
        top: 0,
        position: 'absolute'
      }}>
            <svg width="2" height="18" viewBox="0 0 2 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
            mixBlendMode: "color-dodge"
          }}>
            <rect width="1.875" height="18" transform="matrix(-1 0 0 1 1.9375 0)" fill="black" />
            <ellipse cx="0.9375" cy="9" rx="0.9375" ry="9" transform="matrix(-1 0 0 1 1.9375 0)" fill="url(#paint0_radial_286_374)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_286_374" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.9375 9) rotate(90) scale(9 0.9375)">
            <stop offset="0.151042" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
            </div>
            <div data-svg-wrapper style={{
        left: -0,
        top: 8.06,
        position: 'absolute'
      }}>
            <svg width="18" height="2" viewBox="0 0 18 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
            mixBlendMode: "color-dodge"
          }}>
            <rect width="1.875" height="18" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 18 1.9375)" fill="black" />
            <ellipse cx="0.9375" cy="9" rx="0.9375" ry="9" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 18 1.9375)" fill="url(#paint0_radial_286_376)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_286_376" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.9375 9) rotate(90) scale(9 0.9375)">
            <stop offset="0.151042" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
            </div>
        </div>
        <div style={{
      width: 15,
      height: 15,
      left: 364,
      top: 119,
      position: 'absolute',
      transform: 'rotate(180deg)',
      transformOrigin: 'top left'
    }}>
            <div data-svg-wrapper style={{
        left: 6.72,
        top: 0,
        position: 'absolute'
      }}>
            <svg width="3" height="15" viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
            mixBlendMode: "color-dodge"
          }}>
            <rect width="1.5625" height="15" transform="matrix(-1 0 0 1 2.28125 -0.00012207)" fill="black" />
            <ellipse cx="0.78125" cy="7.5" rx="0.78125" ry="7.5" transform="matrix(-1 0 0 1 2.28125 -0.00012207)" fill="url(#paint0_radial_286_128)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_286_128" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.78125 7.5) rotate(90) scale(7.5 0.78125)">
            <stop offset="0.0364583" stop-color="#FFF1E4" />
            <stop offset="1" stop-color="#3A71FF" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
            </div>
            <div data-svg-wrapper style={{
        left: -0,
        top: 6.72,
        position: 'absolute'
      }}>
            <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{
            mixBlendMode: "color-dodge"
          }}>
            <rect width="1.5625" height="15" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 15 2.28113)" fill="black" />
            <ellipse cx="0.78125" cy="7.5" rx="0.78125" ry="7.5" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 15 2.28113)" fill="url(#paint0_radial_286_130)" />
            </g>
            <defs>
            <radialGradient id="paint0_radial_286_130" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.78125 7.5) rotate(90) scale(7.5 0.78125)">
            <stop offset="0.0364583" stop-color="#FFF1E4" />
            <stop offset="1" stop-color="#3A71FF" stop-opacity="0" />
            </radialGradient>
            </defs>
            </svg>
            </div>
        </div>
             <div style={{
      width: 429,
      height: 90.07,
      left: -20,
      top: 300,          // -400 → 300 (흰색 박스 안으로)
      position: 'absolute',
      textAlign: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      color: '#430303',
      fontSize: 34,
      fontFamily: 'SF Pro',
      fontWeight: '700',
      lineHeight: 1.3,
      wordWrap: 'break-word',
      zIndex: 10         // 흰색 박스보다 앞으로!
    }} dangerouslySetInnerHTML={{__html: `"${fortune}"`}}></div>
        <div style={{
      width: 362,
      height: 127,
      left: 20,
      top: 282,
      position: 'absolute',
      background: '#EFEFEF',
      boxShadow: '4px 4px 4px 2px rgba(0, 0, 0, 0.25)',
      borderRadius: 15
    }} />
           <div style={{
      width: 171,
      height: 50,
      left: 20,
      top: 781,
      position: 'absolute',
      background: '#380D44',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: 10,
      border: '0.30px #C0C0C0 solid'
    }} />
    
        <div style={{
      left: 54,
      top: 656,        // 원래대로 버튼 위에
      position: 'absolute',
      textAlign: 'center',
      color: 'white',
      fontSize: 15,
      fontFamily: 'SF Pro',
      fontWeight: '510',
      lineHeight: 20,
      wordWrap: 'break-word'
    }}>새로운 복권 구매</div>
        <div style={{
      width: 171,
      height: 50,
      left: 211,
      top: 781,
      position: 'absolute',
      background: 'linear-gradient(133deg, #DF78EC 0%, #FF20A2 100%)',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: 10,
      border: '0.30px #C0C0C0 solid'
    }} />
        <div style={{
      left: 245,       
      top: 656,        // 원래대로 버튼 위에
      position: 'absolute',
      textAlign: 'center',
      color: 'white',
      fontSize: 15,
      fontFamily: 'SF Pro',
      fontWeight: '510',
      lineHeight: 20,
      wordWrap: 'break-word'
    }}>내 복권 확인하기</div>
        <div style={{
      width: 390,        // 화면에 맞게 줄임
      left: 4,           // 중앙 정렬 (402-390)/2 = 6
      top: 430,          // 이미지 아래로 이동
      position: 'absolute',
      textAlign: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      fontSize: 16,
      fontFamily: 'SF Pro',
      fontWeight: '510',
      lineHeight: 1,
      wordWrap: 'break-word',
      zIndex: 10         // 이미지보다 위에
      
    }}>- 두려움 없이 도전하는 당신에게 축복을 -</div>

        <div data-svg-wrapper style={{
      left: 74.29,
      top: 590,
      position: 'absolute',
      transform: 'rotate(-15deg)'
    }}>
        
        <div data-svg-wrapper style={{
      left: 0,
      top: 100,
      width:400,
      height:280.235465,
      position: 'absolute',
      transform: 'rotate(20deg)'
    }}>
           <div data-svg-wrapper style={{
      left: -30,
      top: -30,
      position: 'absolute',
    }}>
            <svg 
          width="113.98" height="104.54" viewBox="0 0 115 106" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{filter: 'blur(5px)', transform: 'scale(1.2)'
            }}>
            <path d="M114.264 17.4623V4.43896L112.341 2.32706L105.127 0.567139L91.1808 2.32706L80.6009 4.43896L58.4791 12.1826L39.7237 22.3901L24.8156 32.9496L11.8311 47.0289L3.17475 60.4043L0.289307 74.4837V92.4348L3.17475 101.586L8.94564 105.106L20.9683 103.346L35.8765 99.4745L52.7082 94.1947L80.6009 85.7471L91.1808 81.8753H98.3945L101.761 76.5956L105.127 69.9079L108.013 60.4043L110.417 51.2528L112.341 42.8051L114.264 35.0615V17.4623Z" fill="url(#paint0_linear_213_1219)" />
            <defs>
            <linearGradient id="paint0_linear_213_1219" x1="90.7833" y1="3.90349" x2="35.95" y2="93.3776" gradientUnits="userSpaceOnUse">
            <stop stop-color="#666666" stop-opacity="0.3" />
            <stop offset="3" stop-opacity="0.5" />
            </linearGradient>
            </defs>
            </svg>
        </div>
         <div data-svg-wrapper style={{
      left: 70,
      top: -8,
      position: 'absolute',
    }}>
            <svg width="130" height="166" viewBox="0 0 130 166" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{filter: 'blur(6px)'}}>
            <path d="M65.454 22.6465L46.6986 42.7095L0.0505371 84.2436L24.5768 100.083L22.1723 101.139L9.66869 108.882V112.754L14.4778 128.593V146.545V158.864L17.3632 165.552H26.0195L40.9277 162.384L50.5458 158.864L69.3012 152.528L83.7285 143.729L96.232 132.817L106.812 120.498L113.064 106.771L114.987 92.6912V81.0757L113.064 75.092V69.8122L110.178 63.8285L106.812 61.7166L75.553 72.6281L106.812 47.9893L118.835 37.7817L129.415 26.1663L86.6139 0.119507L65.454 22.6465Z" fill="url(#paint0_linear_213_1220)" />
            <defs>
            <linearGradient id="paint0_linear_213_1220" x1="110.708" y1="5.39925" x2="6.17337" y2="113.892" gradientUnits="userSpaceOnUse">
            <stop stop-color="#666666" stop-opacity="0.3" />
            <stop offset="1" stop-opacity="0.3" />
            </linearGradient>
            </defs>
            </svg>
         </div>
            </div>
        <img style={{
      width: 400,
      height: 400,
      left: -80,    // 조금 왼쪽으로
      top: -140,    // 위로 올려서 텍스트 박스와 겹치게
      position: 'absolute',
      transform: 'rotate(21deg)',
      transformOrigin: 'center',
      zIndex: 5     // SVG보다는 아래, 텍스트보다는 위
    }} src="/img/fortuneopen.png" alt="fortune cookie" />
        </div>
        </div>;
}
export default FortuneOpen;