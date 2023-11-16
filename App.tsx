import { NavigationContainer } from '@react-navigation/native';
import StackContainer from './navigation/StackContainer';
import awsExports from './src/aws-exports';
import { Amplify } from 'aws-amplify';
Amplify.configure(awsExports);
import { withAuthenticator } from '@aws-amplify/ui-react-native';

function App() {
  return (
    <NavigationContainer>
      <StackContainer/>
    </NavigationContainer>
  );
}

export default withAuthenticator(App);