import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'

const Main = () => {
  return (
    <View className="flex-1 justify-center items-center bg-slate-900">
      <StatusBar style="inverted" />
      <Text className="text-4xl text-white">Hello World</Text>
    </View>
  )
}

export default Main
