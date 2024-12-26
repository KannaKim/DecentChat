// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Chat {
    string[] public chats;

    constructor(){
    }

    function push_chat(string memory chat) public{
        chats.push(chat);
    }
    function get_len() public view returns(uint256){
        return chats.length;
    }
    function get_chat(uint16 i) public view returns(string memory){
        return chats[i];
    }
}
