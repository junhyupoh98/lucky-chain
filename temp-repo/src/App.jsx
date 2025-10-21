import { useState } from 'react';
import First from './first_1';
import Second from './second_2';
import Rando from './Rando';
import History from './History';
import Mainp from './home';
import Userp from './user';
import Choose from './choosep';
import Result from './resultp';


import Fortune from './fortune';
import FortuneOpen from './fortune2';
import CoinS from './coinselect';
import Auto from './auto';
import Confirm from './confirm';
import MyLotto from './mylottos'
import './index.css';

function App() {
  const [page, setPage] = useState('user');
  return (
    <div className="app">
      <header className="topbar">
        <div style={{ display: 'flex', gap: '8px', margin: '8px' }}>
          <button onClick={() => setPage('main')}>1st</button>
          <button onClick={() => setPage('wallet')}>2nd</button>
          <button onClick={() => setPage('home')}>홈</button>
          <button onClick={() => setPage('random')}>자동</button>
          <button onClick={() => setPage('choosep')}>수동</button>
          <button onClick={() => setPage('resultp')}>결과</button>
          <button onClick={() => setPage('fortune')}>포춘쿠키</button>
          <button onClick={() => setPage('fortune2')}>포춘오픈</button>
          <button onClick={() => setPage('history')}>히스토리</button>
          <button onClick={() => setPage('user')}>유저페이지</button>
          <button onClick={() => setPage('confirm')}>컨펌</button>
          

        </div>
      </header>

  
        <div className="scroll-area">
          <div className="page-container">
        {page === 'main' && <First />}
        {page === 'wallet' && <Second />}
        {page === 'home' && <Mainp onNavigate={setPage} />}
        {page === 'coinselect' && <CoinS onNavigate={setPage} />}
        {page === 'auto' && <Auto />}
        {page === 'random' && <Rando onNavigate={setPage} />}
        {page === 'choosep' && <Choose onNavigate={setPage} />}
        {page === 'mylottos' && <MyLotto onNavigate={setPage} />}
        {page === 'confirm' && <Confirm onNavigate={setPage} />}
        {page === 'resultp' && <Result />}
        {page === 'fortune' && <Fortune onNavigate={setPage} />}
        {page === 'fortune2' && <FortuneOpen />}
        {page === 'history' && <History onNavigate={setPage} />}
        {page === 'user' && <Userp onNavigate={setPage} />}
        </div>
        </div>
      
    </div>
  );
}

export default App;
