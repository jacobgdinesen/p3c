var p3c = artifacts.require("./p3c.sol");

contract('test_p3c', function(accounts) {
  
    var initialcontractValue;
    var maxNumberOfMembers;

    before('setup contract once', function () {
        return p3c.deployed().then(function(instance) {
            return initialContractValue = instance.getInitialContractValue.call();
        }).then(function(result){
            initialContractValue = result;
            console.log("initialcontractValue = ");
            console.log(web3.fromWei(initialContractValue, 'ether'));
        });
    });

    before('setup contract once', function () {
        return p3c.deployed().then(function(instance) {
            return instance.getMaxNumberOfMembers.call();
        }).then(function(result){
            maxNumberOfMembers = result;
            console.log("maxNumberOfMembers = ");
            console.log(maxNumberOfMembers);
        });
    });

      ///////////////////////////////////
     // TEST FOR DEPLOYMENT AND OWNER //
    ///////////////////////////////////

    it("should NOT deploy contract (not enough funds)", function() {
        return p3c.deployed({from:web3.eth.accounts[0], value:web3.toWei(9)}).then(function(instance){
            assert.isTrue(false);
        }).catch(function(){
            assert.isTrue(true);
        });  
    });

    it("should deploy contract", function() {        
        return p3c.deployed({from:web3.eth.accounts[0], value:web3.toWei(initialContractValue)}).then(function(instance){
            assert.isTrue(true);
        }).catch(function(){
            assert.isTrue(false);
        });  
    });

    it("should return the owner address of the contract and check that it's equal to accounts[0]", function() {
        return p3c.deployed().then(function(instance) {
            return instance.getOwner.call();
        }).then(function(owner){
            assert.equal(owner, accounts[0],"owner is NOT accounts[0]");
        });
    });

    it("should return the owner address of the contract and check that it's NOT equal to accounts[1]", function() {
        return p3c.deployed().then(function(instance) {
            return instance.getOwner.call();
        }).then(function(owner){
            assert.notEqual(owner, accounts[1],"owner is NOT accounts[1]");
        });
    });

      //////////////////////////////////////////////
     // TEST FOR ADDING MEMBERS AND CLAIMING ETH //
    //////////////////////////////////////////////

    it("should be unable to claim (from accounts[0]) since no members have been added", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.claim();
        }).then(function(result){
            assert.equal(false, result.logs[0].args.claimed);
            assert.equal("0x0000000000000000000000000000000000000000", result.logs[0].args.addressClaimed);
        }).catch(function(result){
            console.log("CLAIM TEST FAILED");
        });
    });

    it("should return 0", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.getNumberOfAddedMembers.call();
        }).then(function(result){
            assert.equal(result, 0);
        });
    });

    it("should add a member (accounts[1])", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.addMember(web3.eth.accounts[1]);
        }).then(function(result){
            //console.log("then added=");
            //console.log(result.logs[0].args.added);
            assert.equal(true, result.logs[0].args.added);
            assert.equal(web3.eth.accounts[1], result.logs[0].args.addressAdded);
        });
    });

    it("should return 1", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.getNumberOfAddedMembers.call();
        }).then(function(result){
            assert.equal(result, 1);
        });
    });

    it("should be unable to claim (from accounts[1]) because just one member have been added (need 3)", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.claim({from:web3.eth.accounts[1]});
        }).then(function(result){
            assert.equal(false, result.logs[0].args.claimed);
            assert.equal("0x0000000000000000000000000000000000000000", result.logs[0].args.addressClaimed);
        }).catch(function(result){
            console.log("CLAIM TEST FAILED");
        });
    });

    it("should add a member (accounts[2])", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.addMember(web3.eth.accounts[2]);
        }).then(function(result){
            //console.log("then added=");
            //console.log(result.logs[0].args.added);
            assert.equal(true, result.logs[0].args.added);
            assert.equal(web3.eth.accounts[2], result.logs[0].args.addressAdded);
        });
    });

    it("should return 2", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.getNumberOfAddedMembers.call();
        }).then(function(result){
            assert.equal(result, 2);
        });
    });

    it("should be unable to claim (from accounts[2]) because just two members have been added (need 3)", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.claim({from:web3.eth.accounts[2]});
        }).then(function(result){
            assert.equal(false, result.logs[0].args.claimed);
            assert.equal("0x0000000000000000000000000000000000000000", result.logs[0].args.addressClaimed);
        }).catch(function(result){
            console.log("CLAIM TEST FAILED");
        });
    });

    it("should add a member (accounts[8])", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.addMember(web3.eth.accounts[8]);
        }).then(function(result){
            assert.equal(true, result.logs[0].args.added);
            assert.equal(web3.eth.accounts[8], result.logs[0].args.addressAdded);
        });
    });

    it("should return 3", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.getNumberOfAddedMembers.call();
        }).then(function(result){
            assert.equal(result, 3);
        });
    });

    it("should NOT add a member since we reached max", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.addMember(web3.eth.accounts[8]);
        }).then(function(result){
            assert.isTrue(false);
        }).catch(function(result){
            assert.isTrue(true);
        });
    });

    it("should still return 3", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.getNumberOfAddedMembers.call();
        }).then(function(result){
            assert.equal(result, 3);
        });
    });

    it("should return first member (accounts[1]", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.getMember.call(0);
        }).then(function(result){
            assert.equal(result, web3.eth.accounts[1]);
        });
    });

    it("should return second member (accounts[2]", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.getMember.call(1);
        }).then(function(result){
            assert.equal(result, web3.eth.accounts[2]);
        });
    });

    it("should return third member (accounts[8]", function() {  
        return p3c.deployed().then(function(instance) {
            return instance.getMember.call(2);
        }).then(function(result){
            assert.equal(result, web3.eth.accounts[8]);
        });
    });

    it("should be able to claim (from accounts[1]) since all three members have been added", function() {
        
        var beforeClaim = web3.eth.getBalance(accounts[1]);
        
        return p3c.deployed().then(function(instance) {
            return instance.claim({from:web3.eth.accounts[1]});
        }).then(function(result){
            
            
            var share = initialContractValue/maxNumberOfMembers;
            var afterClaim = web3.eth.getBalance(accounts[1]);
/*
            console.log("beforeClaim="+beforeClaim);
            console.log("beforeClaim in eth="+web3.fromWei(beforeClaim));

            console.log("initialContractValue="+initialContractValue);
            console.log("initialContractValue in eth = "+web3.fromWei(initialContractValue, 'ether'));

            console.log("maxNumberOfMembers="+maxNumberOfMembers);

            console.log("share="+share);
            console.log("share in eth = "+web3.fromWei(share, "ether"));

            console.log("afterClaim="+afterClaim);
            console.log("afterClaim in eth = "+web3.fromWei(afterClaim, 'ether'));
*/            

            assert.equal(true, result.logs[0].args.claimed, "event log claimed");
            assert.equal(web3.eth.accounts[1], result.logs[0].args.addressClaimed, "by correct address");
            assert.isAbove(afterClaim.toNumber(), beforeClaim, "address balance is greater after claim");

    /*    }).catch(function(result){
            console.log("CLAIM TEST FAILED");
            assert.isTrue(false);
    */
        });
    });

    it("should be able to claim (from accounts[2]) since all three members have been added", function() {
        
        var beforeClaim = web3.eth.getBalance(accounts[2]);
        
        return p3c.deployed().then(function(instance) {
            return instance.claim({from:web3.eth.accounts[2]});
        }).then(function(result){
            var share = initialContractValue/maxNumberOfMembers;
            var afterClaim = web3.eth.getBalance(accounts[2]);           
            assert.equal(true, result.logs[0].args.claimed, "event log claimed");
            assert.equal(web3.eth.accounts[2], result.logs[0].args.addressClaimed, "by correct address");
            assert.isAbove(afterClaim.toNumber(), beforeClaim, "address balance is greater after claim");
        });
    });

    it("should NOT be able to claim (from accounts[4]) since accounts[4] has no business with our shit!", function() {
        
        var beforeClaim = web3.eth.getBalance(accounts[4]);
        
        return p3c.deployed().then(function(instance) {
            return instance.claim({from:web3.eth.accounts[4]});
        }).then(function(result){
            assert.isTrue(false, "wtf is account[4] in our shit?!");
        }).catch(function(result){
            assert.isTrue(true, "mind your own business accounts[4]");
        });
    });

    it("should be able to claim (from accounts[8]) since all three members have been added", function() {
        
        var beforeClaim = web3.eth.getBalance(accounts[8]);
        
        return p3c.deployed().then(function(instance) {
            return instance.claim({from:web3.eth.accounts[8]});
        }).then(function(result){
            var share = initialContractValue/maxNumberOfMembers;
            var afterClaim = web3.eth.getBalance(accounts[8]);           
            assert.equal(true, result.logs[0].args.claimed, "event log claimed");
            assert.equal(web3.eth.accounts[8], result.logs[0].args.addressClaimed, "by correct address");
            assert.isAbove(afterClaim.toNumber(), beforeClaim, "address balance is greater after claim");
        });
    });
});
