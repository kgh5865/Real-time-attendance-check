import { NavigationContainer } from '@react-navigation/native';
import StackContainer from './navigation/StackContainer';
import React, { createContext, useState } from 'react';
import AppContext, { AppProvider } from "./AppContext";
import awsExports from './src/aws-exports';
import { Amplify } from 'aws-amplify';
Amplify.configure(awsExports);
import { withAuthenticator } from '@aws-amplify/ui-react-native';

const App: React.FC = () => {

  return (
    <AppProvider>
      <AppContext.Consumer>
        {(context) => (
          <NavigationContainer>
            <StackContainer />
          </NavigationContainer>
        )}
      </AppContext.Consumer>
    </AppProvider>
  );
}

export default withAuthenticator(App);