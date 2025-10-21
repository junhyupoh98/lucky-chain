
import { useState } from 'react';

function Mainp({ onNavigate }) {

  
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
        <div style={{
          width: 160,
          height: 33,
          left: 10,
          top: 6,
          position: 'absolute',
          color: '#fff',
          fontSize: 11,
          fontFamily: 'SF Pro',
          fontWeight: '800',
          lineHeight: '22px',
          overflowWrap: 'break-word',
          zIndex: 2147483647,
          opacity: 1,
          padding: '4px 8px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.35)'
        }}>9:41
    </div>
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
            className="menu-icon"
              onClick={() => onNavigate('mainp2')}
              style={{ cursor: 'pointer' }}
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
          onClick={() => onNavigate('mainp')}
          style={{
            width: 30,
            height: 40,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 3,
            display: 'inline-flex',
            cursor: 'pointer',
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
                  id="mask0_38_278"
                  {...{
                    'mask-type': 'luminance',
                  }}
                  maskUnits="userSpaceOnUse"
                  x="3"
                  y="1"
                  width="27"
                  height="28"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.08334 1.25024H29.5623V28.1315H3.08334V1.25024Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask0_38_278)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.2175 19.1141C19.7727 19.1141 21.0385 20.3304 21.0385 21.8254V25.6704C21.0385 25.9916 21.3046 26.2491 21.6456 26.2566H24.1075C26.0476 26.2566 27.6247 24.7491 27.6247 22.8966V11.9916C27.6157 11.3541 27.3018 10.7541 26.7632 10.3554L18.2472 3.78287C17.1041 2.90662 15.505 2.90662 14.358 3.78537L5.90019 10.3529C5.3409 10.7641 5.02703 11.3641 5.02057 12.0129V22.8966C5.02057 24.7491 6.59769 26.2566 8.53778 26.2566H11.0229C11.373 26.2566 11.6572 25.9879 11.6572 25.6579C11.6572 25.5854 11.6662 25.5129 11.6817 25.4441V21.8254C11.6817 20.3391 12.9398 19.1241 14.4833 19.1141H18.2175ZM24.1075 28.1316H21.6224C20.1989 28.0991 19.101 27.0179 19.101 25.6704V21.8254C19.101 21.3641 18.7045 20.9891 18.2175 20.9891H14.4898C14.0132 20.9916 13.6192 21.3679 13.6192 21.8254V25.6579C13.6192 25.7516 13.6063 25.8416 13.5792 25.9266C13.4397 27.1641 12.3469 28.1316 11.0229 28.1316H8.53778C5.52949 28.1316 3.08307 25.7829 3.08307 22.8966V12.0041C3.09599 10.7616 3.68757 9.62412 4.70928 8.87537L13.1503 2.31912C15.009 0.894124 17.5988 0.894124 19.4537 2.31662L27.9554 8.87912C28.9539 9.61537 29.5454 10.7504 29.5622 11.9779V22.8966C29.5622 25.7829 27.1158 28.1316 24.1075 28.1316Z"
                    fill="var(--Labels---Vibrant---Controls-Secondary--, #8C8C8C)"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div
            data-svg-wrapper
            style={{
              position: 'relative',
            }}
          ></div>
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
                d="M11.7537 23.9788V18.7661C10.1927 18.5689 8.83951 18.0135 7.69396 17.0998C6.5484 16.1862 5.76794 15.0399 5.35258 13.6608H4.37488C3.74267 13.6608 3.17969 13.4952 2.68594 13.1639C2.19219 12.8326 1.84637 12.3892 1.64849 11.8338L0.315171 7.72333C0.196316 7.40063 0.17166 7.08281 0.241203 6.76986C0.310745 6.4569 0.45394 6.16573 0.670786 5.89634C0.887633 5.62695 1.15442 5.4209 1.47116 5.27818C1.78789 5.13546 2.12391 5.06381 2.47921 5.06324H5.11645V2.48396C5.11645 2.23292 5.20528 2.02686 5.38293 1.8658C5.56058 1.70474 5.78786 1.62421 6.06476 1.62421H19.3411C19.618 1.62421 19.8453 1.70474 20.0229 1.8658C20.2006 2.02686 20.2894 2.23292 20.2894 2.48396V5.06324H22.9266C23.2826 5.06324 23.6186 5.13488 23.9347 5.27818C24.2508 5.42147 24.5176 5.62752 24.7351 5.89634C24.9525 6.16516 25.0957 6.45633 25.1646 6.76986C25.2335 7.08338 25.2089 7.40121 25.0907 7.72333L23.727 11.8338C23.5493 12.3715 23.2133 12.8102 22.7189 13.1501C22.2246 13.49 21.6616 13.6602 21.03 13.6608H20.0523C19.6376 15.0399 18.8571 16.1862 17.7109 17.0998C16.5647 18.0135 15.2115 18.5689 13.6512 18.7661V23.9788H17.4445C17.7214 23.9788 17.9486 24.0593 18.1263 24.2204C18.3039 24.3814 18.3928 24.5875 18.3928 24.8385C18.3928 25.0896 18.3039 25.2956 18.1263 25.4567C17.9486 25.6178 17.7214 25.6983 17.4445 25.6983H7.96138C7.68447 25.6983 7.45719 25.6178 7.27954 25.4567C7.10189 25.2956 7.01307 25.0896 7.01307 24.8385C7.01307 24.5875 7.10189 24.3814 7.27954 24.2204C7.45719 24.0593 7.68447 23.9788 7.96138 23.9788H11.7546H11.7537ZM18.3918 11.9422V3.34458H7.01212V11.9422C7.05195 13.4112 7.60513 14.6292 8.67166 15.5961C9.73819 16.5631 11.0816 17.0646 12.702 17.1007C14.3223 17.0646 15.6657 16.5631 16.7323 15.5961C17.7988 14.6292 18.352 13.4112 18.3918 11.9422ZM20.2884 11.9422H21.0291C21.2269 11.9422 21.4097 11.8883 21.5772 11.7805C21.7447 11.6728 21.8582 11.5206 21.9176 11.324L23.2813 7.21349C23.3211 7.10573 23.3012 7.00715 23.2216 6.91773C23.1419 6.82832 23.043 6.78361 22.9247 6.78361H20.2875V11.9422H20.2884ZM5.11551 11.9422V6.78361H2.47826C2.35941 6.78361 2.26047 6.82832 2.18144 6.91773C2.10242 7.00715 2.0825 7.10573 2.1217 7.21349L3.48536 11.324C3.54479 11.5212 3.65827 11.6733 3.82581 11.7805C3.99334 11.8877 4.17605 11.9416 4.37393 11.9422H5.11456H5.11551Z"
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
                  id="mask0_38_301"
                  {...{
                    'mask-type': 'luminance',
                  }}
                  maskUnits="userSpaceOnUse"
                  x="4"
                  y="19"
                  width="23"
                  height="12"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.08856 19.6952H26.519V30.1373H4.08856V19.6952Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask0_38_301)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.3051 21.8193C9.2712 21.8193 6.21249 22.8558 6.21249 24.9021C6.21249 26.9667 9.2712 28.0132 15.3051 28.0132C21.3375 28.0132 24.3948 26.9766 24.3948 24.9304C24.3948 22.8658 21.3375 21.8193 15.3051 21.8193ZM15.3051 30.1373C12.531 30.1373 4.08844 30.1373 4.08844 24.9021C4.08844 20.2347 10.4905 19.6952 15.3051 19.6952C18.0792 19.6952 26.519 19.6952 26.519 24.9304C26.519 29.5978 20.1183 30.1373 15.3051 30.1373Z"
                    fill="#737373"
                  />
                </g>
                <mask
                  id="mask1_38_301"
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
                    d="M7.7843 2H22.823V17.0367H7.7843V2Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask1_38_301)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.3051 4.02147C12.2733 4.02147 9.80652 6.48685 9.80652 9.51865C9.7966 12.5405 12.245 15.0045 15.264 15.0158L15.3051 16.0269V15.0158C18.3355 15.0158 20.8009 12.549 20.8009 9.51865C20.8009 6.48685 18.3355 4.02147 15.3051 4.02147ZM15.3051 17.0367H15.2598C11.122 17.024 7.77019 13.6495 7.78435 9.51454C7.78435 5.37253 11.1574 1.99945 15.3051 1.99945C19.4513 1.99945 22.823 5.37253 22.823 9.51878C22.823 13.665 19.4513 17.0367 15.3051 17.0367Z"
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
                <g clipPath="url(#clip0_174_464)">
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
                  <clipPath id="clip0_174_464">
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
              <g clipPath="url(#clip0_174_498)">
                <path
                  d="M27.5 55C42.6878 55 55 42.6878 55 27.5C55 12.3122 42.6878 0 27.5 0C12.3122 0 0 12.3122 0 27.5C0 42.6878 12.3122 55 27.5 55Z"
                  fill="#627EEA"
                />
              </g>
              <defs>
                <clipPath id="clip0_174_498">
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
        data-svg-wrapper
        style={{
          left: 351.33,
          top: 14,
          position: 'absolute',
        }}
      >
        <svg
          width="23"
          height="12"
          viewBox="0 0 23 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.35"
            x="0.833984"
            y="0.5"
            width="21"
            height="10.3333"
            rx="2.16667"
            fill="white"
            stroke="#333333"
          />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 374.33,
          top: 17.67,
          position: 'absolute',
        }}
      >
        <svg width="2" height="5" viewBox="0 0 2 5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.4"
            d="M0.333984 0.666666V4.66667C1.13872 4.32789 1.66202 3.5398 1.66202 2.66667C1.66202 1.79353 1.13872 1.00544 0.333984 0.666666Z"
            fill="white"
          />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 353.33,
          top: 16,
          position: 'absolute',
        }}
      >
        <svg
          width="19"
          height="8"
          viewBox="0 0 19 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.333984" width="18" height="7.33333" rx="1.33333" fill="white" />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 331,
          top: 14,
          position: 'absolute',
        }}
      >
        <svg
          width="16"
          height="11"
          viewBox="0 0 16 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.44824 8.42676C6.7289 7.34449 8.60508 7.34449 9.88574 8.42676C9.95009 8.48497 9.98748 8.56758 9.98926 8.6543C9.99092 8.74093 9.95644 8.82406 9.89453 8.88477L7.88965 10.9072C7.83087 10.9666 7.7506 11 7.66699 11C7.5834 11 7.5031 10.9666 7.44434 10.9072L5.43848 8.88477C5.37688 8.82407 5.34303 8.74072 5.34473 8.6543C5.34656 8.56762 5.3839 8.48492 5.44824 8.42676ZM2.77246 5.72949C5.53159 3.16511 9.80431 3.16517 12.5635 5.72949C12.6258 5.78963 12.6612 5.87245 12.6621 5.95898C12.6629 6.04533 12.6293 6.12818 12.5684 6.18945L11.4092 7.36035C11.2897 7.47965 11.0971 7.48151 10.9746 7.36523C10.0685 6.54547 8.88933 6.09172 7.66699 6.0918C6.4456 6.09232 5.26772 6.54616 4.3623 7.36523C4.23975 7.48158 4.04622 7.47986 3.92676 7.36035L2.76855 6.18945C2.70747 6.12825 2.67312 6.0454 2.67383 5.95898C2.67465 5.87251 2.71026 5.78961 2.77246 5.72949ZM0.0966797 3.03906C4.32849 -1.01301 11.0044 -1.01285 15.2363 3.03906C15.2976 3.09926 15.3325 3.18173 15.333 3.26758C15.3334 3.35334 15.2997 3.43622 15.2393 3.49707L14.0791 4.66699C13.9595 4.78709 13.765 4.78817 13.6436 4.66992C12.0312 3.13852 9.89158 2.28428 7.66699 2.28418C5.4421 2.28419 3.30199 3.13829 1.68945 4.66992C1.56817 4.78829 1.3744 4.7871 1.25488 4.66699L0.09375 3.49707C0.0333193 3.43619 -0.000480886 3.35331 0 3.26758C0.000565275 3.18173 0.0353775 3.09922 0.0966797 3.03906Z"
            fill="white"
          />
        </svg>
      </div>
      <div
        data-svg-wrapper
        style={{
          left: 309,
          top: 14,
          position: 'absolute',
        }}
      >
        <svg
          width="17"
          height="11"
          viewBox="0 0 17 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175969 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.66699 4.66699C7.21913 4.66717 7.66699 5.11482 7.66699 5.66699V9.66699C7.66682 10.219 7.21902 10.6668 6.66699 10.667H5.66699C5.11482 10.667 4.66717 10.2191 4.66699 9.66699V5.66699C4.66699 5.11471 5.11471 4.66699 5.66699 4.66699H6.66699ZM11.333 2.33301C11.8852 2.33301 12.3328 2.78087 12.333 3.33301V9.66699C12.3328 10.2191 11.8852 10.667 11.333 10.667H10.333C9.78098 10.6668 9.33318 10.219 9.33301 9.66699V3.33301C9.33318 2.78098 9.78098 2.33318 10.333 2.33301H11.333ZM16 0C16.5523 0 17 0.447715 17 1V9.66699C16.9998 10.2191 16.5522 10.667 16 10.667H15C14.4478 10.667 14.0002 10.2191 14 9.66699V1C14 0.447715 14.4477 0 15 0H16Z"
            fill="white"
          />
        </svg>
      </div>
   
    </div>
  );
}
export default Mainp;
