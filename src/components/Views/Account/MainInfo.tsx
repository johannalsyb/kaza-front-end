// Main page of edit profile
import { ActivityIndicator, Pressable, View, Text, TextStyle, LayoutChangeEvent } from 'react-native';
import KText from '../../KText';
import variables from '../../../styles/variables';
import { PropertyCard } from '../../PropertyCard/PropertyCard';
import { CircleImage } from '../../CircleImage/CircleImage';
import KIcon, { IconName } from '../../KIcon/KIcon';
import { Creds } from '../../forms/auth/Register';
import { Api, User } from '../../../common';
import useIsMobile from '../../../hooks/useIsMobile';
import VerifyButton from '../../VerifyButton';
import { IconText } from '../../IconText/IconText';
import Gap from '../../Gap/Gap';
import { useEffect, useState } from 'react';
import KButton from '../../KButton/KButton';
import Footer from '../../Footer';
import { useRoute } from '@react-navigation/native';
import useConfig from '../../../hooks/useConfig';
import users from '../../../api/users';
import { showComponentAtom } from '../../../atoms';
import { useSetAtom } from 'jotai';
import VerifyPhone from '../../VerifyPhone';
import { toastSuccess } from '../../Toast/Toast';
import useAuthentication from '../../../hooks/useAuthentication';

type Props = {
  creds?: { user: User; creds: Creds };
  property?: Api.Properties.PrivateProperty;
  onEditProfilePressed?: () => void;
  onEditPropertyPressed?: () => void;
  onHomePressed?: () => void;
  onLayout?: (e: LayoutChangeEvent) => void;
};

const MAX_CHARS = 200;
const PADDING_H_MOBILE = 10

export default (props: Props) => {
  const { isMobile } = useIsMobile();
  const isDescriptionTooLong =
    (props.creds?.creds.hobby?.length || 0) > MAX_CHARS;

  const [setShowModalComponent] = [useSetAtom(showComponentAtom)];
  const [readMore, setReadMore] = useState(isDescriptionTooLong);
  const [property, setProperty] = useState(props.property);
  const route = useRoute()

  const { config } = useConfig()
  const auth = useAuthentication()

  useEffect(() => {
    if (props.property) setProperty(props.property)

  }, [props.property])

  const formatTextDescription = (text: string, style: TextStyle = {}) => {
    const str = readMore ? text.slice(0, MAX_CHARS).concat('...') : text
    return (
      <KText style={{ ...style }}>
        {str}
        {isDescriptionTooLong && (
          <Pressable onPress={() => setReadMore(prev => !prev)}>
            <Text style={{ textDecorationLine: 'underline' }}>
              {readMore ? 'Read more' : 'Read less'}
            </Text>
          </Pressable>
        )}
      </KText>
    );
  };

  if (!props.creds) return <ActivityIndicator />;

  const user = props.creds.user;

  const img = `${user?.id}/${props.creds.creds.image || props.creds.creds.primaryImage
    }`;
  // const propImage =
  //   property && property.images != null
  //     ? `${property.id}/${
  //         property.images.includes(',')
  //           ? (property.images + '').split(',')[0]
  //           : property.images
  //       }`
  //     : undefined;

  let propAddress = property?.address.split(',').slice(1).join();
  if (!propAddress || propAddress.length === 0) propAddress = `${property?.city ? property?.city + "," : ""} ${property?.country || ""}`

  const noAddress = propAddress.trim().length === 0;

  const EditProfileText = (text: string, iconName: IconName) => (
    <Pressable onPress={() => props.onEditProfilePressed?.()}>
      <IconText
        text={text}
        textStyle={{ textDecorationLine: 'underline' }}
        iconName={iconName}
        size="medium"
      />
    </Pressable>
  );

  const phoneValid =
    props.creds.creds.phone &&
    props.creds.creds.phone.number &&
    props.creds.creds.phone.number.length &&
    props.creds.creds.phone.code;
  const phone = phoneValid
    ? `${props.creds.creds.phone.code}${props.creds.creds.phone.number}`
    : undefined;

  const marginVertical = isMobile ? 10 : 20;

  return (
    <View
      onLayout={e => props.onLayout && props.onLayout(e)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 0,
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'stretch',
          justifyContent: isMobile ? undefined : 'center',
          // maxWidth: 1800,
        }}>
        {/* The yellow box */}
        <View
          style={[
            {
              backgroundColor: variables.colors.yellow,
              borderRadius: isMobile ? 0 : 20,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              flex: 1,
              marginRight: isMobile ? 0 : 20,
              marginBottom: isMobile ? 0 : marginVertical,
              padding: 20,
              justifyContent: 'center',
              flexDirection: "column",
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? undefined : 900,
            },
            !isMobile && { alignItems: 'center' },
          ]}>
          {isMobile &&
            <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <KButton
                color="light"
                onPress={() => props.onHomePressed && props.onHomePressed()}
                style={{ flexDirection: 'row', borderWidth: isMobile ? 0 : 1, borderColor: variables.colors.borderGray }}
                size={'small'}>
                <KIcon name="search" size="large" />
              </KButton>

              <KButton
                color="light"
                onPress={() => props.onHomePressed && props.onHomePressed()}
                style={{ flexDirection: 'row', borderWidth: isMobile ? 0 : 1, borderColor: variables.colors.borderGray }}
                size={'small'}>
                <KIcon name="share" size="large" />
              </KButton>
            </View>
          }
          {/* The user picture */}
          <View
            style={[
              { marginBottom: isMobile ? 0 : marginVertical, marginTop: isMobile ? 0 : marginVertical }, // Remove margins on mobile
              isMobile && {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <CircleImage
              style={{
                // aspectRatio: 1,
                borderRadius: 200,
                height: 150,
                width: 150,
                borderWidth: isMobile ? 8 : 3,
                borderColor: 'white',
                borderStyle: 'solid',
              }}
              imageId={img}
              type="users"
            />
            <KIcon name="instagram" size="large" style={{ position: 'absolute', bottom: -12, left: '45%', height: 40, width: 40 }} />
          </View>
          {/* The user name and description */}
          <View
            style={{
              flex: 1,
              // height: '90%',
              marginBottom: marginVertical,
              alignItems: 'center',
            }}>
            <KText style={{ fontSize: 40, marginBottom: marginVertical, fontWeight: 'bold' }}>
              {props.creds.creds.firstName}
            </KText>

            {noAddress ? null : <IconText
              iconName="location"
              size="medium"
              text={propAddress}
              style={{ overflow: 'visible' }}
            />}
          </View>

          {/* Mobile centered Edit Profile button under name */}
          {isMobile && (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <KButton
                color={"primary"}
                onPress={() => props.onEditProfilePressed && props.onEditProfilePressed()}
                style={{
                  flexDirection: 'row',
                  borderWidth: 0,
                  marginTop: marginVertical,
                  marginBottom: marginVertical,
                  paddingLeft: 20,
                  paddingRight: 20,
                  gap: 15
                }}
                size={'medium'}
                icon={'plusCircle'}
                text={'Edit Profile'}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
