import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect({onChange,options}) {
  const classes = useStyles();

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">Sound</InputLabel>
        <Select
          native
          onChange={handleChange}
          inputProps={{
            name: 'age',
            id: 'age-native-simple',
          }}
        >
          {options.map(op=>{
            return <option value={op}>{op}</option>
          })}
        </Select>
      </FormControl>
    </div>
  );
}
