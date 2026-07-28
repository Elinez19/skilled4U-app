import { Dimensions, Image, ImageSourcePropType, Text, View } from "react-native";

interface OnboardingSlideProps {
  heading: string;
  description: string;
  imageSource: ImageSourcePropType;
}

const { width } = Dimensions.get("window");

export function OnboardingSlide({ heading, description, imageSource }: OnboardingSlideProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 bg-white pb-20">
      <Image
        source={imageSource}
        style={{ width: width * 0.8, height: width * 0.8 }}
        className="rounded-3xl mb-8 object-cover"
      />
      
      <Text className="h1 text-center mb-4">
        {heading}
      </Text>
      
      <Text className="body-lg text-neutral-500 text-center px-4">
        {description}
      </Text>
    </View>
  );
}
