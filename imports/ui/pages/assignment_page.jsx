import React from 'react'
import { AssignmentSummaryList } from '../components/assignment_summary_list'
import { Assignments } from '../../api/assignments/assignments.js'
import { AssignmentSummary } from '../components/assignment_summary'
import { FlowRouter } from 'meteor/kadira:flow-router'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';

export class AssignmentPage extends React.Component {
  constructor(props) {
    super(props)
    console.log("props", props)
    this.handleTouchTapLeftIconButton = this.handleTouchTapLeftIconButton.bind(this)
    this.onChangeAssignment = this.onChangeAssignment.bind(this)
    this.state = { navDrawerOpen: false }
  }

  componentWillReceiveProps({ loading, assignment }) {
    // redirect / to an assignment if possible
    // TODO this is not the right way to do this and there may not be an assignment
    if (!loading && !assignment) {
      const newAssignment = Assignments.findOne()
      this.navigateToAssignmentId(newAssignment._id)
    }
  }

  onChangeAssignment(assignmentId) {
    this.navigateToAssignmentId(assignmentId)
    this.setState({ navDrawerOpen: false })
  }

  navigateToAssignmentId(assignmentId) {
    FlowRouter.go(`/assignments/${assignmentId}`)
  }

  handleTouchTapLeftIconButton() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    })
  }

  getAssignedContacts() {
    const { contacts } = this.props

    console.log("assignedContacts", contacts)
    return contacts
    let assignedContacts = []

    const unmessagedContacts = contacts.filter((c) => !c.lastMessage())
    if (unmessagedContacts.length > 0) {
      assignedContacts = unmessagedContacts
    } else {
      const unrespondedContacts = contacts.filter((c) => c.lastMessage() && c.lastMessage().isFromContact)
      if (unrespondedContacts.length > 0) {
        assignedContacts = unrespondedContacts
      }
    }

    return assignedContacts
  }

  render() {
    const { assignment, assignments, contacts, loading } = this.props
    console.log("assignment")
    return (loading ? <CircularProgress /> :
      <div>
        <AppBar
          iconElementLeft={
            <IconButton onTouchTap={ () => FlowRouter.go('/assignments') }>
              <ArrowBackIcon />
            </IconButton>}
          title={assignment.campaign().title}
        />
        <Drawer
          open={this.state.navDrawerOpen}
          docked={false}
          onRequestChange={(navDrawerOpen) => this.setState({ navDrawerOpen })}
        >
          <AssignmentSummaryList onChangeList={this.onChangeAssignment} assignments={assignments} />
        </Drawer>
        <AssignmentSummary
          assignment={assignment}
          contacts={assignment.contacts().fetch()}
        />
      </div>
    )
  }
}

AssignmentPage.propTypes = {
  assignment: React.PropTypes.object,      // current assignment
  assignments: React.PropTypes.array,   // all assignments for showing in sidebar
  loading: React.PropTypes.bool,     // subscription status
  contacts: React.PropTypes.array,   // contacts for current assignment
  campaign: React.PropTypes.object   // contacts for current assignment

}
