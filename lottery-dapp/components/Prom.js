const { ethers } = require('ethers');
import { useState, useEffect } from 'react';
import Lottery from '/blockchain/Lottery.json';
import {
  LotteryAddressETH,
  MudeBzNFTETH,
  LotteryAddressLocalhost,
  MudeBzNFTLocalhost,
  LotteryAddressBNB,
  MudeBzNFTBNB,
} from './Constants';
import Image from 'next/image';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useNetwork,
  defaultChains,
  useAccount,
  useContractWrite,
  useProvider,
  useSigner,
} from 'wagmi';
import IssueMaker from './IssueMaker';

export default function Prom({
  LOTTERY_ADDRESS,
  NFT_ADDRESS,
  address,
  shouldrevard,
  PromSet,
  PromInput,
  setPromInput,
  setPromSet,
  chainId,
  tymblerNaNetwork,
  settxData,
}) {
  const [prom, setprom] = useState('');

  const provider = useProvider();
  const { data } = useSigner();
  const signer = data;

  const [Position, setPosition] = useState({});
  const [isPositionReq, setisPositionReq] = useState(false);
  const [infinity, setinfinity] = useState(false);

  const setProm = async () => {
    try {
      settxData({
        isPending: true,
        result: null,
      });
      const contract = new ethers.Contract(
        LOTTERY_ADDRESS,
        Lottery.abi,
        signer
      );
      const tx = await contract.setPromSet(prom.toString());
      console.log(tx);
      await tx.wait();
      console.log(tx);
      const body = { address: address, PromSet: prom, chainId };
      await fetch('/api/promSet', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setPromSet(prom);
      document.getElementById('Prom').value = '';
      setProm('');
      settxData({
        isPending: true,
        result: true,
      });
    } catch (err) {
      console.log(err);
      let issue;
      if (err.reason == 'execution reverted: exist')
        issue = 'Promo code already taken';
      else issue = IssueMaker({ data: err.code, from: 'inputProm' });
      settxData({
        isPending: false,
        result: false,
        issue,
      });
    }
  };

  const inputProm = async () => {
    try {
      settxData({
        isPending: true,
        result: null,
      });
      const contract = new ethers.Contract(
        LOTTERY_ADDRESS,
        Lottery.abi,
        signer
      );
      const tx = await contract.setPromInput(prom.toString());
      await tx.wait();
      const body = { address: address, PromInput: prom, chainId };
      await fetch('/api/promInput', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setPromInput(prom);
      document.getElementById('Prom').value = '';
      setProm('');
      settxData({
        isPending: true,
        result: true,
      });
    } catch (err) {
      console.log(err.reason);
      let issue;
      if (err.reason == 'execution reverted: ne chei')
        issue = 'Promo code does not belong to anyone';
      else issue = IssueMaker({ data: err.code, from: 'inputProm' });
      settxData({
        isPending: false,
        result: false,
        issue,
      });
    }
  };

  useEffect(() => {
    setPosition({});
    setisPositionReq(false);
    setinfinity(false);
  }, [address, chainId]);

  const checkPosition = async () => {
    setinfinity(true);
    const body = { chainId };
    await fetch('/api/getAllusers', {
      method: 'POST',
      body: JSON.stringify(body),
    }).then(async (data) => {
      const temp = await data.json();
      const contract = new ethers.Contract(
        LOTTERY_ADDRESS,
        Lottery.abi,
        provider
      );
      const yourRevard = await contract.getshouldRevard(address);
      const position = 1;
      const gg = temp.map(async (element) => {
        return await new Promise(async (resolve) => {
          const revard = await contract.getshouldRevard(element.address);
          resolve(revard);
          // if (revard > yourRevard) { }
          // position++
          // console.log(parseInt(revard), element.address, parseInt(yourRevard))
        });
      });

      await Promise.all(gg).then((data) => {
        let all = 0;
        data.forEach((element) => {
          all++;
          if (element > yourRevard) position++;
        });
        const tem = {
          you: position,
          all,
        };
        setPosition(tem);
        setinfinity(false);
        setisPositionReq(true);
      });
    });
  };

  const [IsVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 0);
  }, []);

  return (
    <div className='PROM'>
      <div style={{ display: 'grid' }}>
        {IsVisible && (
          <div
            className={
              (PromInput == null && shouldrevard.isEnteredOnce == 0) ||
              PromSet == null
                ? 'PromButtons'
                : 'NoButtons'
            }
          >
            {PromSet == null && (
              <div className='promocods'>
                <button
                  onClick={() => {
                    if (prom.length > 0) setProm();
                  }}
                  className='setProm mybutton droch'
                >
                  Set your code
                </button>
              </div>
            )}

            {PromSet != null && (
              <div
                className='Promocode '
                style={{
                  color: 'purple',
                  height:
                    !(PromInput == null && shouldrevard.isEnteredOnce == 0) &&
                    PromSet != null
                      ? '80px'
                      : null,
                }}
              >
                {PromSet}
              </div>
            )}

            {((PromInput == null && shouldrevard.isEnteredOnce == 0) ||
              PromSet == null) && (
              <input
                className='input droch promocods'
                id='Prom'
                placeholder='Enter promo code'
                onChange={(e) => setprom(e.target.value)}
              />
            )}

            {PromInput == null && shouldrevard.isEnteredOnce == 0 && (
              <div className='promocods'>
                <button
                  onClick={() => {
                    if (prom.length > 0) inputProm();
                  }}
                  className='inputProm mybutton droch'
                >
                  Enter the code
                </button>{' '}
                : <div></div>
              </div>
            )}
            {PromInput != null && (
              <div className='promocods'>
                <div
                  className='Promocode '
                  style={{
                    color: 'aqua',
                    height:
                      !(PromInput == null && shouldrevard.isEnteredOnce == 0) &&
                      PromSet != null
                        ? '80px'
                        : null,
                    borderTop:
                      !(PromInput == null && shouldrevard.isEnteredOnce == 0) &&
                      PromSet != null
                        ? '3px solid rgb(41 39 39)'
                        : null,
                  }}
                >
                  {PromInput}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className='shouldRevard'>
        <div className='recive'>Your will receive</div>
        <div className='chifra'>
          <div
            className='rilchifra'
            style={{ color: 'purple', fontWeight: '400' }}
          >
            {PromInput != null
              ? shouldrevard.count - 1000 > 0
                ? shouldrevard.count - 1000
                : 0
              : `${shouldrevard.count}`}
            <div
              style={{
                color: 'aqua',
                marginLeft: PromInput != null ? '10px' : '',
              }}
            >{`${
              PromInput != null && shouldrevard.isEnteredOnce ? ' (+1000)' : ''
            }`}</div>
          </div>
        </div>
        <div className='position' onClick={() => checkPosition()}>
          <div className={infinity ? 'YourPosition' : null}>
            {!isPositionReq && <strong>Your Position: ???/???</strong>}
            {isPositionReq && (
              <strong>{`Your Position: ${Position.you}/${Position.all}`}</strong>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
