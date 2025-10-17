import { useState } from 'react';
import First from './first_1';
import Second from './second_2';
import Rando from './Rando';
import History from './History';
import Mainp from './mainp';
import Mainp2 from './mainp2';
import Userp from './user';
import Choose from './choosep';
import Result from './resultp';
import Userm from './usermock';
import Adminm from './adminmock';
import Fortune from './fortune';
import FortuneOpen from './fortune2';

import './index.css';

function App() {
  const [page, setPage] = useState('user');
  return (
    <div className="app">
      <header className="topbar">
        <div style={{ display: 'flex', gap: '8px', margin: '8px' }}>
          <button onClick={() => setPage('main')}>1st</button>
          <button onClick={() => setPage('wallet')}>2nd</button>
          <button onClick={() => setPage('mainp')}>메인</button>
          <button onClick={() => setPage('mainp2')}>메인2</button>
          <button onClick={() => setPage('random')}>난수 생성</button>
          <button onClick={() => setPage('choosep')}>고르기</button>
          <button onClick={() => setPage('resultp')}>결과</button>
          <button onClick={() => setPage('fortune')}>포춘쿠키</button>
          <button onClick={() => setPage('fortune2')}>포춘오픈</button>
          <button onClick={() => setPage('history')}>히스토리</button>
          <button onClick={() => setPage('user')}>유저페이지</button>
          <button onClick={() => setPage('usermock')}>유저</button>
          <button onClick={() => setPage('adminmock')}>관리자</button>
        </div>
      </header>

  
        <div className="page-container">
        {page === 'main' && <First />}
        {page === 'wallet' && <Second />}
        {page === 'mainp' && <Mainp onNavigate={setPage} />}
        {page === 'mainp2' && <Mainp2 />}
        {page === 'random' && <Rando onNavigate={setPage} />}
        {page === 'choosep' && <Choose />}
        {page === 'resultp' && <Result />}
        {page === 'fortune' && <Fortune onNavigate={setPage} />}
        {page === 'fortune2' && <FortuneOpen />}
        {page === 'history' && <History onNavigate={setPage} />}
        {page === 'user' && <Userp onNavigate={setPage} />}
        {page === 'usermock' && <Userm />}
        {page === 'adminmock' && <Adminm />}
        </div>
      
    </div>
  );
}

export default App;
