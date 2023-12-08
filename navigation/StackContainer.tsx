import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainUser } from './screens/user/MainUser';
import { MainAdmin } from './screens/admin/MainAdmin'
import Main from './screens/Main';
import Absence from './screens/admin/Absence';
import Absence2 from './screens/admin/Absence2';
import UserSubject from './screens/user/UserSubject'; // 대문자로 시작해야 합니다
import { AdminSettings } from './screens/admin/AdminSettings';
import  AdminSubject  from './screens/admin/AdminSubject';
import { UserSettings } from './screens/user/UserSettings';
import Logout from './screens/Logout';
import UserInfo from './screens/user/UserInfo';
import wifi  from './screens/wifi';

const Stack = createNativeStackNavigator();

export default function StackContainer() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="MainUser" component={MainUser} />
      <Stack.Screen name="MainAdmin" component={MainAdmin} />
      <Stack.Screen name="UserSubject" component={UserSubject} />
      <Stack.Screen name="AdminSubject" component={AdminSubject} />

      <Stack.Screen name="Absence" component={Absence} />
      <Stack.Screen name="Absence2" component={Absence2} />
      <Stack.Screen name="AdminSettings" component={AdminSettings} />
      <Stack.Screen name="UserSettings" component={UserSettings} />
      <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="UserInfo" component={UserInfo} />
      <Stack.Screen name="wifi" component={wifi} />
      {/* 추가 스크린은 여기에 계속해서 등록하면 됩니다. */}
    </Stack.Navigator>
  );
}
