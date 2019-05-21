import 'typeface-roboto';

import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';


const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    marginLeft: -12,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class App extends React.Component<{ classes: any }, { anchorEl: any }> {

  state = {
    anchorEl: null,
  };

  handleImageUpload = (event: any) => {
    const fd = new FormData();
    fd.append('image', event.target.files[0]);
    fetch('http://localhost:8080/classify', {
      method: 'POST',
      body: fd
    }).then((body) => console.log(body));
  }

  handleMenu = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state; 
    const open = Boolean(anchorEl);

    return (
      <React.Fragment>
        <div className={classes.root}>
          <AppBar color='default' position='static'>
            <Toolbar className='d-flex'>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Crystal Companion
              </Typography>
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <input className='mt-4' type="file" onChange={this.handleImageUpload} />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
