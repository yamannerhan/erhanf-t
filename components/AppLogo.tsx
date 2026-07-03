import { Image } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

const logoSource = require('@/assets/images/icon.png');

interface AppLogoProps {
  size?: number;
  style?: ViewStyle;
  animated?: boolean;
  borderRadius?: number;
}

export function AppLogo({ size = 88, style, animated = false, borderRadius = 16 }: AppLogoProps) {
  const box = (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius,
        },
        style,
      ]}>
      <Image source={logoSource} style={styles.image} contentFit="cover" />
    </View>
  );

  if (animated) {
    return <Animated.View>{box}</Animated.View>;
  }
  return box;
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
