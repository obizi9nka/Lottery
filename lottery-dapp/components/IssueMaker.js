

export default function IssueMaker({ data, from, reason }) {

    let issue = ""

    if (reason == "execution reverted: ERC20: insufficient allowance")
        issue = "Need Approve"
    else if (data == "INSUFFICIENT_FUNDS")
        issue = "Not enough ETH on the wallet"

    else if (data == "UNSUPPORTED_OPERATION")
        issue = "Connect Wallet"

    else if (data == "ACTION_REJECTED")
        issue = "Transaction rejected"

    else if (data == "UNPREDICTABLE_GAS_LIMIT")
        issue = "Not enougth ETH on the wallet or token on balance"

    else if (data == "ACTION_REJECTED")
        issue = "Transaction rejected"

    else if (data == "ACTION_REJECTED")
        issue = "Transaction rejected"
    else
        issue = "Error not recognized"
    return issue
}
