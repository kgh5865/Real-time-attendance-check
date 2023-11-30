import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainUser }    from './screens/user/MainUser';
import {MainAdmin}  from './screens/admin/MainAdmin'
import  Main    from './screens/Main';
import  Absence  from './screens/admin/Absence'
import Subject from './screens/user/UserSubject'; // 대문자로 시작해야 합니다
import List1 from './screens/List1';
import List2 from './screens/List2';
import List3 from './screens/List3';
import { Settings }  from './screens/Settings';
import Logout  from './screens/Logout';
import UserInfo from './screens/user/UserInfo';

const Stack = createNativeStackNavigator();

export default function StackContainer() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="MainUser" component={MainUser} />
      <Stack.Screen name="MainAdmin" component={MainAdmin} />
      <Stack.Screen name="Subject" component={Subject} />
      <Stack.Screen name="List1" component={List1} />
      <Stack.Screen name="List2" component={List2} />
      <Stack.Screen name="List3" component={List3} />
      <Stack.Screen name="Absence" component={Absence} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="UserInfo" component={UserInfo} />
      {/* 추가 스크린은 여기에 계속해서 등록하면 됩니다. */}
    </Stack.Navigator>
  );
}
