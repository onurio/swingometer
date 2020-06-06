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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { createMuiTheme,ThemeProvider } from '@material-ui/core/styles';



const initialState = {count: 0};

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Architects Daughter',
    body1:{
      fontWeight: 800,
      fontSize: 23,
    },
  },
  palette:{
    type: 'dark'
  }
});

function reducer(state, action) {
  switch (action.type) {
    case 'setCount':      
      return {count: action.count};    
    default:
      throw new Error();
  }
}


function App() { 
  const [amount,setAmount] = useState(50);
  const loop = useRef(null);
  const sampler = useRef(null);
  const [isPlaying,setIsPlaying] = useState(false);
  const [bpm,setBpm] = useState(360);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fixed,setFixed] = useState(true);
  const count = useRef(0);
  const canvasDiv = useRef(null);
  
  const handleChange =(e,value)=>{
    let newAmount = value;
    loop.current.dispose();
    loop.current = makeLoop(newAmount,sampler.current,isPlaying);
    setAmount(newAmount);
  }

  const drawme=(time,beat)=>{
    Tone.Draw.schedule(function(){
      dispatch({type:'setCount',count:count.current});
    }, time-0.05)
  }

  const makeLoop=(swing,sampler,playState)=>{
    const brazil = swing<51;     
    swing = (swing-50)/1000;
    let beat = 60/Tone.Transport.bpm.value;
    swing = swing*beat;    
    let beatBpmRatio = beat/bpm*400+5;
    let newloop;
    if(brazil){
      //Mirroring is close to hip hop
      newloop = new Tone.Loop(function(time){
        count.current = (count.current +1)%4;
        if(sampler.loaded){
          let newTime
          switch(count.current){
            case 0:
              sampler.triggerAttack('C5',time,0.7);
              drawme(time,0);
              break;
            case 1:
              newTime=time-((swing*beatBpmRatio)/2);
              sampler.triggerAttack('D5',newTime,0.7);
              drawme(newTime,1)
              break;
            case 2:
              newTime=time+swing*beatBpmRatio
              sampler.triggerAttack('E5',newTime,0.7);
              drawme(newTime,2)
              break;
            default:
              newTime=time+swing*(beatBpmRatio);
              sampler.triggerAttack('F5',newTime,0.7);
              drawme(newTime,3)
              break;
          }        
        }
      }, "4n");
    }else{
      // traditional jazz swing
      newloop = new Tone.Loop(function(time){
        count.current = (count.current +1)%4;
        if(sampler.loaded){
          let newTime
          switch(count.current){
            case 0:
              sampler.triggerAttack('C5',time,0.7);
              drawme(time,0);
              break;
            case 1:
              newTime=time+swing*(beatBpmRatio)/2;
              sampler.triggerAttack('D5',newTime,0.7);
              drawme(newTime,1)
              break;
            case 2:
              sampler.triggerAttack('E5',time,0.7);
              drawme(time,2)
              break;
            default:
              newTime=time+swing*(beatBpmRatio)/2;
              sampler.triggerAttack('F5',newTime,0.7);
              drawme(newTime,3)
              break;
          }        
        }
      }, "4n");      
    }
    if(playState){
      newloop.start(0);
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
      loop.current = makeLoop(50,sampler.current,false);
      loop.current.stop();
    }}).toMaster();
    let button = document.getElementById('playButton');
    canvasDiv.current.appendChild(button);
    // eslint-disable-next-line
  },[])



  const handleBpmChange=(e,value)=>{
    let newBpm = value*4;
    Tone.Transport.bpm.value = newBpm;
    if(isPlaying){
      loop.current.dispose();
      loop.current = makeLoop(amount,sampler.current,isPlaying);  
    }
    setBpm(newBpm);
  }


  const handleToggle=()=>{
    if(isPlaying){
      setIsPlaying(false);
      loop.current.stop('now');  
    }else{
      setIsPlaying(true);
      loop.current.cancel();
      loop.current.dispose();
      loop.current = makeLoop(amount,sampler.current,true);  
    }
  }


  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <div className='controls-container'>
        <DiscreteSlider fixed={fixed} handleChange={handleChange}/>
        <BpmSlider bpm={bpm} handleChange={handleBpmChange}/>
        <FormControlLabel
      className='switch'
      control={
        <Switch
          checked={fixed}
          onChange={e=>fixed?setFixed(false):setFixed(true)}
          name="fixed/free"
          color="primary"
          size='small'
        />
      }
      label="Fixed/Free"
      />
      <div id='playButton'>
      <Button
        variant="contained"
        color={isPlaying?"secondary":'primary'}
        onClick={e=>handleToggle()}
      >
      {!isPlaying?<PlayArrowIcon/>:<StopIcon/>}
      </Button>
      </div>
      </div>
      </ThemeProvider>
      <div style={{position:'relative'}} ref={canvasDiv}>
        <P5Wrapper   sketch={sketch} counter={state.count} swing={(amount-50)/100} />
      </div>
    </div>
  );
}

export default App;



