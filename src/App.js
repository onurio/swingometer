import React, { useState, useEffect } from 'react';
import './App.css';
import Tone from 'tone';
import click from './samples/ChopToksin.wav';

function App() { 
  const [amount,setAmount] = useState(50);
  const [sampler,setSampler] = useState(new Tone.Sampler({"C3" : click}).toMaster())
  const [loop,setLoop] = useState();
  const [bpm,setBpm] = useState(80);

  
  const handleChange =(e)=>{
    let newAmount = e.target.value;
    setLoop(updateLoop(newAmount));
    setAmount(newAmount);
  }



  useEffect(()=>{
    Tone.Transport.bpm.value = 80;
    Tone.Transport.start();
    var loop = new Tone.Loop(function(time){
      if(sampler.loaded){
        sampler.triggerAttack('C3',time);
        sampler.triggerAttack('C3',time+amount/100);
        // console.log(time);
        // sampler.triggerAttack('C3');   
      }
          
    }, "1m").start(0);
    setLoop(loop);

  },[])

  const updateLoop=(swing)=>{

    let decAmount = swing;
    decAmount = (decAmount-50)/1000;
    let beat = 60/Tone.Transport.bpm.value;
    
    if(loop){      
      loop.dispose();
      let newloop = new Tone.Loop(function(time){
        sampler.triggerAttack('C3',time,1);
        sampler.triggerAttack('C3',time+beat+decAmount*beat*5,0.2);
        sampler.triggerAttack('C3',time+beat*2+decAmount*beat*5,0.2);
        sampler.triggerAttack('C3',time+beat*3+decAmount*beat*4,0.7);
        
      }, "1m").start(0);
    return newloop;
    }
  }



  const handleBpmChange=e=>{
    let newBpm = e.target.value;
    setBpm(newBpm);
    Tone.Transport.bpm.value = newBpm;
    setLoop(updateLoop(amount));
  }




  return (
    <div className="App">
      <input value={amount} onChange={handleChange} type="range" min="1" max="100"  id="swing"/>
      <p>Swing amount</p>
      <input value={bpm} onChange={handleBpmChange} type="range" min="100" max="600"  id="bpm"/>
      <p>{bpm/4} BPM</p>
      <button onClick={e=>loop.stop('now')} >STOP</button>
      <button onClick={e=>loop.start()} >PLAY</button>
    </div>
  );
}

export default App;
