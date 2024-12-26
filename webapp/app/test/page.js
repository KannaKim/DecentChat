"use client"
import React, { useEffect } from 'react'
import { useState } from 'react';
export default function page() {
    const [count, setCount] = useState(0);
    const handleClick = () => {
        setCount((count)=>count + 1);
    };
    function checkVal(){
        console.log(count)
    }
    useEffect(()=>{
        setInterval(checkVal,1000)
    }
    ,[count])
    return (
    <div>
        <button onClick={handleClick}>{count}</button>
        <button onClick={checkVal}>clickmetocheck</button>
    </div>
  )
}
