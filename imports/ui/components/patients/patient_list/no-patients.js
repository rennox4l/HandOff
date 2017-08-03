import React from "react"
import Paper from "material-ui/Paper"

const style = {
  left: 0,
  right: 0,
  margin: 20,
  textAlign: "center",
  display: "inline-block",
  position: "absolute"
}

const NoPatientsList = () => {
  return (
    <Paper style={style} zDepth={1}>
      <div style={{ padding: "30px", fontSize: "20px" }}>
        You have no patients. You can add a new patient by clicking the circular
        button below. You can also pull active patients up above
      </div>
    </Paper>
  )
}

export default NoPatientsList
