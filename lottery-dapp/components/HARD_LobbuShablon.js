import Image from 'next/image';

export default function HARD_LobbuShablon({
  element,
  imageFounded,
  EnterLobby,
  isSHOW,
  index,
  filterModeScreen,
  needLigth,
  setimageFounded,
  isMonitor,
  activeMassive,
}) {
  if (element != undefined)
    return (
      <div
        className={
          isSHOW
            ? isMonitor
              ? 'HARD_LobbuShablon_Block  USER_NoSelected'
              : 'HARD_LobbuShablon_Block USER_NoSelected'
            : 'HARD_LobbyShablon_Sofa HARD_LobbuShablon_None USER_NoSelected'
        }
      >
        <div
          className={
            !element.isEntered
              ? 'HARD_LobbyShablon pointer'
              : 'HARD_LobbyShablon'
          }
          onClick={() => {
            if (!element.isEntered) {
              EnterLobby(element, index);
            }
          }}
        >
          <div className='HARD_tokenAnd'>
            <div className='HARD_tokeninlobbyshablon gridcenter'>
              {imageFounded[index] && (
                <Image
                  className='tokenpng'
                  alt=''
                  onError={() => {
                    imageFounded[index] = false;
                    setimageFounded(imageFounded);
                  }}
                  src={`/tokens/${element.IERC20}.png`}
                  width={46}
                  height={46}
                />
              )}
              {!imageFounded[index] && (
                <Image
                  className='tokenpng'
                  src='/questionMark.png'
                  width={46}
                  height={46}
                />
              )}
            </div>
            <div className='gridcenter'>
              <div style={{ position: 'relative' }}>
                <div
                  className='HARD_circle'
                  style={{
                    backgroundImage:
                      activeMassive != 2
                        ? `conic-gradient(${
                            needLigth && filterModeScreen == 2
                              ? 'rgb(42 255 0)'
                              : '#fffeee'
                          } ${element.percent}%, #1e465a 0)`
                        : null,
                  }}
                >
                  {/* <div className="HARD_circle" style={{ backgroundImage: `conic-gradient("#ffffff" ${element.percent}%, #1e465a 0)` }}> */}
                  <div className='HARD_countOfPlayersImagetru'>
                    {activeMassive == 2 ? (
                      <div>
                        {element.isWin == 'Win' ? (
                          <Image src='/succses.png' width={40} height={40} />
                        ) : (
                          <Image src='/wrong.png' width={40} height={40} />
                        )}
                      </div>
                    ) : (
                      <Image src='/persons.png' width={40} height={40} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='HARD_predepositlobby'>
            <div className='HARD_depositlobby'>
              <div>
                Deposit: <strong>{element.deposit}</strong>
              </div>
              <div>
                Prize:{' '}
                <strong>
                  {`${element.deposit * element.countOfPlayers}`.substring(
                    0,
                    10
                  )}
                </strong>
              </div>
              {activeMassive == 2 ? (
                <div>
                  Index: <strong>{index + 1}</strong>
                </div>
              ) : (
                <div>
                  Players:{' '}
                  <strong>
                    {element.nowInLobby}/{element.countOfPlayers}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
