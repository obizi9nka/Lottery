

export default function WalletAlert({ active, setActive }) {

    return (
        <div className={active ? "modall active" : "modall"} onClick={() => setActive(false)}>
            <div className="walletalertt" onClick={e => e.stopPropagation()}>

            </div>
        </div>
    )
}