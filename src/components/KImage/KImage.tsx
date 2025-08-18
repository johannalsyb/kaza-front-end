import React, {useEffect} from 'react';
import useConfig from '../../hooks/useConfig';
import variables from '../../styles/variables';
import { StyleSheet } from 'react-native';

type Props = {
  source?: string;
  style?: React.CSSProperties | React.CSSProperties[];
  defaultSource?: string;
  imageId?: string;
  type?: 'properties' | 'users';
  thumbnail?: boolean;
  hideOnError?: boolean;
};

const KImage = ({
  source,
  imageId,
  thumbnail = false,
  type,
  style,
  defaultSource = variables.images.defaultImage,
  hideOnError,
}: Props) => {
  const {config} = useConfig();
  if (imageId && config && type) {
    const cfg = config.images[type];
    source = `${cfg.url}${imageId}${
      thumbnail ? cfg.thumbnailSuffix : cfg.suffix
    }`;
  }
  const [imageSource, setImageSource] = React.useState(source);
  const [isVisible, setIsVisible] = React.useState(true);

  const shouldHideOnError = hideOnError ?? (type === 'properties');

  useEffect(() => {
    setImageSource(source);
  }, [source, imageId]);

  return (
    isVisible ? (
      <img
        style={Array.isArray(style) ? StyleSheet.flatten(style) : style}
        onError={() => {
          if (shouldHideOnError) {
            setIsVisible(false);
            return;
          }
          setImageSource(defaultSource);
        }}
        loading="lazy"
        src={imageSource}
      />
    ) : null
  );
};

export default KImage;

