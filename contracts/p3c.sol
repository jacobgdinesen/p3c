pragma solidity ^0.4.4;


contract p3c {

    uint constant private initialContractValue = 10 ether;
    uint8 constant private maxNumberOfMembers = 3;
    uint8 private numberOfAddedMembers = 0;

    address private owner;

    Member[maxNumberOfMembers] private members;

    event memberAdded(bool added, address addressAdded);
    event memberClaimed(bool claimed, address addressClaimed, uint amount);

    struct Member {
        address memberAddress;
        bool memberClaimed;
    }

    constructor() public payable {
        // constructor
        if(msg.value < initialContractValue){
            //revert-message not supported by web3 yet
            revert("you need more eth to create contract");
        }

        owner = msg.sender;
    }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }

    function addMember(address newMember) public onlyOwner {
        
        for(uint i = 0; i < members.length; i++)   {
            if(members[i].memberAddress == address(0x0)) {
                members[i] = Member(newMember, false);
                numberOfAddedMembers++;
                emit memberAdded(true, newMember);
                return;
            }
        }
        emit memberAdded(false, address(0x0));
    }

    function claim() public {
        for(uint i = 0; i < members.length; i++)   {
            if(members[i].memberAddress == msg.sender && members[i].memberClaimed == false && numberOfAddedMembers == maxNumberOfMembers) {
                uint share = initialContractValue/maxNumberOfMembers;
                msg.sender.transfer(share);
                members[i].memberClaimed == true;
                emit memberClaimed(true, msg.sender, share);
                return;
            }
        }
        emit memberClaimed(false, address(0x0), 0);
    }


      ////////////////////
     // TEST FUNCTIONS //
    ////////////////////

    function getNumberOfAddedMembers() public view returns(uint8) {
        return numberOfAddedMembers;
    }

    function addMemberTest(address newMember, uint index) public onlyOwner {
        members[index] = Member(newMember, false);
        emit memberAdded(true, newMember);
    }


    function getMember(uint index) public view returns(address) {
        return members[index].memberAddress;
    }

    function test() public pure returns(string) {
        return "TEST";
    }

    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getInitialContractValue() public pure returns(uint) {
        return initialContractValue;
    }

    function getMaxNumberOfMembers() public pure returns(uint) {
        return maxNumberOfMembers;
    }
}
