import { useState, useEffect } from 'react';
const { ethers } = require('ethers');
import TokensBalanceShablon from '../components/TokensBalanceShablon';
import A from '/blockchain/A.json';
import Lottery from '/blockchain/Lottery.json';
import {
  LotteryAddressETH,
  MudeBzNFTETH,
  LotteryAddressBNB,
  MudeBzNFTBNB,
  ETHid,
  BNBid,
} from './Constants';
import Image from 'next/image';
import Prom from './Prom';

import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  defaultChains,
  useAccount,
  useContractWrite,
  usePrepareContractWritde,
  useConnect,
  useDisconnect,
  useSigner,
  useNetwork,
  useSwitchNetwork,
  useProvider,
} from 'wagmi';
import TokensBalancePylt from './TokenBalancePylt';

export default function WalletAlert({
  LOTTERY_ADDRESS,
  NFT_ADDRESS,
  setENTERED,
  settxData,
  active,
  setActive,
  chainId,
  address,
  tymblerNaNetwork,
  txData,
}) {
  const [addTokenAddress, setaddTokenAddress] = useState('');
  const [isvalid, setvalid] = useState(false);

  const [rokens, setTokens] = useState(() => {
    const f = localStorage.getItem('tokensCount');
    const g = [];
    for (let i = 0; i < f; i++) {
      g.push({
        address: 0,
      });
    }
    return g;
  });

  const [PromSet, setPromSet] = useState(null);
  const [PromInput, setPromInput] = useState(null);

  const provider = useProvider();
  const { data } = useSigner();

  const { switchNetwork } = useSwitchNetwork();

  const [Mode, setMode] = useState(true);
  const [ModeMistery, setModeMistery] = useState(false);
  const [Mistery, setMistery] = useState('');

  const [TokenSelected, setTokenSelected] = useState();

  const [tokenTransfered, settokenTransfered] = useState(false);

  const [AutoEnter, setAutoEnter] = useState([]);
  const [ImageInAutoEnter, setImageInAutoEnter] = useState(0);

  const [shouldrevard, setshouldrevard] = useState({});
  const { disconnect } = useDisconnect();

  useEffect(() => {
    getTokens();
  }, [address, chainId, active]);

  useEffect(() => {
    checkValidAddress();
  }, [addTokenAddress]);

  const tryMistery = async () => {
    settxData({
      isPending: true,
      result: null,
    });
    try {
      const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data);
      const tx = await contract.tryMistery(Mistery);
      await tx.wait();
      const revard = await contract.getRevardGenius();
      if (revard == 0) {
        settxData({
          isPending: false,
          result: true,
        });
        setshouldrevard(shouldrevard + 10 ** 7);
      } else {
        settxData({
          isPending: false,
          result: false,
          issue: 'No this time',
        });
      }
      document.getElementById('Mistery').value = '';
      setMistery('');
    } catch (err) {
      console.log(err.reason);
      let issue;
      if (err.reason == 'execution reverted: Time') {
        issue = 'An hour must elapse between attempts';
      }
      if (err.reason == 'execution reverted: prize lost') {
        issue = 'Mistery solved';
      }
      settxData({
        isPending: false,
        result: false,
        issue,
      });
    }
  };

  const checkValidAddress = async () => {
    let flag = true;
    rokens.forEach((element) => {
      if (element.address == addTokenAddress) flag = false;
    });
    let sup, dec, symb;
    if (flag) {
      try {
        const contract = new ethers.Contract(addTokenAddress, A.abi, provider);
        sup = await contract.totalSupply(); //проверка на валидность
        try {
          dec = await contract.decimals();
        } catch {
          dec = 18;
        }

        try {
          symb = await contract.symbol();
        } catch {
          symb = '000';
        }

        console.log('valid');
      } catch (err) {
        console.log(err, 'no valid');
      }
    }

    sup != undefined ? setvalid(true) : setvalid(false);

    let _flag = false;
    if (sup != undefined) _flag = true;
    const data = {
      flag: _flag,
      symbol: symb,
      decimals: dec,
    };
    return data;
  };

  const getTokens = async () => {
    try {
      const body = { address, chainId };
      await fetch('/api/getUserTokens', {
        method: 'POST',
        body: JSON.stringify(body),
      }).then(async (data) => {
        const temp = await data.json();
        const objects = [];
        temp.forEach((element) => {
          objects.push({
            address: element.address,
            symbol: element.symbol,
            decimals: element.decimals,
            balance: undefined,
            isImageAdded: element.isImageAdded,
          });
        });
        setTokens(objects);
        console.log('tokensCount');
        localStorage.setItem('tokensCount', objects.length);
      });
    } catch (err) {
      console.log('getUserTokens', err);
    }
    ////////////////////////////////////////////////
    try {
      const body = { user: address, chainId };
      await fetch('/api/getUserData', {
        method: 'POST',
        body: JSON.stringify(body),
      }).then(async (data) => {
        const temp = await data.json();
        let set, In, Auto;
        if (chainId === ETHid) {
          set = temp.PromSetETH;
          In = temp.PromInputETH;
          Auto = temp.AutoEnterETH;
        } else {
          set = temp.PromSetBNB;
          In = temp.PromInputBNB;
          Auto = temp.AutoEnterBNB;
        }
        const contractLottery = new ethers.Contract(
          LOTTERY_ADDRESS,
          Lottery.abi,
          provider
        );

        try {
          const temp = parseInt(await contractLottery.getshouldRevard(address));
          const r = parseInt(
            await contractLottery.getcountOfLotteryEnter(address)
          );
          const tyy = {
            count: temp,
            isEnteredOnce: r,
          };
          setshouldrevard(tyy);
        } catch (err) {
          console.log('dich', err);
          setshouldrevard({
            count: 0,
            isEnteredOnce: undefined,
          });
        }

        if (Auto != null) {
          Auto = Auto.split('_');
          Auto.pop();
          Auto.sort((a, b) => {
            return a - b;
          });
          let id = 1001;
          try {
            id = parseInt(await contractLottery.getLotteryCount());
          } catch (err) {
            console.log(err);
          }

          Auto.forEach(async (element) => {
            if (element < id) {
              const body = { address, chainId, tokenId: element };
              Auto.splice(Auto.indexOf(element), 1);
              await fetch('/api/deleteFromAutoEnter', {
                method: 'POST',
                body: JSON.stringify(body),
              });
            }
          });
        }
        setPromSet(set);
        setPromInput(In);
        setAutoEnter(Auto);
      });
    } catch (err) {
      console.log(err);
    }
  };

  function deleteTokenFromFronend(address) {
    const temp = [];
    rokens.map((element) => {
      if (element.address != address) temp.push(element);
    });
    setTokens(temp);
  }

  const addToAutoEnter = async () => {
    settxData({
      isPending: true,
      result: null,
    });
    try {
      const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data);
      console.log('AutoEnter', AutoEnter);
      const tx = await contract.addToAutoEnter(AutoEnter);
      await tx.wait();
      const body = { address, chainId, tokenId: -1 };
      await fetch('/api/deleteFromAutoEnter', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setAutoEnter([]);
      settxData({
        isPending: false,
        result: true,
      });
      setENTERED(true);
      setTokens();
    } catch (err) {
      console.log(err);
      settxData({
        isPending: false,
        result: false,
      });
    }
  };

  const addToken = async () => {
    const n = new Promise((res) => {
      res(checkValidAddress());
    });
    n.then(async (result) => {
      if (result.flag) {
        const _addTokenAddress = addTokenAddress;
        const body = {
          address,
          addTokenAddress: _addTokenAddress,
          chainId,
          symbol: result.symbol,
          decimals: result.decimals,
        };
        const data = {
          address: _addTokenAddress,
          symbol: result.symbol,
          decimals: result.decimals,
          balance: 0,
        };
        setTokens([...rokens, data]);
        try {
          await fetch('/api/addToken', {
            method: 'PUT',
            body: JSON.stringify(body),
          }).then(() => {
            getTokens();
          });

          document.getElementById('inputToken').value = '';
          setaddTokenAddress();
        } catch (err) {
          console.log(err);
        }

        try {
          await fetch('/api/addTokenGlobal', {
            method: 'POST',
            body: JSON.stringify(body),
          });
        } catch {
          console.log(err);
        }
        setTokenSelected();
      }
      localStorage.setItem('addToken', 'true');
    });
  };

  const makePDF = async () => {
    let data;
    try {
      const body = { user: address, chainId };
      await fetch('/api/pdf', {
        method: 'POST',
        body: JSON.stringify(body),
      }).then(async (_data) => {
        data = await _data.json();
        console.log(data);
        pdfMake.createPdf(data).open();
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={active ? 'modall active' : 'modall'}
      onClick={() => {
        setActive(false);
        if (localStorage.getItem('overflow') != 'lock')
          document.body.style.overflow = ('overflow', 'auto');
        else document.body.style.overflow = ('overflow', 'hidden');
      }}
    >
      <div className='walletalert' onClick={(e) => e.stopPropagation()}>
        <div className='dopInfo' onClick={() => setMode(!Mode)} />

        {Mode && (
          <div className='' style={{ padding: '10px' }}>
            <div className='addToken'>
              {chainId == BNBid && (
                <div
                  className='misterySwitcher'
                  onClick={() => {
                    setModeMistery(!ModeMistery);
                  }}
                ></div>
              )}
              {!ModeMistery && (
                <div>
                  <input
                    className='input bigdinamic'
                    id='inputToken'
                    placeholder='Token Address'
                    onChange={(e) => setaddTokenAddress(e.target.value)}
                    style={{ color: isvalid ? 'white' : 'red' }}
                  />
                </div>
              )}
              {!ModeMistery && (
                <div>
                  <button onClick={() => addToken()} className='mybutton'>
                    Add new token
                  </button>
                </div>
              )}
              {ModeMistery && (
                <div>
                  <input
                    className='input bigdinamic'
                    id='Mistery'
                    placeholder='Your answer'
                    onChange={(e) => setMistery(e.target.value)}
                  />
                </div>
              )}
              {ModeMistery && (
                <div>
                  <button
                    onClick={() => tryMistery()}
                    className='mybutton'
                    style={{ minWidth: '123.41px' }}
                  >
                    Try
                  </button>
                </div>
              )}
            </div>
            <div className='areashablonbalance'>
              {rokens &&
                rokens.map((element, index) => (
                  <TokensBalanceShablon
                    LOTTERY_ADDRESS={LOTTERY_ADDRESS}
                    txData={txData}
                    NFT_ADDRESS={NFT_ADDRESS}
                    settxData={settxData}
                    rokens={rokens}
                    tymblerNaNetwork={tymblerNaNetwork}
                    tokenTransfered={tokenTransfered}
                    setTokenSelected={setTokenSelected}
                    TokenSelected={TokenSelected}
                    user={address}
                    element={element}
                    chainId={chainId}
                    settokenTransfered={settokenTransfered}
                    index={{ index, last: rokens.length - 1 }}
                    deleteTokenFromFronend={deleteTokenFromFronend}
                  />
                ))}
            </div>
            <div className='relative'>
              <button
                className='disconnect'
                onClick={() => {
                  disconnect();
                  setActive(false);
                  document.body.style.overflow = ('overflow', 'auto');
                }}
              >
                <div></div>
                <div>Disconnect</div>
              </button>
            </div>
          </div>
        )}

        {!Mode && (
          <div className='' style={{ padding: '10px' }}>
            <div className='areaProm'>
              <Prom
                LOTTERY_ADDRESS={LOTTERY_ADDRESS}
                NFT_ADDRESS={NFT_ADDRESS}
                shouldrevard={shouldrevard}
                settxData={settxData}
                address={address}
                PromSet={PromSet}
                PromInput={PromInput}
                setPromInput={setPromInput}
                setPromSet={setPromSet}
                chainId={chainId}
                tymblerNaNetwork={tymblerNaNetwork}
              />
            </div>
            <div className='underProm'>
              {AutoEnter && AutoEnter.length > 0 ? (
                <div className='AutoEnter'>
                  <div className='areaimageINAutoEnter'>
                    {AutoEnter.length > 1 ? (
                      <div
                        className='arow DEG180'
                        onClick={() => {
                          if (ImageInAutoEnter != 0) {
                            setImageInAutoEnter(ImageInAutoEnter - 1);
                          }
                        }}
                      >
                        <Image src={'/rigth.png'} width={30} height={30} />
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <div className='imageINAutoEnter'>
                      <Image
                        src={`/${
                          chainId == ETHid ? 'imagesETH' : 'imagesBNB'
                        }/${AutoEnter[ImageInAutoEnter]}.png`}
                        width={160}
                        height={160}
                        className='ff'
                      />
                    </div>
                    {AutoEnter.length > 1 ? (
                      <div
                        className='arow'
                        onClick={() => {
                          if (ImageInAutoEnter != AutoEnter.length - 1) {
                            setImageInAutoEnter(ImageInAutoEnter + 1);
                          }
                        }}
                      >
                        <Image src={'/rigth.png'} width={30} height={30} />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className='listAutoEnter'>
                    <div className='listAutoEnterA'>
                      {AutoEnter.map((e, i) => {
                        if (i != ImageInAutoEnter) {
                          return (
                            <div style={{ padding: '0px 2px' }}>{`${e}`}</div>
                          );
                        } else {
                          return (
                            <div
                              style={{ color: 'purple', padding: '0px 2px' }}
                            >{`${e}`}</div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  <div className='buttonAutoEnter'>
                    <button
                      className='mybutton'
                      onClick={() => addToAutoEnter()}
                    >
                      Pay {`${AutoEnter.length * 5} USDT`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className='AutoEnter' />
              )}
              <div className='yaxz'>
                <div className='PDF'>
                  <div>
                    <button className='mybutton' onClick={() => makePDF()}>
                      Lobby history
                    </button>
                  </div>
                </div>
                <div className='MudebzInfo'>
                  <div className='MudebzInfoElement'>
                    <Image src={'/discord.png'} width={45} height={45} />
                  </div>
                  <div className='MudebzInfoElement'>
                    <Image src={'/github.png'} width={40} height={40} />
                  </div>
                  {/* <div className="MudebzInfoElement">
                                        <Image src={"/instagram.png"} width={35} height={35} />
                                    </div>
                                    <div className="MudebzInfoElement">
                                        <Image src={"/vk.png"} width={35} height={35} />
                                    </div> */}

                  <div className='MudebzInfoElement'>
                    <Image src={'/twitter.png'} width={40} height={40} />
                  </div>

                  <div className='MudebzInfoElement'>
                    <Image src={'/telega.png'} width={40} height={40} />
                  </div>
                </div>
                <div className='SwitchNetwork'>
                  <div>
                    <button
                      className='mybutton'
                      onClick={() =>
                        switchNetwork(chainId == ETHid ? BNBid : ETHid)
                      }
                    >
                      Switch Network
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
