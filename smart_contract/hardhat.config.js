//https://eth-rinkeby.alchemyapi.io/v2/I_3wwcsAFdqZ7BFk8FTxehrrTq1bYASF

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/I_3wwcsAFdqZ7BFk8FTxehrrTq1bYASF',
      accounts: ['9c29d79afb0ad69db2afc1c3666fbb0f39b1be97912535ea5d5259594b124647']
    }
  }
}

//0x4BC57e904a8D0b031FF8eEe779491b014be04d92