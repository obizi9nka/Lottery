
export default function Filter(lobbyes, settings) {

    let filtered = lobbyes

    if (settings.token !== undefined) {
        console.log("token")
        filtered = filtered.filter((element) => {
            return element.IERC20 === settings.token
        })
    }

    if (settings.UP) {
        if (settings.filterMode == 1) {
            console.log("deposit_up")
            filtered.sort((a, b) => {
                return a.deposit - b.deposit
            })
        }
        else if (settings.filterMode == 2) {
            console.log("percent_up222")
            filtered.sort((a, b) => {
                return a.percent - b.percent
            })
        }
        else if (settings.filterMode == 3) {
            console.log("countOfPlayers_up")
            filtered.sort((a, b) => {
                return a.countOfPlayers - b.countOfPlayers
            })
        }
    }
    else {
        if (settings.filterMode == 1) {
            console.log("deposit_down")
            filtered.sort((a, b) => {
                return b.deposit - a.deposit
            })
        }
        else if (settings.filterMode == 2) {
            console.log("percent_down")
            filtered.sort((a, b) => {
                return b.percent - a.percent
            })
        }
        else if (settings.filterMode == 3) {
            console.log("countOfPlayers_down")
            filtered.sort((a, b) => {
                return b.countOfPlayers - a.countOfPlayers
            })
        }
    }
    return filtered
}