import { useState, useEffect } from 'react';
const { ethers } = require('ethers');
import TokensBalanceShablon from './TokensBalanceShablon';
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

export default function Hars_Monitors({
  LOTTERY_ADDRESS,
  setENTERED,
  settxData,
  active,
  setActive,
  chainId,
  address,
  tymblerNaNetwork,
  txData,
}) {
  return (
    <div className=''>
      <div className='LeftMonitor USER_NoSelected'>
        <div className='HARD_lobbyCreate'>
          <input
            className='HARD_lobbyCreate_input HARD_ELEMENTS_LOBBY_CREATE'
            placeholder='Deposit'
          />
          <input
            className='HARD_lobbyCreate_input HARD_ELEMENTS_LOBBY_CREATE'
            placeholder='Players'
          />
          <button className='HARD_lobbyCreate_button HARD_ELEMENTS_LOBBY_CREATE pointer'>
            Create
          </button>
          <select
            onChange={(e) => settokenn(e.target.value)}
            className='HARD_lobbyCreate_select HARD_ELEMENTS_LOBBY_CREATE pointer'
          >
            {rokens &&
              rokens.map((element) => {
                if (element.symbol != 'Tokens')
                  return <option>{element.symbol}</option>;
              })}
          </select>
        </div>
      </div>
    </div>
  );
}
