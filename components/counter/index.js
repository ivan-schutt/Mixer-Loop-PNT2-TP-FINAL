import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useAudioSyncContext } from "../../contexts/AudioSyncContext";

const quadrantSize = 60;

const AnimatedQuadrant = ({ isActive, style, color = "#00b4db" }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (isActive) {
      // Animación de iluminación
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.quadrant,
        style,
        {
          backgroundColor: color,
          opacity: isActive ? opacity : 0.5,
        },
      ]}
    />
  );
};

const Counter = () => {
  const { currentCount } = useAudioSyncContext();

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <AnimatedQuadrant
          isActive={currentCount === 1}
          style={styles.topLeft}
          color="#0a5b6a"
        />
        <AnimatedQuadrant
          isActive={currentCount === 2}
          style={styles.topRight}
          color="#0a5b6a"
        />
        <AnimatedQuadrant
          isActive={currentCount === 3}
          style={styles.bottomLeft}
          color="#0a5b6a"
        />
        <AnimatedQuadrant
          isActive={currentCount === 4}
          style={styles.bottomRight}
          color="#0a5b6a"
        />
      </View>
      <Text style={styles.label}>Beat {currentCount}/4</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  circle: {
    width: quadrantSize * 2,
    height: quadrantSize * 2,
    borderRadius: quadrantSize,
    backgroundColor: "#f1f3f5",
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  quadrant: {
    width: quadrantSize,
    height: quadrantSize,
    borderWidth: 1,
    borderColor: "#adb5bd",
  },
  topLeft: {
    borderTopLeftRadius: quadrantSize,
  },
  topRight: {
    borderTopRightRadius: quadrantSize,
  },
  bottomLeft: {
    borderBottomLeftRadius: quadrantSize,
  },
  bottomRight: {
    borderBottomRightRadius: quadrantSize,
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    color: "#212529",
  },
});

export default Counter;
