import Head from 'next/head'
import Image from 'next/image'
import GreeterContract from '../blockchain/Greeter.js'
import styles from '../styles/Home.module.css'
const { ethers } = require("ethers");
import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css'

export default function Home() {
    return (
        <Head>
            <title>!Mudebz About</title>
            <meta name="description" content="An Ethereum Lottery dApp" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}