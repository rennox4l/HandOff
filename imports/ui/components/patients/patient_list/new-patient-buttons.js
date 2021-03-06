import React from "react"
import { Link } from "react-router-dom"
import "antd/dist/antd.css"
import PropTypes from "prop-types"
import {
  addPatientsToUser,
  removePatientsFromUser
} from "/imports/api/patients/patient-methods.js"
import { Menu, Dropdown, notification, Button } from "antd"
import { Groups } from "/imports/api/groups/groups.js"
import { Users } from "/imports/api/users/users.js"
import { withTracker } from "meteor/react-meteor-data"

const styles = {
  title: {
    cursor: "pointer",
    color: "white",
    textDecoration: "none",
    marginRight: "50px",
    fontSize: "18px"
  },
  menu: {
    display: "flex",
    justifyContent: "space-between"
  },
  left: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1
  },
  right: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "baseline",
    flex: 1
  },
  leftButtons: {
    marginRight: "8px"
  },
  rightSearch: {
    maxWidth: "400px",
    alignSelf: "center",
    flex: 1
  },
  rightButtons: {
    marginLeft: "16px",
    flex: "initial"
  }
}

class NewPatientButtons extends React.Component {
  static propTypes = {
    selectedRowKeys: PropTypes.array.isRequired,
    setSelectedRowKeys: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired
  }

  onClickDoctor = (otherUserId, name) => {
    addPatientsToUser.call(
      { patientIdList: this.props.selectedRowKeys, otherUserId: otherUserId },
      err => {
        if (err) {
          notification.error({
            message: "Handoff error",
            description: `Error moving patient to ${name}. ${err.reason}`
          })
        } else {
          notification.success({
            message: "Handoff",
            description: `${name} received your handoff.`
          })
        }
      }
    )
  }

  onRemoveClick = () => {
    let myUserId = Meteor.userId()
    const plural = this.props.selectedRowKeys.length > 1 ? true : false
    removePatientsFromUser.call(
      { patientIdList: this.props.selectedRowKeys, userId: myUserId },
      err => {
        if (err) {
          notification.error({
            message: "Error",
            description: `Problem removing patients from user`
          })
        } else {
          notification.info({
            message: "Removed",
            description: `Patient${plural
              ? "s"
              : ""} removed from covered list.`
          })
        }
      }
    )
    this.props.setSelectedRowKeys([])
  }

  render() {
    const userId = Meteor.userId()
    let menu = (
      <Menu>
        {this.props.users.map(el => {
          if (userId !== el._id) {
            return (
              <Menu.Item key={el._id}>
                <a onClick={() => this.onClickDoctor(el._id, el.profile.name)}>
                  {el.profile.name}
                </a>
              </Menu.Item>
            )
          }
        })}
      </Menu>
    )
    return (
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          marginLeft: "10px"
        }}
      >
        <div style={styles.menu}>
          <div style={styles.left}>
            <Dropdown
              overlay={menu}
              disabled={this.props.selectedRowKeys.length === 0}
            >
              <Button
                icon="share-alt"
                type="primary"
                style={styles.leftButtons}
                disabled={this.props.selectedRowKeys.length === 0}
              >
                Handoff
              </Button>
            </Dropdown>

            <Button
              icon="close"
              type="danger"
              style={styles.leftButtons}
              onClick={this.onRemoveClick}
              disabled={this.props.selectedRowKeys.length === 0}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default withTracker(props => {
  Meteor.subscribe("member.groups", { userId: Meteor.userId() })
  const users = Meteor.users.find().fetch()
  console.log("NewPatientButtons withTracker users: ", users)
  return { users }
})(NewPatientButtons)
