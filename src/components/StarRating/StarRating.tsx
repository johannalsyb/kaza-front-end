import React, { useRef, useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import KIcon from "../KIcon/KIcon"
import variables from '../../styles/variables'

type Props = {
  maxStars?: number;
  size?: number; 
  color?: string;
  onChange?: (rating: number) => void;
  initialRating?: number;
};

const { colors } = variables

export default function StarRating({
  maxStars = 5,
  size = 24,
  color = colors.yellow,
  onChange,
  initialRating = 0,
}: Props) {
  const [rating, setRating] = useState(initialRating);
  const containerRef = useRef<View>(null); 

  const isDragging = useRef(false);

  const updateRatingFromPosition = (x: number) => {
    containerRef.current?.measure((fx, fy, width) => {
      const starWidth = width / maxStars;
      let newRating = Math.ceil(x / starWidth);
      if (newRating < 0) newRating = 0;
      if (newRating > maxStars) newRating = maxStars;
      setRating(newRating);
      onChange?.(newRating);
    });
  };


  return (
    <View 
    style={styles.container}
      onTouchStart={(e) => {
        isDragging.current = true;
        updateRatingFromPosition(e.nativeEvent.touches[0].locationX);
      }}
      onTouchMove={(e) => {
        if (isDragging.current) {
          updateRatingFromPosition(e.nativeEvent.touches[0].locationX);
        }
      }}
      onTouchEnd={() => {
        isDragging.current = false;
      }}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <Pressable key={index} 
            onPress={() => setRating(starValue)}
          >
            <KIcon
              name="starOutline"
              size={size}
              style={{ fill: isFilled ? color : "#FFF", stroke:  isFilled ? color : "#000"}}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

