import { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { theme } from "../theme";

interface SkeletonItemProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  color?: string;
  style?: ViewStyle;
}

export const SkeletonItem = (props: SkeletonItemProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: props.width,
          height: props.height,
          borderRadius: props.borderRadius ?? theme.borderRadius.sm,
          backgroundColor: props.color,
          opacity,
        },
        props.style,
      ]}
    />
  );
};
