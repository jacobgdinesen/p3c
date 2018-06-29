
var p3c = artifacts.require("./p3c.sol");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.

  var contractEther = 10;
  //deployer.deploy(p3c,{value:10000000000000000000});
  deployer.deploy(p3c,{value:web3.toWei(contractEther, "ether")});
};

