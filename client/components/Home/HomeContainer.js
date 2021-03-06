import Relay from 'react-relay'
import Home from './HomeComponent'

export default Relay.createContainer(Home, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
      }
    `,
  }
})
