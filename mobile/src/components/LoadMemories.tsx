import { useEffect } from 'react'
import { ViewProps } from 'react-native'
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated'

type LoadMemoriesProps = {
  width?: number | string
  height?: number | string
} & ViewProps

export const LoadMemories = ({
  width = 100,
  height = 100,
  style,
  ...rest
}: LoadMemoriesProps) => {
  const opacity = useSharedValue(0.5)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, {
        duration: 1000,
      }),
      -1,
      true,
    )
  }, [opacity])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  return (
    <Animated.View
      style={[
        style,
        animatedStyles,
        { width, height, borderRadius: 8, backgroundColor: '#56565A' },
      ]}
      {...rest}
    />
  )
}
