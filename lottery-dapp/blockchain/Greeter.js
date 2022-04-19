
const GreeterABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_greeting",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "greet",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_greeting",
                "type": "string"
            }
        ],
        "name": "setGreeting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const GreeterContract = ethers => {
    //const provider = new ethers.providers.Web3Provider(window.ethereum)
    const provider = ethers.getDefaultProvider("http://localhost:8545");
    //console.log('data :', provider)
    return new ethers.Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        GreeterABI,
        provider
    )
}

export default GreeterContract