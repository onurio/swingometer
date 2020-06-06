import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width:window.innerWidth>768?'30vw':'70vw',
    margin: window.innerWidth<769?'2vh auto':'3vh auto',
  },
});

function valuetext(value) {
  return `${value}°C`;
}

export default function BpmSlider(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        BPM: {props.bpm/4}
      </Typography>
      <Slider
        onChange={props.handleChange}
        defaultValue={90}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        min={30}
        max={180}
      />
    </div>
  );
}