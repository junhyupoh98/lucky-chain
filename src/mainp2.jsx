import React from 'react';
function Mainp2() {
  return (
    <div
      style={{
        width: 402,
        height: 874,
        position: 'relative',
        background: '#380D44',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 402,
          height: 146,
          left: 0,
          top: 761,
          position: 'absolute',
          background: '#F7F7F7',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      />
      <div
        style={{
          width: 402,
          left: 0,
          top: 0,
          position: 'absolute',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            height: 60,
            background: '#380D44',
          }}
        />
        <div
          style={{
            alignSelf: 'stretch',
            height: 49,
            paddingLeft: 8,
            paddingRight: 5,
            background: 'white',
            outline: '1px #380D44 solid',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 200,
            display: 'inline-flex',
          }}
        >
          <div
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <div
              style={{
                width: 153,
                height: 20,
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: 'black',
                fontSize: 15,
                fontFamily: 'KyivType Sans',
                fontWeight: '200',
                wordWrap: 'break-word',
              }}
            >
              로고 Luckychain
            </div>
          </div>
          <div
            data-svg-wrapper
            style={{
              position: 'relative',
            }}
          >
            <svg
              width="30"
              height="29"
              viewBox="0 0 30 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 6.12202C0 5.50235 0.419733 5 0.9375 5H21.5625C22.0803 5 22.5 5.50235 22.5 6.12202C22.5 6.7417 22.0803 7.24405 21.5625 7.24405H0.9375C0.419733 7.24405 0 6.7417 0 6.12202Z"
                fill="var(--slate-800, #1E293B)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 15.0982C0 14.4785 0.419733 13.9762 0.9375 13.9762H21.5625C22.0803 13.9762 22.5 14.4785 22.5 15.0982C22.5 15.7179 22.0803 16.2202 21.5625 16.2202H0.9375C0.419733 16.2202 0 15.7179 0 15.0982Z"
                fill="var(--slate-800, #1E293B)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 23.7321C0 23.1125 0.419733 22.6101 0.9375 22.6101H21.5625C22.0803 22.6101 22.5 23.1125 22.5 23.7321C22.5 24.3518 22.0803 24.8542 21.5625 24.8542H0.9375C0.419733 24.8542 0 24.3518 0 23.7321Z"
                fill="var(--slate-800, #1E293B)"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        style={{
          width: 137,
          height: 4,
          left: 133,
          top: 863,
          position: 'absolute',
          background: 'var(--Labels-Primary, black)',
          borderRadius: 100,
        }}
      />
      <div
        style={{
          width: 402,
          left: 1,
          top: 782,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 75,
          display: 'inline-flex',
        }}
      >
        <div
          style={{
            width: 30,
            height: 40,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 3,
            display: 'inline-flex',
          }}
        >
          <div
            style={{
              width: 32,
              height: 26,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              display: 'inline-flex',
            }}
          >
            <div
              data-svg-wrapper
              style={{
                position: 'relative',
              }}
            >
              <svg
                width="32"
                height="30"
                viewBox="0 0 32 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_143_1067"
                  maskUnits="userSpaceOnUse"
                  x="3"
                  y="1"
                  width="27"
                  height="28"
                  {...{
                    'mask-type': 'luminance',
                  }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.08337 1.25024H29.5623V28.1315H3.08337V1.25024Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask0_143_1067)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.2176 19.1141C19.7728 19.1141 21.0386 20.3304 21.0386 21.8254V25.6704C21.0386 25.9916 21.3047 26.2491 21.6457 26.2566H24.1076C26.0477 26.2566 27.6248 24.7491 27.6248 22.8966V11.9916C27.6158 11.3541 27.3019 10.7541 26.7633 10.3554L18.2473 3.78287C17.1042 2.90662 15.5051 2.90662 14.3581 3.78537L5.90025 10.3529C5.34096 10.7641 5.02709 11.3641 5.02063 12.0129V22.8966C5.02063 24.7491 6.59775 26.2566 8.53784 26.2566H11.023C11.373 26.2566 11.6572 25.9879 11.6572 25.6579C11.6572 25.5854 11.6663 25.5129 11.6818 25.4441V21.8254C11.6818 20.3391 12.9398 19.1241 14.4834 19.1141H18.2176ZM24.1076 28.1316H21.6224C20.199 28.0991 19.1011 27.0179 19.1011 25.6704V21.8254C19.1011 21.3641 18.7045 20.9891 18.2176 20.9891H14.4898C14.0132 20.9916 13.6193 21.3679 13.6193 21.8254V25.6579C13.6193 25.7516 13.6063 25.8416 13.5792 25.9266C13.4397 27.1641 12.347 28.1316 11.023 28.1316H8.53784C5.52955 28.1316 3.08313 25.7829 3.08313 22.8966V12.0041C3.09605 10.7616 3.68763 9.62412 4.70934 8.87537L13.1504 2.31912C15.0091 0.894124 17.5989 0.894124 19.4537 2.31662L27.9555 8.87912C28.9539 9.61537 29.5455 10.7504 29.5623 11.9779V22.8966C29.5623 25.7829 27.1159 28.1316 24.1076 28.1316Z"
                    fill="var(--Labels---Vibrant---Controls-Secondary--, #8C8C8C)"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              textAlign: 'center',
              color: '#575757',
              fontSize: 10,
              fontFamily: 'Noto Sans KR',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            홈
          </div>
        </div>
        <div
          style={{
            width: 30,
            height: 40,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 3.1,
            display: 'inline-flex',
          }}
        >
          <div
            data-svg-wrapper
            style={{
              position: 'relative',
            }}
          >
            <svg
              width="28"
              height="26"
              viewBox="0 0 28 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.1172 15.524C10.1172 16.9215 11.2722 18.0481 12.7072 18.0481H15.6355C16.8839 18.0481 17.8989 17.0623 17.8989 15.849C17.8989 14.5273 17.2805 14.0615 16.3589 13.7581L11.6572 12.2415C10.7355 11.9381 10.1172 11.4723 10.1172 10.1506C10.1172 8.93731 11.1322 7.95148 12.3805 7.95148H15.3089C16.7439 7.95148 17.8989 9.07814 17.8989 10.4756"
                stroke="var(--Labels---Vibrant---Controls-Secondary--, #8C8C8C)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 6.5V19.5"
                stroke="var(--Labels---Vibrant---Controls-Secondary--, #8C8C8C)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 23.8334H10.5C4.66665 23.8334 2.33331 21.6667 2.33331 16.25V9.75002C2.33331 4.33335 4.66665 2.16669 10.5 2.16669H17.5C23.3333 2.16669 25.6666 4.33335 25.6666 9.75002V16.25C25.6666 21.6667 23.3333 23.8334 17.5 23.8334Z"
                stroke="var(--Labels---Vibrant---Controls-Secondary--, #8C8C8C)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              textAlign: 'center',
              color: '#575757',
              fontSize: 10,
              fontFamily: 'Noto Sans KR',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            로또 사기
          </div>
        </div>
        <div
          style={{
            width: 25,
            height: 40,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 3.1,
            display: 'inline-flex',
          }}
        >
          <div
            data-svg-wrapper
            style={{
              position: 'relative',
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7536 23.9788V18.7661C10.1927 18.5689 8.83945 18.0135 7.69389 17.0998C6.54834 16.1862 5.76788 15.0399 5.35252 13.6608H4.37482C3.74261 13.6608 3.17963 13.4952 2.68588 13.1639C2.19213 12.8326 1.84631 12.3892 1.64843 11.8338L0.31511 7.72333C0.196255 7.40063 0.171599 7.08281 0.241142 6.76986C0.310684 6.4569 0.453879 6.16573 0.670725 5.89634C0.887572 5.62695 1.15436 5.4209 1.4711 5.27818C1.78783 5.13546 2.12385 5.06381 2.47915 5.06324H5.11639V2.48396C5.11639 2.23292 5.20522 2.02686 5.38287 1.8658C5.56052 1.70474 5.7878 1.62421 6.0647 1.62421H19.341C19.6179 1.62421 19.8452 1.70474 20.0228 1.8658C20.2005 2.02686 20.2893 2.23292 20.2893 2.48396V5.06324H22.9266C23.2825 5.06324 23.6185 5.13488 23.9346 5.27818C24.2507 5.42147 24.5175 5.62752 24.735 5.89634C24.9525 6.16516 25.0957 6.45633 25.1646 6.76986C25.2335 7.08338 25.2088 7.40121 25.0906 7.72333L23.7269 11.8338C23.5493 12.3715 23.2133 12.8102 22.7189 13.1501C22.2245 13.49 21.6615 13.6602 21.0299 13.6608H20.0522C19.6375 15.0399 18.8571 16.1862 17.7109 17.0998C16.5647 18.0135 15.2114 18.5689 13.6512 18.7661V23.9788H17.4444C17.7213 23.9788 17.9486 24.0593 18.1262 24.2204C18.3039 24.3814 18.3927 24.5875 18.3927 24.8385C18.3927 25.0896 18.3039 25.2956 18.1262 25.4567C17.9486 25.6178 17.7213 25.6983 17.4444 25.6983H7.96132C7.68441 25.6983 7.45713 25.6178 7.27948 25.4567C7.10183 25.2956 7.01301 25.0896 7.01301 24.8385C7.01301 24.5875 7.10183 24.3814 7.27948 24.2204C7.45713 24.0593 7.68441 23.9788 7.96132 23.9788H11.7545H11.7536ZM18.3918 11.9422V3.34458H7.01206V11.9422C7.05189 13.4112 7.60507 14.6292 8.6716 15.5961C9.73813 16.5631 11.0816 17.0646 12.7019 17.1007C14.3223 17.0646 15.6657 16.5631 16.7322 15.5961C17.7987 14.6292 18.3519 13.4112 18.3918 11.9422ZM20.2884 11.9422H21.029C21.2269 11.9422 21.4096 11.8883 21.5771 11.7805C21.7447 11.6728 21.8581 11.5206 21.9176 11.324L23.2812 7.21349C23.3211 7.10573 23.3011 7.00715 23.2215 6.91773C23.1418 6.82832 23.0429 6.78361 22.9247 6.78361H20.2874V11.9422H20.2884ZM5.11544 11.9422V6.78361H2.4782C2.35935 6.78361 2.26041 6.82832 2.18138 6.91773C2.10235 7.00715 2.08244 7.10573 2.12164 7.21349L3.4853 11.324C3.54473 11.5212 3.65821 11.6733 3.82575 11.7805C3.99328 11.8877 4.17599 11.9416 4.37387 11.9422H5.1145H5.11544Z"
                fill="var(--Labels---Vibrant---Controls-Secondary--, #8C8C8C)"
              />
            </svg>
          </div>
          <div
            style={{
              width: 44,
              textAlign: 'center',
              color: '#575757',
              fontSize: 10,
              fontFamily: 'Noto Sans KR',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            로또 결과
          </div>
        </div>
        <div
          style={{
            width: 30,
            height: 40,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 3.1,
            display: 'inline-flex',
          }}
        >
          <div
            style={{
              width: 24,
              height: 26,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              display: 'inline-flex',
            }}
          >
            <div
              data-svg-wrapper
              style={{
                position: 'relative',
              }}
            >
              <svg
                width="30"
                height="31"
                viewBox="0 0 30 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_143_1082"
                  maskUnits="userSpaceOnUse"
                  x="4"
                  y="19"
                  width="23"
                  height="12"
                  {...{
                    'mask-type': 'luminance',
                  }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.08862 19.6952H26.519V30.1373H4.08862V19.6952Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask0_143_1082)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.3051 21.8193C9.27126 21.8193 6.21255 22.8558 6.21255 24.9021C6.21255 26.9667 9.27126 28.0132 15.3051 28.0132C21.3376 28.0132 24.3949 26.9766 24.3949 24.9304C24.3949 22.8658 21.3376 21.8193 15.3051 21.8193ZM15.3052 30.1373C12.5311 30.1373 4.0885 30.1373 4.0885 24.9021C4.0885 20.2347 10.4906 19.6952 15.3052 19.6952C18.0793 19.6952 26.519 19.6952 26.519 24.9304C26.519 29.5978 20.1184 30.1373 15.3052 30.1373Z"
                    fill="#737373"
                  />
                </g>
                <mask
                  id="mask1_143_1082"
                  maskUnits="userSpaceOnUse"
                  x="7"
                  y="2"
                  width="16"
                  height="16"
                  {...{
                    'mask-type': 'luminance',
                  }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.78442 2H22.8231V17.0367H7.78442V2Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask1_143_1082)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.3052 4.02147C12.2734 4.02147 9.80664 6.48685 9.80664 9.51865C9.79673 12.5405 12.2451 15.0045 15.2642 15.0158L15.3052 16.0269V15.0158C18.3356 15.0158 20.801 12.549 20.801 9.51865C20.801 6.48685 18.3356 4.02147 15.3052 4.02147ZM15.3052 17.0367H15.2599C11.1221 17.024 7.77031 13.6495 7.78447 9.51454C7.78447 5.37253 11.1575 1.99945 15.3052 1.99945C19.4515 1.99945 22.8231 5.37253 22.8231 9.51878C22.8231 13.665 19.4515 17.0367 15.3052 17.0367Z"
                    fill="#737373"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              color: '#575757',
              fontSize: 10,
              fontFamily: 'Noto Sans KR',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            마이
          </div>
        </div>
      </div>
      <div
        style={{
          width: 372,
          height: 137,
          left: 15,
          top: 344,
          position: 'absolute',
          background: 'white',
          borderRadius: 10,
        }}
      />
      <div
        style={{
          width: 372,
          height: 89,
          left: 15,
          top: 227,
          position: 'absolute',
          background: '#450058',
          borderRadius: 10,
          border: '0.50px white solid',
        }}
      />
      <div
        data-svg-wrapper
        style={{
          left: 32,
          top: 356,
          position: 'absolute',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C13.9401 1.99965 15.8385 2.56368 17.4637 3.62336C19.0889 4.68303 20.3707 6.19259 21.153 7.96804C21.9352 9.74349 22.1841 11.7082 21.8693 13.6226C21.5545 15.537 20.6896 17.3185 19.38 18.75M12 6V12L16 14M2.5 8.875C2.18135 9.84366 2.01273 10.8554 2 11.875M2.82996 16C3.39146 17.2918 4.21954 18.4505 5.25996 19.4M4.63599 5.23493C4.91503 4.93116 5.2126 4.64495 5.52699 4.37793M8.64404 21.42C11.1377 22.3084 13.8819 22.1718 16.275 21.04"
            stroke="#5E5E5E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          width: 152,
          height: 19,
          left: 62,
          top: 359,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          fontSize: 13,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        다음 추천까지
      </div>
      <div
        style={{
          width: 67,
          height: 66,
          left: 123,
          top: 394,
          position: 'absolute',
          background: '#414141',
          borderRadius: 5,
        }}
      />
      <div
        style={{
          width: 67,
          height: 67,
          left: 297,
          top: 394,
          position: 'absolute',
          background: '#414141',
          borderRadius: 5,
        }}
      />
      <div
        style={{
          width: 67,
          height: 67,
          left: 36,
          top: 394,
          position: 'absolute',
          background: '#414141',
          borderRadius: 5,
        }}
      />
      <div
        style={{
          width: 67,
          height: 66,
          left: 210,
          top: 394,
          position: 'absolute',
          background: '#414141',
          borderRadius: 5,
        }}
      />
      <div
        data-svg-wrapper
        style={{
          left: 112,
          top: 417,
          position: 'absolute',
        }}
      >
        <svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="1" fill="black" />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 112,
          top: 435,
          position: 'absolute',
        }}
      >
        <svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="1" fill="black" />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 200,
          top: 417,
          position: 'absolute',
        }}
      >
        <svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="1" fill="black" />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 200,
          top: 435,
          position: 'absolute',
        }}
      >
        <svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="1" fill="black" />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 286,
          top: 417,
          position: 'absolute',
        }}
      >
        <svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="1" fill="black" />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 286,
          top: 435,
          position: 'absolute',
        }}
      >
        <svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="1" fill="black" />
        </svg>
      </div>
      <div
        style={{
          width: 13,
          height: 11,
          left: 91,
          top: 448,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 9,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        일
      </div>
      <div
        style={{
          width: 24,
          height: 11,
          left: 171,
          top: 448,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 9,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        시간
      </div>
      <div
        style={{
          width: 24,
          height: 11,
          left: 265,
          top: 448,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 9,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        분
      </div>
      <div
        style={{
          width: 24,
          height: 11,
          left: 352,
          top: 448,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 9,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        초
      </div>
      <div
        style={{
          width: 43,
          height: 29,
          left: 47,
          top: 413,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 40,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        2
      </div>
      <div
        style={{
          width: 51,
          height: 29,
          left: 131,
          top: 412,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 40,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        18
      </div>
      <div
        style={{
          width: 51,
          height: 29,
          left: 217,
          top: 413,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 40,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        54
      </div>
      <div
        style={{
          width: 51,
          height: 29,
          left: 306,
          top: 413,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 40,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        13
      </div>
      <div
        style={{
          width: 131,
          height: 39,
          left: 26,
          top: 245,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 18,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        전체 누적 상금
      </div>
      <div
        style={{
          width: 131,
          height: 38,
          left: 20,
          top: 267,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 12,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        7개 코인 풀 운영중
      </div>
      <div
        style={{
          width: 198,
          height: 50,
          left: 182,
          top: 247,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: '#93EE00',
          fontSize: 36,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        $ 1,257,459
      </div>
      <div
        style={{
          width: 299,
          height: 74,
          left: 50,
          top: 130,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 26,
          fontFamily: 'KyivType Sans',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        지금 참여하고
        <br /> 당첨의 주인공이 되세요!
      </div>
      <div
        style={{
          width: 291,
          height: 225,
          left: -310,
          top: -3,
          position: 'absolute',
          background: 'linear-gradient(312deg, #6E0058 0%, #450058 64%)',
          borderRadius: 10,
          border: '0.50px white solid',
        }}
      />
      <div
        style={{
          width: 55,
          height: 56,
          left: -292,
          top: 24,
          position: 'absolute',
        }}
      >
        <div
          data-name="Bitcoin (BTC)"
          style={{
            width: 55,
            height: 56,
            left: 0,
            top: 0,
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: 50,
          }}
        >
          <div
            style={{
              width: 54.99,
              height: 56,
              left: 0.01,
              top: 0,
              position: 'absolute',
              background: '#F7931A',
            }}
          />
        </div>
      </div>
      <div
        style={{
          left: -135,
          top: 32,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 16,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        $ 67,432.10
      </div>
      <div
        style={{
          left: -231,
          top: 33,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 16,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        BTC
      </div>
      <div
        style={{
          left: -231,
          top: 56,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 10,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        비트코인
      </div>
      <div
        style={{
          left: -77,
          top: 56,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: '#34D055',
          fontSize: 12,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        +1.8%
      </div>
      <div
        style={{
          width: 252,
          height: 0,
          left: -293,
          top: 100,
          position: 'absolute',
          outline: '0.30px white solid',
          outlineOffset: '-0.15px',
        }}
      ></div>
      <div
        style={{
          left: -119,
          top: 117,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 12,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        참여자
      </div>
      <div
        style={{
          left: -288,
          top: 119,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 12,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        풀 금액
      </div>
      <div
        style={{
          left: -288,
          top: 144,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 16,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        3.2 BTC
      </div>
      <div
        style={{
          left: -119,
          top: 144,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 16,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        총 843명
      </div>
      <div
        style={{
          width: 30,
          height: 35,
          left: -125,
          top: 166,
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 10,
            height: 7,
            left: 5,
            top: 11,
            position: 'absolute',
            borderRadius: 4,
            outline: '0.50px white solid',
            outlineOffset: '-0.25px',
          }}
        />
      </div>
      <div
        style={{
          left: -288,
          top: 174,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 11,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        $ 215,782
      </div>
      <div
        style={{
          left: -108,
          top: 174,
          position: 'absolute',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontSize: 11,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        실시간 증가중
      </div>
      <div
        style={{
          width: 294,
          height: 225,
          left: 56,
          top: 511,
          position: 'absolute',
        }}
      >
        <div
          style={{
            width: 294,
            height: 225,
            left: 0,
            top: 0,
            position: 'absolute',
          }}
        >
          <div
            style={{
              width: 291,
              height: 225,
              left: 0,
              top: 0,
              position: 'absolute',
              background: 'linear-gradient(312deg, #6E0058 0%, #450058 64%)',
              borderRadius: 10,
              border: '0.50px white solid',
            }}
          />
          <div
            style={{
              width: 55,
              height: 56,
              left: 18,
              top: 26,
              position: 'absolute',
            }}
          >
            <div
              data-svg-wrapper
              data-name="Bitcoin (BTC)"
              style={{
                left: 0,
                top: 0,
                position: 'absolute',
              }}
            >
              <svg
                width="55"
                height="56"
                viewBox="0 0 55 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_197_36)">
                  <path
                    d="M54.1773 34.7733C50.5045 49.7735 35.583 58.9023 20.849 55.1617C6.12115 51.4221 -2.84463 36.2284 0.82981 21.2295C4.50102 6.22773 19.4224 -2.90175 34.1519 0.837856C48.8849 4.57746 57.8501 19.7728 54.1769 34.7736L54.1772 34.7733H54.1773Z"
                    fill="#F7931A"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M39.6294 24.0107C40.1768 20.2845 37.3906 18.2815 33.5806 16.9453L34.8166 11.8979L31.7989 11.1323L30.5958 16.0468C29.8024 15.8454 28.9877 15.6555 28.178 15.4674L29.3899 10.5204L26.3741 9.75476L25.1375 14.8006C24.481 14.6484 23.8362 14.498 23.2106 14.3395L23.2141 14.3236L19.0526 13.2655L18.2499 16.5472C18.2499 16.5472 20.4888 17.0697 20.4416 17.1019C21.6636 17.4124 21.8846 18.2361 21.8479 18.8889L20.44 24.6391C20.5241 24.6609 20.6333 24.6924 20.7537 24.7416L20.6661 24.7194L20.666 24.7194C20.5916 24.7004 20.5142 24.6807 20.4347 24.6613L18.4613 32.7166C18.312 33.0946 17.933 33.6619 17.0786 33.4464C17.1088 33.4911 14.8853 32.8891 14.8853 32.8891L13.3871 36.4062L17.3141 37.403C17.7441 37.5128 18.169 37.6255 18.5896 37.7372L18.5898 37.7372C18.8837 37.8152 19.1756 37.8927 19.4656 37.9682L18.2168 43.0735L21.231 43.8391L22.4677 38.788C23.2911 39.0156 24.0902 39.2255 24.8725 39.4235L23.64 44.4508L26.6579 45.2164L27.9065 40.1206C33.0522 41.1122 36.9214 40.7124 38.55 35.9734C39.8624 32.158 38.4847 29.9573 35.7775 28.5222C37.7493 28.0592 39.2345 26.7387 39.6305 24.0111L39.6295 24.0104L39.6294 24.0107ZM32.7347 33.8546C31.8791 37.3551 26.4977 35.9079 24.0355 35.2457C23.814 35.1862 23.6161 35.133 23.4473 35.0903L25.1044 28.3266C25.3101 28.3789 25.5616 28.4363 25.8464 28.5014C28.3933 29.0834 33.6114 30.2757 32.7349 33.8546H32.7347ZM26.3573 25.3623C28.41 25.9201 32.8881 27.1369 33.668 23.9554H33.6683C34.4646 20.7014 30.1127 19.7204 27.9872 19.2413C27.7481 19.1874 27.5371 19.1398 27.3649 19.0961L25.8625 25.2304C26.0044 25.2664 26.1708 25.3116 26.3573 25.3623Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_197_36">
                    <rect width="55" height="56" rx="27.5" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div
            style={{
              left: 79,
              top: 35,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            BTC
          </div>
          <div
            style={{
              left: 79,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            비트코인
          </div>
          <div
            style={{
              width: 252,
              height: 0,
              left: 17,
              top: 102,
              position: 'absolute',
              outline: '0.30px white solid',
              outlineOffset: '-0.15px',
            }}
          ></div>
          <div
            style={{
              left: 22,
              top: 121,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            풀 금액
          </div>
          <div
            style={{
              left: 191,
              top: 119,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            참여자
          </div>
          <div
            style={{
              left: 22,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            3.2 BTC
          </div>
          <div
            style={{
              left: 191,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            총 843명
          </div>
          <div
            style={{
              left: 22,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            $ 215,782
          </div>
          <div
            style={{
              left: 202,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            실시간 증가중
          </div>
          <div
            style={{
              left: 175,
              top: 34,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            $ 67,432.10
          </div>
          <div
            style={{
              left: 233,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#34D055',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            +1.8%
          </div>
          <div
            data-svg-wrapper
            style={{
              left: 185,
              top: 168,
              position: 'absolute',
            }}
          >
            <svg
              width="30"
              height="35"
              viewBox="0 0 30 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 18V17.5C5 16.3954 5.99492 15.5 7.22222 15.5H9.44444C10.6717 15.5 11.6667 16.3954 11.6667 17.5V18M11.6667 14C12.5871 14 13.3333 13.3284 13.3333 12.5C13.3333 11.6716 12.5871 11 11.6667 11M15 18V17.5C15 16.3954 14.0051 15.5 12.7778 15.5H12.5M10 12.5C10 13.3284 9.25381 14 8.33333 14C7.41286 14 6.66667 13.3284 6.66667 12.5C6.66667 11.6716 7.41286 11 8.33333 11C9.25381 11 10 11.6716 10 12.5Z"
                stroke="white"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              width: 291,
              height: 225,
              left: 313,
              top: 0,
              position: 'absolute',
              background: 'linear-gradient(314deg, #6E0058 0%, #450058 64%)',
              borderRadius: 10,
              border: '0.50px white solid',
            }}
          />
          <div
            style={{
              left: 392,
              top: 35,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            ETH
          </div>
          <div
            style={{
              left: 392,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            이더리움
          </div>
          <div
            style={{
              width: 253,
              height: 0,
              left: 330,
              top: 102,
              position: 'absolute',
              outline: '0.30px white solid',
              outlineOffset: '-0.15px',
            }}
          ></div>
          <div
            style={{
              left: 336,
              top: 121,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            풀 금액
          </div>
          <div
            style={{
              left: 503,
              top: 119,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            참여자
          </div>
          <div
            style={{
              left: 336,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            125.5 ETH
          </div>
          <div
            style={{
              left: 503,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            총 731명
          </div>
          <div
            style={{
              left: 336,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            $ 407,411
          </div>
          <div
            style={{
              left: 516,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            실시간 증가중
          </div>
          <div
            style={{
              left: 500,
              top: 34,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            $ 3245.67
          </div>
          <div
            style={{
              left: 544,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#34D055',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            +2.5%
          </div>
          <div
            style={{
              width: 27,
              height: 32,
              left: 499,
              top: 170,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 9,
                height: 7,
                left: 4.5,
                top: 9,
                position: 'absolute',
                borderRadius: 4,
                outline: '0.50px white solid',
                outlineOffset: '-0.25px',
              }}
            />
          </div>
          <div
            data-svg-wrapper
            style={{
              left: 332,
              top: 29,
              position: 'absolute',
            }}
          >
            <svg
              width="14"
              height="55"
              viewBox="0 0 14 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_197_70)">
                <path
                  d="M27.5 55C42.6878 55 55 42.6878 55 27.5C55 12.3122 42.6878 0 27.5 0C12.3122 0 0 12.3122 0 27.5C0 42.6878 12.3122 55 27.5 55Z"
                  fill="#627EEA"
                />
              </g>
              <defs>
                <clipPath id="clip0_197_70">
                  <rect width="55" height="55" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div
            style={{
              width: 291,
              height: 225,
              left: 626,
              top: 0,
              position: 'absolute',
              background: 'linear-gradient(312deg, #6E0058 0%, #450058 64%)',
              borderRadius: 10,
              border: '0.50px white solid',
            }}
          />
          <div
            style={{
              left: 705,
              top: 35,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            BNB
          </div>
          <div
            style={{
              left: 705,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            바이넌스코인
          </div>
          <div
            style={{
              width: 252,
              height: 0,
              left: 643,
              top: 102,
              position: 'absolute',
              outline: '0.30px white solid',
              outlineOffset: '-0.15px',
            }}
          ></div>
          <div
            style={{
              left: 648,
              top: 121,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            풀 금액
          </div>
          <div
            style={{
              left: 817,
              top: 119,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            참여자
          </div>
          <div
            style={{
              left: 648,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            245 BNB
          </div>
          <div
            style={{
              left: 817,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            총 1,567명
          </div>
          <div
            style={{
              left: 648,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            $ 294,860
          </div>
          <div
            style={{
              left: 828,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            실시간 증가중
          </div>
          <div
            style={{
              left: 813,
              top: 34,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            $ 1,203.51
          </div>
          <div
            style={{
              left: 859,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#34D055',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            +2.3%
          </div>
          <div
            style={{
              width: 291,
              height: 225,
              left: 939,
              top: 0,
              position: 'absolute',
              background: 'linear-gradient(314deg, #6E0058 0%, #450058 64%)',
              borderRadius: 10,
              border: '0.50px white solid',
            }}
          />
          <div
            style={{
              left: 1018,
              top: 35,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            SOL
          </div>
          <div
            style={{
              left: 1018,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            솔라나
          </div>
          <div
            style={{
              width: 253,
              height: 0,
              left: 956,
              top: 102,
              position: 'absolute',
              outline: '0.30px white solid',
              outlineOffset: '-0.15px',
            }}
          ></div>
          <div
            style={{
              left: 962,
              top: 121,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            풀 금액
          </div>
          <div
            style={{
              left: 1129,
              top: 119,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            참여자
          </div>
          <div
            style={{
              left: 962,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            1,850 SOL
          </div>
          <div
            style={{
              left: 1129,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            총 1,567명
          </div>
          <div
            style={{
              left: 962,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            $ 263,736
          </div>
          <div
            style={{
              left: 1142,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            실시간 증가중
          </div>
          <div
            style={{
              left: 1139,
              top: 34,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            $ 142.56
          </div>
          <div
            style={{
              left: 1171,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#34D055',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            +3.1%
          </div>
          <div
            style={{
              width: 27,
              height: 32,
              left: 1125,
              top: 170,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 9,
                height: 7,
                left: 4.5,
                top: 9,
                position: 'absolute',
                borderRadius: 4,
                outline: '0.50px white solid',
                outlineOffset: '-0.25px',
              }}
            />
          </div>
          <div
            style={{
              width: 291,
              height: 225,
              left: 1252,
              top: 0,
              position: 'absolute',
              background: 'linear-gradient(312deg, #6E0058 0%, #450058 64%)',
              borderRadius: 10,
              border: '0.50px white solid',
            }}
          />
          <div
            style={{
              left: 1331,
              top: 35,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            TRX
          </div>
          <div
            style={{
              left: 1331,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            트론
          </div>
          <div
            style={{
              width: 252,
              height: 0,
              left: 1269,
              top: 102,
              position: 'absolute',
              outline: '0.30px white solid',
              outlineOffset: '-0.15px',
            }}
          ></div>
          <div
            style={{
              left: 1274,
              top: 121,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            풀 금액
          </div>
          <div
            style={{
              left: 1443,
              top: 119,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            참여자
          </div>
          <div
            style={{
              left: 1274,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            950,000 TRX
          </div>
          <div
            style={{
              left: 1443,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            총 3,421명
          </div>
          <div
            style={{
              left: 1274,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            $ 295,925
          </div>
          <div
            style={{
              left: 1454,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            실시간 증가중
          </div>
          <div
            style={{
              left: 1454,
              top: 34,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            $ 0.3115
          </div>
          <div
            style={{
              left: 1485,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#34D055',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            +1.8%
          </div>
          <div
            style={{
              width: 30,
              height: 35,
              left: 1437,
              top: 168,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 10,
                height: 7,
                left: 5,
                top: 11,
                position: 'absolute',
                borderRadius: 4,
                outline: '0.50px white solid',
                outlineOffset: '-0.25px',
              }}
            />
          </div>
          <div
            style={{
              width: 291,
              height: 225,
              left: 1565,
              top: 0,
              position: 'absolute',
              background: 'linear-gradient(314deg, #6E0058 0%, #450058 64%)',
              borderRadius: 10,
              border: '0.50px white solid',
            }}
          />
          <div
            style={{
              left: 1644,
              top: 35,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            DOT
          </div>
          <div
            style={{
              left: 1644,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            폴카닷
          </div>
          <div
            style={{
              width: 253,
              height: 0,
              left: 1582,
              top: 102,
              position: 'absolute',
              outline: '0.30px white solid',
              outlineOffset: '-0.15px',
            }}
          ></div>
          <div
            style={{
              left: 1588,
              top: 121,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            풀 금액
          </div>
          <div
            style={{
              left: 1755,
              top: 119,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            참여자
          </div>
          <div
            style={{
              left: 1588,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            82,500 DOT
          </div>
          <div
            style={{
              left: 1755,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            총 1,892명
          </div>
          <div
            style={{
              left: 1588,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            $ 266,475
          </div>
          <div
            style={{
              left: 1768,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            실시간 증가중
          </div>
          <div
            style={{
              left: 1785,
              top: 34,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            $ 3.23
          </div>
          <div
            style={{
              left: 1796,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#34D055',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            -4.8%
          </div>
          <div
            style={{
              width: 27,
              height: 32,
              left: 1751,
              top: 170,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 9,
                height: 7,
                left: 4.5,
                top: 9,
                position: 'absolute',
                borderRadius: 4,
                outline: '0.50px white solid',
                outlineOffset: '-0.25px',
              }}
            />
          </div>
          <div
            style={{
              width: 291,
              height: 225,
              left: 1878,
              top: 0,
              position: 'absolute',
              background: 'linear-gradient(312deg, #6E0058 0%, #450058 64%)',
              borderRadius: 10,
              border: '0.50px white solid',
            }}
          />
          <div
            style={{
              left: 1957,
              top: 35,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            USDT
          </div>
          <div
            style={{
              left: 1957,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 10,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            테더
          </div>
          <div
            style={{
              width: 252,
              height: 0,
              left: 1895,
              top: 102,
              position: 'absolute',
              outline: '0.30px white solid',
              outlineOffset: '-0.15px',
            }}
          ></div>
          <div
            style={{
              left: 1900,
              top: 121,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            풀 금액
          </div>
          <div
            style={{
              left: 2069,
              top: 119,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            참여자
          </div>
          <div
            style={{
              left: 1900,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            485,000 USDT
          </div>
          <div
            style={{
              left: 2069,
              top: 146,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            총 2,845명
          </div>
          <div
            style={{
              left: 1900,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            $ 485,000
          </div>
          <div
            style={{
              left: 2080,
              top: 176,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 11,
              fontFamily: 'SF Pro',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            실시간 증가중
          </div>
          <div
            style={{
              left: 2100,
              top: 34,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: 16,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            $ 1.00
          </div>
          <div
            style={{
              left: 2102,
              top: 58,
              position: 'absolute',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#34D055',
              fontSize: 12,
              fontFamily: 'SF Pro',
              fontWeight: '700',
              wordWrap: 'break-word',
            }}
          >
            +0.01%
          </div>
          <div
            style={{
              width: 30,
              height: 35,
              left: 2063,
              top: 168,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 10,
                height: 7,
                left: 5,
                top: 11,
                position: 'absolute',
                borderRadius: 4,
                outline: '0.50px white solid',
                outlineOffset: '-0.25px',
              }}
            />
          </div>
          <div
            style={{
              width: 18,
              height: 15,
              left: 501,
              top: 73,
              position: 'absolute',
            }}
          />
          <div
            style={{
              width: 55,
              height: 55,
              left: 645,
              top: 29,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 55,
                height: 55,
                left: 0,
                top: 0,
                position: 'absolute',
                background: '#F3BA2F',
              }}
            />
            <div
              style={{
                width: 34.38,
                height: 34.38,
                left: 10.31,
                top: 10.31,
                position: 'absolute',
                background: 'white',
              }}
            />
          </div>
          <div
            style={{
              width: 55,
              height: 55,
              left: 957,
              top: 29,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 31.88,
                height: 25.8,
                left: 11.55,
                top: 14.41,
                position: 'absolute',
                background: '#00FFAD',
              }}
            />
            <div
              style={{
                width: 55,
                height: 55,
                left: 0,
                top: 0,
                position: 'absolute',
                background: 'black',
              }}
            />
            <div
              style={{
                width: 31.85,
                height: 25.99,
                left: 11.53,
                top: 15.1,
                position: 'absolute',
                background: 'linear-gradient(39deg, #CB4EE8 0%, #10F4B1 100%)',
              }}
            />
          </div>
          <div
            style={{
              width: 55,
              height: 55,
              left: 1270,
              top: 29,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 54.73,
                height: 54.73,
                left: 0.18,
                top: 0.2,
                position: 'absolute',
                background: '#020100',
              }}
            />
            <div
              style={{
                width: 32.87,
                height: 38.13,
                left: 12.3,
                top: 10.4,
                position: 'absolute',
                background: 'white',
              }}
            />
          </div>
          <div
            style={{
              width: 54.73,
              height: 54.73,
              left: 1581,
              top: 26,
              position: 'absolute',
            }}
          >
            <div
              style={{
                width: 54.73,
                height: 54.73,
                left: 0,
                top: 0,
                position: 'absolute',
                background: 'white',
              }}
            />
            <div
              style={{
                width: 32,
                height: 41.58,
                left: 12,
                top: 7,
                position: 'absolute',
                background: 'black',
              }}
            />
            <div
              style={{
                width: 5.3,
                height: 5.3,
                left: 25.92,
                top: 43.27,
                position: 'absolute',
                background: '#E6027A',
              }}
            />
          </div>
          <div
            style={{
              width: 55,
              height: 55,
              left: 1895,
              top: 26,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 55,
                height: 55,
                left: 0,
                top: 0,
                position: 'absolute',
                background: '#26A17B',
              }}
            />
            <div
              style={{
                width: 33.2,
                height: 30.58,
                left: 10.83,
                top: 13.44,
                position: 'absolute',
                background: 'white',
              }}
            />
          </div>
          <div
            style={{
              width: 27,
              height: 32,
              left: 812,
              top: 169,
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 9,
                height: 7,
                left: 4.5,
                top: 9,
                position: 'absolute',
                borderRadius: 4,
                outline: '0.50px white solid',
                outlineOffset: '-0.25px',
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          width: 402,
          height: 874,
          left: 0,
          top: 0,
          position: 'absolute',
          background: 'rgba(217, 217, 217, 0.70)',
        }}
      />
      <div
        style={{
          width: 295,
          height: 874,
          left: 107,
          top: 0,
          position: 'absolute',
          background: 'white',
        }}
      />
      <div
        data-svg-wrapper
        style={{
          left: 299,
          top: 16,
          position: 'absolute',
        }}
      >
        <svg
          width="30"
          height="29"
          viewBox="0 0 30 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 6.12202C0 5.50235 0.419733 5 0.9375 5H21.5625C22.0803 5 22.5 5.50235 22.5 6.12202C22.5 6.7417 22.0803 7.24405 21.5625 7.24405H0.9375C0.419733 7.24405 0 6.7417 0 6.12202Z"
            fill="var(--slate-800, #1E293B)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 15.0982C0 14.4785 0.419733 13.9762 0.9375 13.9762H21.5625C22.0803 13.9762 22.5 14.4785 22.5 15.0982C22.5 15.7179 22.0803 16.2202 21.5625 16.2202H0.9375C0.419733 16.2202 0 15.7179 0 15.0982Z"
            fill="var(--slate-800, #1E293B)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 23.7321C0 23.1125 0.419733 22.6101 0.9375 22.6101H21.5625C22.0803 22.6101 22.5 23.1125 22.5 23.7321C22.5 24.3518 22.0803 24.8542 21.5625 24.8542H0.9375C0.419733 24.8542 0 24.3518 0 23.7321Z"
            fill="var(--slate-800, #1E293B)"
          />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 123,
          top: 159,
          position: 'absolute',
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="5" fill="#DFB9D8" />
        </svg>
      </div>
      <div
        style={{
          left: 337,
          top: 14,
          position: 'absolute',
          textAlign: 'center',
          color: 'black',
          fontSize: 30,
          fontFamily: 'Libre Franklin',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        메뉴
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 123,
          top: 90,
          position: 'absolute',
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="5" fill="#DFB9D8" />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 127,
          top: 94,
          position: 'absolute',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect width="32" height="32" fill="url(#pattern0_156_805)" />
          <defs>
            <pattern
              id="pattern0_156_805"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#image0_156_805" transform="scale(0.00195312)" />
            </pattern>
            <image
              id="image0_156_805"
              width="512"
              height="512"
              preserveAspectRatio="none"
              xlinkHref="data:image/png;base64,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"
            />
          </defs>
        </svg>
      </div>
      <div
        style={{
          left: 183,
          top: 94,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          fontSize: 16,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        난수 생성기
      </div>
      <div
        style={{
          left: 184,
          top: 117,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          fontSize: 11,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        복권 번호를 자동으로 생성합니다
      </div>
      <div
        style={{
          left: 185,
          top: 159,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          fontSize: 16,
          fontFamily: 'SF Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        히스토리
      </div>
      <div
        style={{
          left: 186,
          top: 182,
          position: 'absolute',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          fontSize: 11,
          fontFamily: 'SF Pro',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        구매 및 당첨 내역을 확인합니다
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 128,
          top: 164,
          position: 'absolute',
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.9978 6.73871V5.27339C22.9978 4.99964 23.0857 4.77495 23.2613 4.59933C23.4369 4.4237 23.6566 4.33589 23.9203 4.33589C24.1841 4.33589 24.4038 4.4237 24.5794 4.59933C24.755 4.77495 24.8528 4.99964 24.8728 5.27339V9.63839C24.8535 9.89214 24.7557 10.1071 24.5794 10.2834C24.4032 10.4596 24.1882 10.5575 23.9344 10.5768H19.5694C19.2957 10.5575 19.071 10.4596 18.8953 10.2834C18.7197 10.1071 18.6319 9.88745 18.6319 9.62433C18.6319 9.3612 18.7197 9.14152 18.8953 8.96527C19.071 8.78902 19.2957 8.7012 19.5694 8.70183H22.2938C20.77 7.09995 18.9782 6.12839 16.9182 5.78714C14.8582 5.44589 12.861 5.78277 10.9266 6.79777C9.01222 7.85277 7.63534 9.33714 6.79597 11.2509C5.95659 13.1646 5.79065 15.1959 6.29815 17.3446C6.8644 19.454 7.97284 21.1484 9.62347 22.4278C11.2741 23.7071 13.1932 24.3662 15.3807 24.405C18.0369 24.3462 20.2441 23.4331 22.0022 21.6656C23.7603 19.8981 24.6785 17.6862 24.7566 15.03H26.6316C26.5535 18.2137 25.4547 20.865 23.3353 22.9837C21.216 25.1025 18.5647 26.2012 15.3816 26.28C12.1978 26.2018 9.54659 25.1031 7.42784 22.9837C5.30909 20.8643 4.21034 18.2131 4.13159 15.03C4.15097 12.7643 4.75659 10.7134 5.94847 8.87714C7.14034 7.04089 8.77128 5.66402 10.8413 4.74652C12.9313 3.84777 15.0553 3.57933 17.2135 3.9412C19.3716 4.30308 21.3003 5.23558 22.9997 6.73871H22.9978Z"
            fill="#313131"
            fillOpacity="0.96"
          />
        </svg>
      </div>
      <div
        style={{
          width: 8.47,
          left: 32,
          top: 10,
          position: 'absolute',
          color: 'white',
          fontSize: 15,
          fontFamily: 'SF Pro Text',
          fontWeight: '600',
          lineHeight: 20,
          wordWrap: 'break-word',
        }}
      >
        9:41
      </div>
    </div>
  );
}
export default Mainp2;
