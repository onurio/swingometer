import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import FileCopy from '@material-ui/icons/FileCopy';
import { blue } from '@material-ui/core/colors';
import CodeIcon from '@material-ui/icons/Code';
import ShareIcon from '@material-ui/icons/Share';

import FacebookIcon from '@material-ui/icons/Facebook';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  button:{
      marginTop: '-15vh'
  }
});

const Copy=(text)=>{
    alert('copied: '+text);

    const el = document.createElement('textarea');
    el.value = text;
    let node = document.getElementById('simple-dialog-title');
    node.appendChild(el);
    el.select(); 
    el.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand('copy');
    node.removeChild(el);
}

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {     
    onClose();
    if(value==='copy'){
        Copy('https://swingo-meter.web.app/');
    }else if(value==='embed'){
        Copy('<iframe style="width:500px;height:750px;border:none" src="https://swingo-meter.web.app/" scrolling="no">This browser does not support Iframe</iframe>')
    }else{
        window.open('https://www.facebook.com/sharer/sharer.php?u=example.org');
    }
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Share with a friend, or embed it on your website!</DialogTitle>
      <List>
        <ListItem button onClick={() => handleListItemClick('copy')} key={'copy'}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <FileCopy />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={'Copy Link'} />
          </ListItem>
        <ListItem autoFocus button onClick={() => handleListItemClick('embed')}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <CodeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Get embed code!" />
        </ListItem>
        <ListItem autoFocus button onClick={() => handleListItemClick('facebook')}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <FacebookIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Share on facebook" />
        </ListItem>
      </List>
      
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <br />
      <Button size='large' className={classes.button} variant='contained' color="primary" onClick={handleClickOpen}>
         <ShareIcon/>&nbsp;SHARE
      </Button>
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
}