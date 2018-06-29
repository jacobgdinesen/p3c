module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
      local: {
          host: "127.0.0.1",
          port: 7545,
          network_id: "*" // Match any network id
      
          // optional config values:
          // gas
          // gasPrice
          // from - default address to use for any transaction Truffle makes during migrations
          // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
          //          - if specified, host and port are ignored.
      }
  }
};