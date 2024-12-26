"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import Web3 from 'web3';
import ChatModule from '../ChatModule#Chat.json'

var contract_address = require("../contract").address
var provider_url = require("../contract").provider

export default function Home() {
  let CHAT_HIST_MAX_LEN = 20
  let init_arr = Array(CHAT_HIST_MAX_LEN).fill("loading chat...")
  
  let [chat_len,set_chat_len]=  useState(null)
  let [msg,set_msg] = useState("")
  let [chat_hist,set_chat_hist] = useState(init_arr)


  async function connect_wallet(){
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Accounts now exposed
        return web3;
      } catch (error) {
        console.error(error);
      }
    }
    // Fallback to localhost; use dev console port by default...
    else {
      return null;
    }
  }
  async function fetch_len(){
    let abi = ChatModule.abi
    let web3 = new Web3(provider_url)
    var contract = new web3.eth.Contract(abi,contract_address)
    let len = await contract.methods.get_len().call()
    fetch_chat(len)
    set_chat_len(len)
  }
  async function fetch_chat(len){
    console.log("fetching chat: len: "+len)
    let abi = ChatModule.abi
    let web3 = new Web3(provider_url)
    var contract = new web3.eth.Contract(abi,contract_address)
    // let len = await contract.methods.get_len().call()
    if(len <= CHAT_HIST_MAX_LEN){
      let arr = Array(len).fill("loading chat...")
      for(let i=0;i<len;i++){
        arr[i] = await contract.methods.get_chat(i).call()
      }
      set_chat_hist(arr)
    }
    else{
      let arr = Array(CHAT_HIST_MAX_LEN).fill(0)
      for(let i=0;i<CHAT_HIST_MAX_LEN;i++){ //then fetch last n msg
        arr[i] = await contract.methods.get_chat(chat_len-i-1).call()
      }
      set_chat_hist(arr)
    }
  }

  async function chatSent(){
    set_msg("")
    console.log("chat clicked")
    let web3 = await connect_wallet()
    if(web3==null){
      console.log("couldn't connect to the wallet")
    }
    let accounts = await web3.eth.getAccounts()
    let defaultAcct = accounts[0]
    console.log("defaultacc: "+defaultAcct)
    let contract = new web3.eth.Contract(ChatModule.abi, contract_address)
    try{
      await contract.methods.push_chat(msg).send({from:defaultAcct})
    }
    catch(err){
      console.error(err)
    }
  }
  



  useEffect(()=>{
    // connect_wallet()
    fetch_len()
    setInterval(fetch_len,1000)
  },[])
  return (
    <div className="flex flex-col justify-center gap-1 mt-3">
      <div className="mt-3 flex flex-col gap-3">
        {chat_hist.map((chat,i)=>
          <p key={i} className="m-auto place-self-start max-w-sm bg-white p-2 rounded">{chat}</p>
        )}
      </div>
      <div className="mt-3 flex m-auto w-full justify-center gap-3">
        <input className="w-10/12 rounded p-3" type="text" name="myInput" onChange={(e)=>{set_msg(e.target.value)}}></input>
        <button className="rounded bg-white p-4" type="button" onClick={chatSent}>send</button>
      </div>
    </div>
  );
}
