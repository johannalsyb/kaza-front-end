import {StyleSheet} from 'react-native';
import variables from '../../styles/variables';
import KImage from '../KImage/KImage';
import useConfig from '../../hooks/useConfig';
import KText from '../KText';
import userdefultImage from '../KIcon/icons/Userpick.svg'
type CircleImageSize = keyof typeof variables.circleImage.size;

type CircleImageProps = {
  source?: string;
  imageId?: string;
  type?: 'properties' | 'users';
  thumbnail?: boolean;
  size?: CircleImageSize;
  style?: React.CSSProperties;
};

const defaultCircleImage = userdefultImage;
const circleImageSize = variables.circleImage.size;

export const CircleImage = ({
  source = defaultCircleImage,
  size = 'small',
  style,
  imageId,
  thumbnail = false,
  type,
}: CircleImageProps) => {
  const {config} = useConfig();
   const isDefaultImage = !imageId || source === defaultCircleImage;
  if (imageId && config && type) {
    const cfg = config.images[type];
    source = `${cfg.url}${imageId}${
      thumbnail ? cfg.thumbnailSuffix : cfg.suffix
    }`;
  }
 console.log('defualt img:-',defaultCircleImage)
  return (
    <>
    
    <KImage
      source={source}
      style={{
        ...circleImageSize[size],
        ...styles.circleImage,
        borderRadius: circleImageSize[size].width / 2,
    
        ...style,
       
      }}
      defaultSource={defaultCircleImage}
    />
   
 
    </>
    
  );
};

const styles = StyleSheet.create({
  circleImage: {
    objectFit: 'cover',
    backgroundColor: variables.colors.darkYellow,
    
    
  },
});
