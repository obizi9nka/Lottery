import Image from 'next/image';

export default function News({ news, now, deleteNews }) {
  return (
    <div className='wraper'>
      <div className='fff'>
        <div className='dropdown-content'>
          <div
            className={news && news.length > 0 ? 'hearder' : 'hearder alone'}
          >
            <div className='CENTER'>
              <Image
                className=''
                onClick={deleteNews}
                src='/delete.png'
                width={25}
                height={25}
              />
            </div>
            <div className='CENTER'>{'Creator'}</div>
            <div className='CENTER'>{'Deposit'}</div>
            <div className='CENTER'>{'Players'}</div>
            <div className='CENTER'>{'Exodus'}</div>
          </div>
          {news &&
            news.map((element, index) => (
              <div className={element.isWin == 'Win' ? 'win' : null}>
                <div
                  className={
                    index === news.length - 1 ? 'onenews KOSTLb' : 'onenews'
                  }
                >
                  <div className='CENTER'>
                    <Image
                      className='token'
                      src={`/tokens/${element.token}.png`}
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className='CENTER'>
                    {'0x...' + element.creator.substr(38, 4)}
                  </div>
                  <div className='CENTER nowrap'>{element.deposit}</div>
                  <div className='CENTER'>{element.countOfPlayers}</div>
                  <div className='CENTER'>{element.isWin}</div>
                </div>
              </div>
            ))}
          <div className={'reload'}>
            {now && now.toString().substring(16, 24)}
          </div>
        </div>
      </div>
    </div>
  );
}
