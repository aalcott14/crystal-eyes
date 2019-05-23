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
    display: "flex"
  },
  grow: {
    flexGrow: 1,
    textAlign: "center" as "center"
  },
};

interface IProps {
  classes: Record<"root" | "grow", string>;
}

interface IState {
  userAnchorEl: HTMLElement;
  menuAnchorEl: HTMLElement
}

class NavBar extends React.Component<IProps, IState> {

  state: IState = {
    userAnchorEl: null,
    menuAnchorEl: null
  };

  handleUserMenu = (event: any) => {
    this.setState({ userAnchorEl: event.currentTarget });
  };

  handleUserClose = () => {
    this.setState({ userAnchorEl: null });
  }

  handleMenuMenu = (event: any) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  }

  render() {
    const { classes } = this.props;
    const { userAnchorEl, menuAnchorEl } = this.state; 
    const userOpen = Boolean(userAnchorEl);
    const menuOpen = Boolean(menuAnchorEl);
    return (
      <div className={classes.root}>
        <AppBar color='default' position='static'>
          <Toolbar className='d-flex'>
            <div>
              <IconButton 
                color="inherit"
                aria-owns={menuOpen ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenuMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={menuAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={menuOpen}
                onClose={this.handleMenuClose}
              >
                <MenuItem onClick={this.handleMenuClose}>Classify</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>Saved Crystals</MenuItem>
              </Menu>
            </div>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Crystal ♦ Companion
            </Typography>
            <div>
              <IconButton
                aria-owns={userOpen ? 'user-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleUserMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="user-appbar"
                anchorEl={userAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={userOpen}
                onClose={this.handleUserClose}
              >
                <MenuItem onClick={this.handleUserClose}>My account</MenuItem>
                <MenuItem onClick={this.handleUserClose}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(NavBar);