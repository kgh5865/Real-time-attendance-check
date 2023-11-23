import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Main2 }  from './screens/user/Main';
import { Main }   from './screens/Main';
import List from './screens/user/Subject'; // 대문자로 시작해야 합니다
import List1 from './screens/List1';
import List2 from './screens/List2';
import List3 from './screens/List3';
import { Settings }  from './screens/Settings';
import Logout  from './screens/Logout';

const Stack = createNativeStackNavigator();

export default function StackContainer() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Main2" component={Main2} />
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="List1" component={List1} />
      <Stack.Screen name="List2" component={List2} />
      <Stack.Screen name="List3" component={List3} />
      <Stack.Screen name="Settings" component={Settings} />
         <Stack.Screen name="Logout" component={Logout} />
      {/* 추가 스크린은 여기에 계속해서 등록하면 됩니다. */}
    </Stack.Navigator>
  );
}
