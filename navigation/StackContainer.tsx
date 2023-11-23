import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Main } from './screens/Main';
import { List }  from './screens/List'; // 대문자로 시작해야 합니다
import { Settings }  from './screens/Settings';
import Logout  from './screens/Logout';
const Stack = createNativeStackNavigator();

export default function StackContainer() {
    return (
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="List" component={List} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Logout" component={Logout} />
        </Stack.Navigator>
    );
}