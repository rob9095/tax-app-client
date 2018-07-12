import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2,
  },
});

class RemoveViewConfirmation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
    }
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
    this.props.onDelete();
    event.stopPropagation();
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <Tooltip title="Delete">
          <IconButton
            onClick={this.handleClick}
            aria-label="Delete"
            >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography className={classes.typography}>Are you sure?</Typography>
        </Popover>
      </div>
    );
  }
}

RemoveViewConfirmation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RemoveViewConfirmation);
