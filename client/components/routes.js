import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {CoLab, App, CreateRoom} from '../components'



const Routes = () => {
  return(
    <Switch>
      <Route path="/create" component={CreateRoom}/>
      <Route path="/room/:roomName" component={CoLab}/>
    </Switch>
  )
}

export default Routes

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
// export default withRouter(connect(mapState, mapDispatch)(Routes))
