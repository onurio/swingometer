import React, { useEffect,useReducer } from 'react';
import './App.css';
import Tone from 'tone';
import click from './samples/ChopToksin.wav';



const makeLoop=(amount,sampler)=>{
  let decAmount = amount;
  let beat = 60/Tone.Transport.bpm.value;
  let newloop;
  decAmount = (decAmount-50)/1000;
  // newloop = new Tone.Loop((time)=>{
  //   if(sampler.loaded){
  //     sampler.triggerAttack('C3',time,1);
  //   // sampler.triggerAttack('C3',time+beat+decAmount*beat*6,0.2);
  //   // sampler.triggerAttack('C3',time+beat*2+decAmount*beat*6,0.2);
  //   // sampler.triggerAttack('C3',time+beat*3+decAmount*beat*5,0.7);
  //   }
  // },"1m").start(0);
  newloop = new Tone.Loop(function(time){
    if(sampler.loaded){      
      
      sampler.triggerAttack('C3');
      // console.log('something');
      
    // sampler.triggerAttack('C3',time+beat+decAmount*beat*6,0.2);
    // sampler.triggerAttack('C3',time+beat*2+decAmount*beat*6,0.2);
    // sampler.triggerAttack('C3',time+beat*3+decAmount*beat*5,0.7);
    }
  }, "1m").start(0);
  console.log('made loop');
  
  return newloop;
}

let sampler = new Tone.Sampler({"C3" : click}); 

const initialState = {bpm: 480, amount: 50, loop: makeLoop(50,sampler)};

function reducer(state, action) {
  // console.log(action.type);  
  let newState = {...state}; 
  const deleteLoop=(loop)=>{
    try{
      loop.dispose();
    }catch{
      console.log(loop);
    }
  }     
  switch (action.type) {
    case 'setBpm':
      newState.bpm = action.value;
      deleteLoop(state.loop);        
      newState.loop = makeLoop(state.amount,sampler);
      return newState;
    case 'setAmount':
      newState.amount = action.value;
      deleteLoop(state.loop);        
      newState.loop = makeLoop(action.value,sampler);
      return newState;
    case 'play':
      state.loop.start(0);
      return state;
    case 'stop':
      state.loop.stop();
      return state;
    default:
      throw new Error();
  }
}



const updateLoop=(currentState)=>{    
  console.log(currentState);
  
  let decAmount = currentState.amount;
  let beat = 60/currentState.bpm;
  decAmount = (decAmount-50)/1000;
  let newloop;
  // if(currentState.loop){
  //   currentState.loop.dispose();
  // }
  if(sampler){  
    if(sampler.loaded){
      newloop = new Tone.Loop((time)=>{
        console.log(time);
        
        sampler.triggerAttack('C3',time,1);
        // sampler.triggerAttack('C3',time+beat+decAmount*beat*6,0.2);
        // sampler.triggerAttack('C3',time+beat*2+decAmount*beat*6,0.2);
        // sampler.triggerAttack('C3',time+beat*3+decAmount*beat*5,0.7);
      },"1m").start(0);
      return newloop;
    }else{
      console.log('sampler not loaded');   
    }
  }else{
    console.log(sampler);
  }
  
}



function App() { 
  const [state, dispatch] = useReducer(reducer, initialState);

  
  const handleChange =(e)=>{
    let newAmount = e.target.value;
    // dispatch({type:'setLoop',value:updateLoop(newAmount)});
    dispatch({type:'setAmount',value:newAmount});
  }


  useEffect(()=>{
    // console.clear();
    Tone.Transport.bpm.value = state.bpm;
    Tone.Transport.start();
    // eslint-disable-next-line
  },[]);

  



  const handleBpmChange=e=>{
    let newBpm = e.target.value;
    Tone.Transport.bpm.value = newBpm;
    dispatch({type:'setBpm',value:newBpm});
    // dispatch({type:'setLoop'});
  }

  const stopLoop=()=>{
    state.loop.stop();
  }


  return (
    <div className="App">
      <input value={state.amount} onChange={handleChange} type="range" min="1" max="100"  id="swing"/>
      <p>Swing amount</p>
      <input value={state.bpm} onChange={handleBpmChange} type="range" min="120" max="800"  id="bpm"/>
      <p>{state.bpm/4} BPM</p>
      <button onClick={e=>dispatch({type:'stop'})} >STOP</button>
      <button onClick={e=>dispatch({type:'play'})} >PLAY</button>
    </div>
  );
}

export default App;
