const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Chat", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployChat() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Chat = await ethers.getContractFactory("Chat");
    const chat = await Chat.deploy();

    return { chat };
  }

    describe("Deployment", function () {
    it("Should deploy", async function () {
        const { chat } = await loadFixture(deployChat);
        expect(chat).to.be.not.null;
    });
    })

    describe("Interaction", function () {
        it("Should push chat", async function () {
            const { chat } = await loadFixture(deployChat);
            let text = "hi"
            await chat.push_chat(text);
            let result = await chat.get_chat(0);
            expect(text).to.equal(result);
        });
        it("Should push consecutive chat", async function () {
            const { chat } = await loadFixture(deployChat);
            let text = "hi"
            await chat.push_chat(text);
            
            let text2 = "hello"
            await chat.push_chat(text2)
            let result = await chat.get_chat(1);
            expect(text2).to.equal(result);
        });
        it("Should have correct length", async function () {
          const { chat } = await loadFixture(deployChat);
          let text = "hi"
          await chat.push_chat(text);
          
          let text2 = "hello"
          await chat.push_chat(text2)
          let result = await chat.get_len();
          expect(result).to.equal(2);
      });
      })
});
