var Migrations = artifacts.require("./phonychain.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
