import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classnames from 'classnames';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Moment from 'react-moment';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const styles = theme => ({
  expand: {
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    color: '#6c0e0f'
  }
});

class MessageReplyItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  handleExpandClick = (e) => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { classes, currentUser, note } = this.props;
    let body = note.body.replace(/&amp;/g, '&');
    let summary = null;
    body.length > 45 ? summary = body.substring(0, 45) + '...' : summary = body
    return (
        <div
          className={`note-container ${this.state.expanded ? 'expanded' : ''}`}
          onClick={this.state.expanded ? null : this.handleExpandClick}>
          <span className="note-avatar">
            <Avatar alt={`${note.authorFirstName} ${note.authorLastName}`} src={note.authorAvatarUrl} />
          </span>
          <span className="note-summary">
            {summary}
            <Moment format="M/D/YY">{note.postedOn}</Moment>
          </span>
          <span className="note-toggle">
            <IconButton
              name="expand-button"
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              {this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
            </IconButton>
          </span>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <div className="note-body">
              <span>{ReactHtmlParser(note.htmlBody)}</span>
            </div>
          </Collapse>
        </div>
    );
  }
}

MessageReplyItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    errors: state.errors,
    invitations: state.invitations,
    // add state obj for messageReplies
  };
}

export default compose(withStyles(styles), connect(mapStateToProps, { }), )(MessageReplyItem);
