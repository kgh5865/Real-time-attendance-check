import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Main } from './screens/Main';
import { List }  from './screens/List'; // 대문자로 시작해야 합니다

const Stack = createNativeStackNavigator();

export default function StackContainer() {
    return (
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="List" component={List} />
            {/* 추가 스크린은 여기에 계속해서 등록하면 됩니다. */}
        </Stack.Navigator>
    );
}