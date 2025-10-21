

function Auto () {
    // 랜덤 로또 번호 생성 (1~45 중 6개 + 보너스 1개, 모두 중복 없음)
    const generateLottoNumbers = () => {
        const numbers = [];
        while (numbers.length < 6) {
            const num = Math.floor(Math.random() * 45) + 1;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        
        // 보너스 번호는 메인 번호와 중복되지 않도록 생성
        let bonus;
        do {
            bonus = Math.floor(Math.random() * 45) + 1;
        } while (numbers.includes(bonus));
        
        return {
            main: numbers.sort((a, b) => a - b),
            bonus: bonus
        };
    };

    const lottoNumbers = generateLottoNumbers();
    const numbersText = `번호:                    ${lottoNumbers.main.join('-')}+${lottoNumbers.bonus}`;

    return(      <div style={{width: 402, height: 79, left: 0, top: 862, position: 'absolute', background: 'linear-gradient(0deg, rgba(30.40, 29.23, 29.23, 0.20) 0%, rgba(30.40, 29.23, 29.23, 0.20) 100%), #552C60', borderRadius: 8}}>
            <div style={{width: 339, height: 29, left: 30, top: 23, position: 'absolute', background: 'linear-gradient(0deg, rgba(30, 29, 29, 0) 0%, rgba(30, 29, 29, 0) 100%), #D2FF88', borderRadius: 8}}>
            <div style={{width: 220, height: 13, left: 56, top: 4, position: 'absolute', color: '#397a00ff', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '700', lineHeight: 1.7, wordWrap: 'break-word', textAlign:'center', wordSpacing: '10px', letterSpacing: '2px'}}>{numbersText}</div>
            </div>
        </div>)
}

export default Auto;