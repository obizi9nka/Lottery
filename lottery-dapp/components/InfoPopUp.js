const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Image from 'next/image';
import Loader from "react-spinners/HashLoader";



export default function InfoPopUp({ data, settxData }) {

    const [needInfo, setNeedInfo] = useState(false)
    const [active, setActive] = useState(false)
    const [costil, setcostil] = useState(false)

    useEffect(() => {
        if (data.isPending != null || data.result != null) {
            setActive(true)
        }
        if (data.isPending != null && data.result == true) {
            setTimeout(() => {
                setActive(false)
            }, 6000)
            setTimeout(() => {
                settxData({
                    isPending: null,
                    result: null
                })
            }, 7000);
        }
        if (data.isPending == true && data.result == null)
            setNeedInfo(false)

    }, [data])

    const info = () => {
        if (data.result || needInfo) {
            setNeedInfo(false)
            setActive(false)
            setcostil(true)
            setTimeout(() => {
                settxData({
                    isPending: null,
                    result: null
                })
            }, 1000);
        }
        else if (!data.result) {
            setNeedInfo(true)
        }

    }

    return (
        <div>
            <div className={active ? 'InfoPopUp active' : "InfoPopUp"} onClick={() => {
                if (data.result != null) { info() }
            }}>
                <div className={'LOADER active'}>
                    {data.isPending && data.result == null ? <Loader loading={true} color={"white"} size={35} /> : data.result ? <Image src="/succses.png" width={35} height={35} /> : data.result == false ? <Image src="/wrong.png" width={35} height={35} /> : <div />}
                </div>
            </div>
            <div className={needInfo ? 'InfoPopUpinfo active' : "InfoPopUpinfo"} style={{ width: costil ? "220px" : null, color: costil ? "white" : null }}>
                <div className='dataInInfo'>{data.issue}</div>
            </div>
        </div >

    )
}

