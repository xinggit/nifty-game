export const getProvider = (networkId) => {
  switch (networkId) {
    case '1':
      return 'https://mainnet.infura.io/';
    case '3':
      return 'https://ropsten.infura.io/';
    case '4':
      return 'https://rinkeby.infura.io/';
    case '42':
      return 'https://kovan.infura.io/';
    default:
      return 'http://localhost:8545/';
  }
}

export const getSimpleTokenAddress = (networkId) => {
  switch (networkId) {
    case '1':
      return '0x0';
    case '3':
      return '0x131855dda0aaff096f6854854c55a4debf61077a';
    case '4':
      return '0x0';
    case '42':
      return '0x0';
    case '1337':
      //* development at local, please update your local contract's address here
      return '0x5d2a39b00a574d89a162fa57f3cc205d9fcec812';
    case '1666355943721':
      //* development at local, please update your local contract's address here
      return '0x5d2a39b00a574d89a162fa57f3cc205d9fcec812';
    default:
      return '0x0';
  }
}

export const getCryptoHerosTokenAddress = (networkId) => {
  switch (networkId) {
    case '1':
      return '0x0';
    case '3':
      return '0xa82Bc392bF65d03A796E1666d27594fB31De4B93';
    case '4':
      return '0x0';
    case '42':
      return '0x0';
    case '1337':
      //* development at local, please update your local contract's address here
      return '0x5d2a39b00a574d89a162fa57f3cc205d9fcec812';
    case '1666355943721':
      //* development at local, please update your local contract's address here
      return '0x5d2a39b00a574d89a162fa57f3cc205d9fcec812';
    default:
      return '0x0';

  }
}

export const getCryptoHerosGameAddress = (networkId) => {
  switch (networkId) {
    case '1':
      return '0x0';
    case '3':
      return '0xb4FF27d8cD1C5b1e3D4BD8A8FFEBdA9BE9517a4b';
    case '4':
      return '0x0';
    case '42':
      return '0x0';
    case '1337':
      //* development at local, please update your local contract's address here
      return '0xEEDb5B347eee41F7626338c3353d3Bb598904863';
    case '1666355943721':
      //* development at local, please update your local contract's address here
      return '0xEEDb5B347eee41F7626338c3353d3Bb598904863';
    default:
      return '0x0';
  }
}

export const getCurrentAddress = (web3) => {
  if (web3 === null) return;
  return web3.eth.accounts[0];
}

export const getCurrentNetwork = (web3) => {
  if (web3 === null) return;
  return web3.version.network;
}
