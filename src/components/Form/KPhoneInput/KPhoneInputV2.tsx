import {
  Modal,
  ScrollView,
  TextInput,
  TextStyle,
  View,
  Animated,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import KButton from '../../KButton/KButton';
import variables from '../../../styles/variables';
import KText from '../../KText';
import KIcon from '../../KIcon/KIcon';
import KTextInput from '../KTextInput/KTextInput';
import {useEffect, useRef, useState} from 'react';
import KModal from '../../KModal/KModal';
import {Phone} from '../../forms/auth/Register';
import {Countries, getCountries, isPhoneValid} from '../../../utils/phone';
import useIsMobile from '../../../hooks/useIsMobile';
import Dropdown from './Dropdown';
import {useCloseFromOutside} from '../../../hooks/useCloseFromOutside';
import {back} from '../../KIcon/icons';
import ModalList from './ModalList';

const inputStyles: TextStyle = {
  textAlign: 'left',
  height: variables.button.size.medium.height,
};
type Props = {
  phone?: string;
  onChange: (phone: string) => void;
  error: string | undefined;
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    height: 40,
    position: 'relative',
    zIndex: 1,
    borderWidth: 1,
    borderColor: variables.colors.xLightGray,
    borderRadius: 23,
  },
  containerMobileView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 45,
    position: 'relative',
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    left: 0,
    backgroundColor: variables.colors.white,
    width: 'auto',
    minWidth: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    zIndex: 1,
    boxShadow: '15px 15px 55px 0px rgba(77, 75, 63, 0.25)',
  },
  formError: {
    borderColor: variables.form.colors.border.error,
  },
  errorText: {
    color: variables.colors.white,
    fontSize: 11,
    borderRadius: variables.form.input.borderRadius,
    backgroundColor: variables.form.colors.background.error,
    paddingHorizontal: variables.spacing.xxsmall,
  },
  errorContainer: {
    position: 'absolute',
    bottom: -6,
    width: '100%',
    display: 'flex',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    left: 55,
  },
  containerCode: {
    paddingLeft: 20,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderColor: 'none',

    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,

    height: 40,
    minWidth: 125,
  },

  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#c6c5ba',
   
  },
  containerCodeMobileView: {
    paddingLeft: 20,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: variables.colors.xLightGray,
    borderRadius: 23,

    height: 45,
    minWidth: 125,
  },
  input: {
   
    opacity: 0.6,
    fontSize: 16,
    height: 44,
    textAlign: 'left',
    paddingVertical: 0,
    paddingLeft: 20,
  },
  containerPhone: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 20,
    
    borderColor: 'none',

    height: 40,
  },
  containerPhoneMobileView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: variables.colors.xLightGray,
    borderRadius: 23,

    height: 45,
  },
  inputfieldStyle: {
    borderColor: 'none',
  },
});

export default (props: Props) => {
  const {isMobile} = useIsMobile();
  const [code, setCode] = useState('+351');
  const [number, setNumber] = useState(props.phone || '');
  const [countries, setCountries] = useState<Countries>({});
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allCountries, setAllCountries] = useState<Countries>({});
  const modalSearchInput = useRef<TextInput>(null);
  const modalRef = useRef<View>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(-1);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const closeSuggestionRef = useCloseFromOutside(
    isOpenDropdown,
    setIsOpenDropdown,
  );
  useEffect(() => {
    if (!Object.keys(countries).length) {
      getCountries().then(c => {
        setCountries(c);
        setAllCountries(c);
        const index = Object.keys(c).findIndex(c => c === code);
        setSelectedIndex(index);
      });
    }
  }, []);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpenDropdown ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpenDropdown]);

  useEffect(() => {
    if (code !== undefined && number !== undefined)
      props.onChange(`${code}${number}`);
  }, [code, number]);

  const searchCountriesFromCodeOrName = (search: string) => {
    const searchLower = search.toLowerCase().trim();

    // Якщо пошук порожній - повертаємо всі країни
    if (!searchLower) {
      return allCountries;
    }

    return Object.entries(allCountries).reduce(
      (acc, [countryCode, countryNames]) => {
        // Пошук по коду
        if (countryCode.toLowerCase().includes(searchLower)) {
          acc[countryCode] = countryNames;
          return acc;
        }

        // Пошук по назві
        const filteredNames = countryNames.filter(name =>
          name.toLowerCase().includes(searchLower),
        );

        if (filteredNames.length > 0) {
          acc[countryCode] = filteredNames;
        }

        return acc;
      },
      {} as Countries,
    );
  };

  useEffect(() => {
    const filteredCountries = searchCountriesFromCodeOrName(countrySearch);
    setCountries(filteredCountries);
  }, [countrySearch, allCountries]);
  return (
    <View>
      <Pressable
        ref={!isMobile ? closeSuggestionRef : undefined}
        style={[isMobile ? styles.containerMobileView : styles.container]}>
        <Pressable
          onPress={() => setIsOpenDropdown(!isOpenDropdown)}
          style={
            isMobile ? styles.containerCodeMobileView : styles.containerCode
          }>
          <KText>{code} </KText>

          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
              borderColor: 'none',
              borderBottomRightRadius: 1,
            }}>
            <KIcon name="arrowDown" size="medium" style={{opacity: 0.6}} />
          </Animated.View>
          {!isMobile && <View style={styles.verticalDivider} />}
        </Pressable>

        <View
          style={
            isMobile ? styles.containerPhoneMobileView : styles.containerPhone
          }>
          <TextInput
            value={number}
            onChangeText={e => setNumber(e)}
            placeholder="Phone number"
            style={[
              styles.input,

              //@ts-ignore
              Platform.OS === 'web' ? {outlineWidth: 0} : {},
              !!props.error ? styles.formError : {},
            ]}
          />
          {!!props.error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{props.error}</Text>
            </View>
          ) : null}
        </View>
        {isOpenDropdown &&
          (isMobile ? (
            <ModalList
              countries={countries}
              code={code}
              setCode={setCode}
              countrySearch={countrySearch}
              error={Boolean(props.error)}
              setCountrySearch={setCountrySearch}
              isHovered={isHovered}
              setSelectedIndex={setSelectedIndex}
              isOpenDropdown={isOpenDropdown}
              setIsOpenDropdown={setIsOpenDropdown}
              setIsHovered={setIsHovered}
            />
          ) : (
            <View style={[styles.dropdown]}>
              <Dropdown
                countries={countries}
                code={code}
                setCode={setCode}
                countrySearch={countrySearch}
                error={Boolean(props.error)}
                setCountrySearch={setCountrySearch}
                isHovered={isHovered}
                setSelectedIndex={setSelectedIndex}
                setIsOpenDropdown={setIsOpenDropdown}
                setIsHovered={setIsHovered}
              />
            </View>
          ))}
      </Pressable>
    </View>
  );
};
