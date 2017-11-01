import { Form, Input, Button, Tag, Select, notification } from "antd"
import React from "react"
import { updatePatient } from "/imports/api/patients/patient-methods.js"
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import MedicationSelect from "/imports/ui/components/medications/MedicationSelect.js"
import HandoffTag from "/imports/ui/components/patients/patient/HandoffTag"

class PatientModalForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        throw new Meteor.Error(
          "Cannot validate the patient data",
          "All input fields must meet the validation requirement"
        )
      }

      // destructure out the names to combine them
      let { firstName, lastName } = values
      values.name = `${firstName} ${lastName}`

      // stick values into patients
      let patient = this.props.patient
      patient.updatedAt = new Date()
      patient = Object.assign(patient, values)

      // call Meteor Method to update patient
      updatePatient.call({ patient }, (error, result) => {
        if (error) {
          notification.error({
            message: "Can't update patient",
            description: error.reason
          })
        } else {
          notification.success({
            message: "Patient update",
            description: `${patient.name} updated successfully`
          })
          this.props.form.resetFields()
          this.props.closeModal()
        }
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form,
      patient = this.props.patient,
      formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 }
        }
      },
      tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 14,
            offset: 6
          }
        }
      }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="First Name" hasFeedback>
          {getFieldDecorator("firstName", {
            rules: [
              {
                required: true,
                message: "Please input first name"
              }
            ],
            initialValue: patient.firstName
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Last Name" hasFeedback>
          {getFieldDecorator("lastName", {
            rules: [
              {
                required: true,
                message: "Please input last name"
              }
            ],
            initialValue: patient.lastName
          })(<Input />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<span>Room&nbsp;</span>}
          hasFeedback
        >
          {getFieldDecorator("room", {
            rules: [
              {
                required: true,
                message: "Please input room number"
              }
            ],
            initialValue: patient.room
          })(<Input />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<span>Diagnosis&nbsp;</span>}
          hasFeedback
        >
          {getFieldDecorator("diagnosis", {
            rules: [
              {
                required: true,
                message: "Please input diagnosis"
              }
            ],
            initialValue: patient.diagnosis
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="HPI" hasFeedback>
          {getFieldDecorator("hpi", {
            rules: [],
            initialValue: patient.hpi
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="PMH" hasFeedback>
          {getFieldDecorator("pmh", {
            rules: [],
            initialValue: patient.pmh
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Medications" hasFeedback>
          {getFieldDecorator("medications", {
            rules: [],
            initialValue: patient.medications
          })(<MedicationSelect autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Allergies" hasFeedback>
          {getFieldDecorator("allergies", {
            rules: [],
            initialValue: patient.allergies
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Vitals" hasFeedback>
          {getFieldDecorator("vitals", {
            rules: [],
            initialValue: patient.vitals
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Labs" hasFeedback>
          {getFieldDecorator("labs", {
            rules: [],
            initialValue: patient.labs
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Radiology" hasFeedback>
          {getFieldDecorator("radiology", {
            rules: [],
            initialValue: patient.radiology
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Care Plan" hasFeedback>
          {getFieldDecorator("plan", {
            rules: [],
            initialValue: patient.plan
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="To Do" hasFeedback>
          {getFieldDecorator("todo", {
            rules: [],
            initialValue: patient.todo
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Coverage Instructions" hasFeedback>
          {getFieldDecorator("coverage", {
            rules: [],
            initialValue: patient.coverage
          })(<TextArea autosize />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Condition" hasFeedback>
          {getFieldDecorator("condition", {
            rules: [
              {
                required: true,
                message: "Please select condition"
              }
            ],
            initialValue: patient.condition
          })(
            <Select>
              <Option value="Unstable">
                <HandoffTag color="red">Unstable</HandoffTag>
              </Option>
              <Option value="Watcher">
                <HandoffTag color="orange">Watcher</HandoffTag>
              </Option>
              <Option value="Stable">
                <HandoffTag color="blue">Stable</HandoffTag>
              </Option>
            </Select>
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Update Patient
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(PatientModalForm)
