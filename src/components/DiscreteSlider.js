import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';



const useStyles = makeStyles((theme) => ({
  root: {
    width: window.innerWidth>768?'30vw':'70vw',
    margin: window.innerWidth<769?'2vh auto':'3vh auto',
    color: 'white !important',
  },
  margin: {
    height: theme.spacing(3),
  },

}));

const marks = [
  {
    value: 0,
    label: 'Br - 3',
  },
  {
    value: 1/6*100,
    label: 'Br - 2',
  },
  {
    value: 2/6*100,
    label: 'Br-1',
  },
  {
    value: 50,
    label: '0',
  },
  {
    value: 4/6*100,
    label: 'Us-1',
  },
  {
    value: 5/6*100,
    label: 'Us-2',
  },
  {
    value: 100,
    label: 'Us-3',
  }
];

function valuetext(value) {
  return `0°C`;
}

export default function DiscreteSlider(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-custom" gutterBottom>
        SWING
      </Typography>
      <Slider
        onChange={props.handleChange}
        defaultValue={50}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-custom"
        valueLabelDisplay="off"
        marks={marks}
        step={props.fixed?(1/6*100):undefined}
      
      />
    </div>
  );
}