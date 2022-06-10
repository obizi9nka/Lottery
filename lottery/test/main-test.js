
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", async () => {

  let Lottery, lottery, A, a, owner, address1, address2;

  beforeEach(async () => {
    a = await hre.ethers.getContractFactory("A");
    A = await a.deploy("A", "A");
    await A.deployed();

    lottery = await hre.ethers.getContractFactory("Lottery");
    Lottery = await lottery.deploy(A.address, BigInt(5 * 10 ** 18));
    await Lottery.deployed();

    NFT = await hre.ethers.getContractFactory("MudebzNFT");
    MudebzNFT = await NFT.deploy(Lottery.address);
    await MudebzNFT.deployed();

    [owner, address1, address2, _] = await ethers.getSigners()

    await A.connect(owner).getTokens(BigInt(10000 * 10 ** 18))
    await A.connect(address1).getTokens(BigInt(10000 * 10 ** 18))
    await A.connect(address2).getTokens(BigInt(10000 * 10 ** 18))

    let balance = await A.balanceOf(owner.address)
    expect(balance).to.equal(BigInt(10000 * 10 ** 18))
    balance = await A.balanceOf(address1.address)
    expect(balance).to.equal(BigInt(10000 * 10 ** 18))
    balance = await A.balanceOf(address2.address)
    expect(balance).to.equal(BigInt(10000 * 10 ** 18))

    await A.connect(owner).approve(Lottery.address, BigInt(10000 * 10 ** 18))
    expect(await A.allowance(owner.address, Lottery.address)).to.equal(BigInt(10000 * 10 ** 18))
    await A.connect(address1).approve(Lottery.address, BigInt(10000 * 10 ** 18))
    expect(await A.allowance(address1.address, Lottery.address)).to.equal(BigInt(10000 * 10 ** 18))
    await A.connect(address2).approve(Lottery.address, BigInt(10000 * 10 ** 18))
    expect(await A.allowance(address2.address, Lottery.address)).to.equal(BigInt(10000 * 10 ** 18))

    await A.connect(owner).approve(MudebzNFT.address, BigInt(10000 * 10 ** 18))
    expect(await A.allowance(owner.address, Lottery.address)).to.equal(BigInt(10000 * 10 ** 18))
    await A.connect(address1).approve(MudebzNFT.address, BigInt(10000 * 10 ** 18))
    expect(await A.allowance(address1.address, Lottery.address)).to.equal(BigInt(10000 * 10 ** 18))
    await A.connect(address2).approve(MudebzNFT.address, BigInt(10000 * 10 ** 18))
    expect(await A.allowance(address2.address, Lottery.address)).to.equal(BigInt(10000 * 10 ** 18))

    await Lottery.connect(owner).addTokensToBalance(A.address, BigInt(9000 * 10 ** 18))
    expect(await Lottery.getBalance(A.address, owner.address)).to.equal(BigInt(9000 * 10 ** 18))
    await Lottery.connect(address1).addTokensToBalance(A.address, BigInt(9000 * 10 ** 18))
    expect(await Lottery.getBalance(A.address, address1.address)).to.equal(BigInt(9000 * 10 ** 18))
    await Lottery.connect(address2).addTokensToBalance(A.address, BigInt(9000 * 10 ** 18))
    expect(await Lottery.getBalance(A.address, address2.address)).to.equal(BigInt(9000 * 10 ** 18))

    await Lottery.connect(owner).setAdrressNFT(MudebzNFT.address)
    expect(await Lottery.getAdrressNFT()).to.equal(MudebzNFT.address)

  })
  it("Enter Lottery and Play", async () => {
    await Lottery.connect(owner).Play()
    expect(await Lottery.allowToNFT(1)).to.equal(owner.address)
    for (let i = 1; i < 10; i++) {
      await Lottery.connect(owner).Enter()
      expect(await Lottery.getPlayerByIndex(0)).to.equal(owner.address)
      await Lottery.connect(address1).Enter()
      expect(await Lottery.getPlayerByIndex(1)).to.equal(address1.address)
      await Lottery.connect(address2).Enter()
      expect(await Lottery.getPlayerByIndex(2)).to.equal(address2.address)

      await Lottery.connect(owner).Play()
      expect(await Lottery.getLotteryCount()).to.equal(i + 2)
    }

    expect(await Lottery.allowToNFT(1)).to.equal(owner.address)
  })

  it("Lobby create, enter and play", async () => {
    for (let i = 1; i < 4; i++) {
      await Lottery.connect(owner).createNewLobby(A.address, 1, 2)
      expect((await Lottery.getLobby(owner.address, i)).nowInLobby).to.equal(1)
    }
    for (let i = 1; i < 4; i++) {
      await Lottery.connect(address1).EnterLobby(owner.address, i)
      expect((await Lottery.getLobby(owner.address, i)).nowInLobby).to.equal(0)
    }
    for (let i = 4; i <= 12; i++) {
      await Lottery.connect(owner).createNewLobby(A.address, 1, 2)
      expect((await Lottery.getLobby(owner.address, i)).nowInLobby).to.equal(1)
      let player = (await Lottery.getLobby(owner.address, i)).players[1]
      expect(typeof players).to.equal("undefined")  //проверка на удаление всех предыдуших игроков из ново-созданного лобби
    }
  })

  it("Mint NFT", async () => {
    await Lottery.connect(address1).Enter()
    await Lottery.connect(owner).Play()
    expect(await Lottery.allowToNFT(1)).to.equal(address1.address)

    await Lottery.connect(address2).Enter()
    await Lottery.connect(owner).Play()
    expect(await Lottery.allowToNFT(2)).to.equal(address2.address)

    await Lottery.connect(address1).Enter()
    await Lottery.connect(owner).Play()
    expect(await Lottery.allowToNFT(3)).to.equal(address1.address)

    await MudebzNFT.connect(address2).MintMarten(2, { value: BigInt(32 * 10 ** 15) })
    expect(await MudebzNFT.ownerOf(2)).to.equal(address2.address)
    await MudebzNFT.connect(address1).MintMarten(1, { value: BigInt(32 * 10 ** 15) })
    expect(await MudebzNFT.ownerOf(1)).to.equal(address1.address)

    for (let i = 0; i < 7; i++) {
      await Lottery.connect(owner).Play()
    }

    expect(await Lottery.allowToNFT(3)).to.equal(owner.address)
    await MudebzNFT.connect(owner).MintMarten(3, { value: BigInt(32 * 10 ** 15) })
    expect(await MudebzNFT.ownerOf(3)).to.equal(owner.address)
    expect(await Lottery.allowToNFT(4)).to.equal(owner.address)

    await MudebzNFT.connect(owner).MintMarten(5, { value: BigInt(32 * 10 ** 15) })
    await MudebzNFT.connect(owner).MintMarten(6, { value: BigInt(32 * 10 ** 15) })
    await MudebzNFT.connect(owner).MintMarten(4, { value: BigInt(32 * 10 ** 16) })
    console.log(await MudebzNFT.gettokensMints())

    //MarkePlace

    await MudebzNFT.connect(address2).putOnSell(2, BigInt(1 * 10 ** 18))
    expect(await MudebzNFT.getCost(address2.address, 2)).to.equal(BigInt(1 * 10 ** 18))

    await MudebzNFT.connect(address2).removeFromSell(2)
    expect(await MudebzNFT.getCost(address2.address, 2)).to.equal(0)

    await MudebzNFT.connect(address2).putOnSell(2, BigInt(1 * 10 ** 18))
    expect(await MudebzNFT.getCost(address2.address, 2)).to.equal(BigInt(1 * 10 ** 18))

    await MudebzNFT.connect(address1).trigerSell(address2.address, 2, { value: BigInt(1 * 10 ** 18) })
    expect(await MudebzNFT.getCost(address2.address, 2)).to.equal(0)
    expect(await MudebzNFT.ownerOf(2)).to.equal(address1.address)
  })


})