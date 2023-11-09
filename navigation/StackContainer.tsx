import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './screens/Login';//tsx 파일 경로의 메인함수
import { Main } from './screens/Main';

const Stack = createNativeStackNavigator();

export default function StackContainer() {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Main" component={Main} />
            {/* 추가 스크린은 여기에 계속해서 등록하면 됩니다. */}
        </Stack.Navigator>
    );
}