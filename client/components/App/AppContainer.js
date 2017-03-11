import Relay from 'react-relay'
import App from './AppComponent'
import Navbar from '../Navbar/NavbarContainer'

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${Navbar.getFragment('viewer')}
      }`
  }
})
