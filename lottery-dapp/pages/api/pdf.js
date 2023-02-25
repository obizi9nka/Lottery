import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

export default async function pdf(req, res) {
  const { user, chainId } = JSON.parse(req.body);

  let Header = [
    { text: '№', style: 'tableHeader' },
    { text: 'Creator', style: 'tableHeader' },
    { text: 'Token', style: 'tableHeader' },
    { text: 'Winner', style: 'tableHeader' },
    { text: 'Deposit', style: 'tableHeader' },
    { text: 'Players', style: 'tableHeader' },
  ];

  let HeaderTokens = [
    { text: '№', style: 'tableHeader' },
    { text: 'Token', style: 'tableHeader' },
    { text: 'Result', style: 'tableHeader' },
  ];

  let allLobbyes;
  if (chainId == ETHid) allLobbyes = await prisma.lobbyHistoryETH.findMany();
  else allLobbyes = await prisma.lobbyHistoryBNB.findMany();

  let i = 0;
  const tokens = await prisma.tokens.findMany({
    select: {
      symbol: true,
      address: true,
    },
  });
  const allLength = tokens.length;
  const gigadata = {
    LobbyCount: 0,
    userTokens: [],
    wins: 0,
    forPDF: [],
  };

  const body = allLobbyes.map((element) => {
    if (element.players.indexOf(user) !== -1) {
      const fillColor = element.winner === user ? '#8fbe6b' : null;
      let length = gigadata.userTokens.length;
      let Symbol;
      for (let j = 0; j < length; j++) {
        if (element.IERC20 == gigadata.userTokens[j].tokendata.address) {
          gigadata.userTokens[j].count++;
          gigadata.userTokens[j].result +=
            fillColor == null
              ? -1 * parseFloat(element.deposit)
              : parseFloat(element.deposit);
          Symbol = gigadata.userTokens[j].tokendata.symbol;
          break;
        }
      }
      if (Symbol == undefined) {
        for (let j = 0; j < allLength; j++) {
          if (element.IERC20 == tokens[j].address) {
            Symbol = tokens[j].symbol;
            gigadata.userTokens.push({
              tokendata: tokens[j],
              count: 1,
              result:
                fillColor == null
                  ? -1 * parseFloat(element.deposit)
                  : parseFloat(element.deposit),
            });
            break;
          }
        }
      }
      if (fillColor != null) gigadata.wins++;

      const temp = [
        { text: `${++i}`, fillColor },
        { text: element.creator, fillColor },
        { text: element.IERC20, fillColor },
        { text: element.winner, fillColor },
        { text: element.deposit.toString() + ` (${Symbol})`, fillColor },
        { text: `${element.countOfPlayers}`, fillColor },
      ];
      return temp;
    }
  });

  gigadata.LobbyCount = i;
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 0],
    },
    subheader: {
      alignment: 'center',
      fontSize: 10,
      margin: [0, 0, 0, 30],
    },
    tableExample: {
      fontSize: 8,
      alignment: 'center',
      margin: [0, 0, 0, 30],
    },
    tableHeader: {
      bold: true,
      fontSize: 10,
      fillColor: '#403e3f',
      color: 'white',
    },
  };
  gigadata.userTokens.forEach((element, index) => {
    const bodytoken = [
      { text: `${++index}` },
      { text: element.tokendata.symbol },
      { text: element.result },
    ];
    gigadata.forPDF.push(bodytoken);
  });

  pdf = {
    pageOrientation: 'landscape',
    content: [
      {
        style: 'tableExample',
        table: {
          dontBreakRows: true,
          widths: [25, 200, 200, 200, 40, 40],
          headerRows: 1,
          body: [Header, ...body],
        },
      },
      {
        style: 'subheader',
        table: {
          dontBreakRows: true,
          widths: [25, 60, 60],
          headerRows: 1,
          body: [HeaderTokens, ...gigadata.forPDF],
        },
      },
    ],
    styles: styles,
  };

  console.log(gigadata);
  res.json(pdf);
}
