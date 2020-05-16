import React, { useState, useEffect,useRef } from 'react';
import './App.css';
import Tone from 'tone';
import click from './samples/ChopToksin.wav';
import clave from './samples/Clave.wav';
import DiscreteSlider from './components/DiscreteSlider';
import BpmSlider from './components/BpmSlider';
import pan1 from './samples/pan1.wav';
import pan2 from './samples/pan2.wav';
import pan3 from './samples/pan3.wav';
import pan4 from './samples/pan4.wav';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './components/Sketch';
import { useReducer } from 'react';



// Tone.context.latencyHint = 'playback';
// Tone.context.latencyHint = "balanced";

const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: (state.count + 1)%4};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}


let counter=0;
function App() { 
  const [amount,setAmount] = useState(50);
  // const [loaded,setLoaded] = useState(false);
  const loop = useRef(null);
  const sampler = useRef(null);
  const [bpm,setBpm] = useState(360);
  const [state, dispatch] = useReducer(reducer, initialState);

  
  const handleChange =(e,value)=>{
    
    let newAmount = value;
    loop.current.dispose();
    loop.current = makeLoop(newAmount,sampler.current);
    
    setAmount(newAmount);

  }

  const drawme=(time)=>{
    Tone.Draw.schedule(function(){
      //this callback is invoked from a requestAnimationFrame
      //and will be invoked close to AudioContext time
      dispatch({type:'increment'});
    }, time-0.05)
  }

  const makeLoop=(swing,sampler)=>{
    const brazil = swing<51;     
    swing = (swing-50)/1000;
    let beat = 60/Tone.Transport.bpm.value;
    swing = swing*beat;    
    let beatBpmRatio = beat/bpm*400+5;
    let newloop;
    if(brazil){
      //Mirroring is close to hip hop
      newloop = new Tone.Loop(function(time){
        counter=(counter+1)%4;
        if(sampler.loaded){
          let newTime
          switch(counter){
            case 0:
              sampler.triggerAttack('C5',time,0.7);
              drawme(time);
              break;
            case 1:
              newTime=time-((swing*beatBpmRatio)/2);
              sampler.triggerAttack('D5',newTime,0.7);
              drawme(newTime)
              break;
            case 2:
              newTime=time+swing*beatBpmRatio
              sampler.triggerAttack('E5',newTime,0.7);
              drawme(newTime)
              break;
            default:
              newTime=time+swing*(beatBpmRatio);
              sampler.triggerAttack('F5',newTime,0.7);
              drawme(newTime)
              break;
          }        
        }
      }, "4n").start(0);
    }else{
      // traditional jazz swing
      // newloop = new Tone.Loop(function(time){
      //   if(sampler.loaded){        
      //     sampler.triggerAttack('C5',time,1);
      //     sampler.triggerAttack('D5',time+beat+swing*beatBpmRatio,0.6);
      //     sampler.triggerAttack('E5',time+beat*2,0.2);
      //     sampler.triggerAttack('F5',time+beat*3+swing*(beatBpmRatio),0.7);   
      //   }
      // }, "1m").start(0);
      newloop = new Tone.Loop(function(time){
        counter=(counter+1)%4;
        if(sampler.loaded){
          let newTime
          switch(counter){
            case 0:
              sampler.triggerAttack('C5',time,0.7);
              drawme(time);
              break;
            case 1:
              newTime=time+swing*(beatBpmRatio);
              sampler.triggerAttack('D5',newTime,0.7);
              drawme(newTime)
              break;
            case 2:
              sampler.triggerAttack('E5',time,0.7);
              drawme(time)
              break;
            default:
              newTime=time+swing*(beatBpmRatio);
              sampler.triggerAttack('F5',newTime,0.7);
              drawme(newTime)
              break;
          }        
        }
      }, "4n").start(0);
      
      
    }
    
    
    return newloop;
  }


  

  useEffect(()=>{
    Tone.Transport.bpm.value = 360;
    Tone.Transport.start();
    sampler.current = new Tone.Sampler({
      "C3" : click,
      "C4": clave,
      'C5': pan1,
      'D5': pan2,
      'E5': pan3,
      'F5': pan4
    },{onload:()=>{
      // setLoaded(true);
      loop.current = makeLoop(50,sampler.current);
      loop.current.stop();
    }}).toMaster();
    // eslint-disable-next-line
  },[])



  const handleBpmChange=(e,value)=>{
    let newBpm = value*4;
    Tone.Transport.bpm.value = newBpm;
    loop.current.dispose();
    loop.current = makeLoop(amount,sampler.current);
    setBpm(newBpm);
  }




  return (
    <div className="App">
      {/* <input value={amount} onChange={handleChange} type="range" min="1" max="100"  id="swing"/> */}
      <div style={{width:'100vw',display:'flex',justifyContent:'center',alignContent:'center',flexDirection:'column'}}>
        <DiscreteSlider handleChange={handleChange}/>
        <BpmSlider handleChange={handleBpmChange}/>
      </div>
      <button onClick={e=>loop.current.stop('now')} >STOP</button>
      <button onClick={e=>{
        loop.current.cancel();
        loop.current.dispose();
        loop.current = makeLoop(amount,sampler.current);
        }} >PLAY</button>
      <P5Wrapper sketch={sketch} counter={state.count} swing={(amount-50)/100} />
    </div>
  );
}

export default App;



