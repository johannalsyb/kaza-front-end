// description and job fields for user profile
import { Pressable, TextStyle, View } from "react-native"
import FormField from "../../Form/FormField/FormField"
import KPasswordInput, { getError as getPasswordError } from "../../Form/KPasswordInput"
import { Creds, RegisterFormError, isEmailValid } from "./Register"
import variables from "../../../styles/variables"
import BaseUser from "./BaseUser"
import KText from "../../KText"
import KTextInput from "../../Form/KTextInput/KTextInput"
import { isPhoneValid } from "../../../utils/phone"
import useAuthentication from "../../../hooks/useAuthentication"
import KButton from "../../KButton/KButton"
import { useState } from "react"
import auth from "../../../api/auth"
import { toastError, toastSuccess } from "../../Toast/Toast"
import KIcon from "../../KIcon/KIcon";
import KModal from "../../KModal/KModal"
import { set } from "react-hook-form"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { request } from "../../../api"
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NavStackParamList } from "../../../navigation/screens"


type Props = {
    creds: Creds,
    error: RegisterFormError,
    onChange: (creds: Creds) => void,
    imageLoading?: boolean,
    onRotationSaved?: (degrees: number) => Promise<void>
}

export default ({
    creds,
    onChange,
    error,
    imageLoading = false,
    onRotationSaved = () => Promise.resolve()
}: Props) => {

    const [resetPasswordStatus, setResetPasswordStatus] = useState<'unsent' | 'loading' | 'sent'>('unsent')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const route = useRoute<RouteProp<NavStackParamList, "ResetPassword">>();
    const navigation = useNavigation()

    const resetPassword = () => {
        setResetPasswordStatus('loading')
        auth.resetPassword.request(creds.email)
            .then(() => {
                setResetPasswordStatus('sent')
                toastSuccess("Reset instructions sent to your email")
            })
            .catch(() => {
                setResetPasswordStatus('unsent')
                toastError("Error sending reset instructions, please try again later")
            })
    };

    // Password changed function
    const handleSaveChanges = async () => {
        console.log("triggered the reset password")
        if (newPassword === confirmPassword) {
            try {
                //@ts-ignore
                const token = route.params?.token
                console.log("the token is", token);
                if (!token) {
                    toastError("Invalid or missing token");
                    return;
                }
                await auth.resetPassword.update({
                    password: creds.currentPassword!,
                    token: token,
                });
                toastSuccess("Password updated successfully");
                // navigation.navigate("Login");

            } catch (error: any) {
                toastError(error?.response?.data?.message || "Failed to update password");
            }
        } else {
            toastError("Passwords do not match");
        }
    };


    const inputStyles: TextStyle = {
        textAlign: "left",
        height: variables.button.size.medium.height,
        // marginHorizontal: 10,
    }

    return (
        <View style={{ flex: 1 }}>
            <>
                <BaseUser
                    creds={creds}
                    error={error}
                    onChange={onChange}
                    imageStyles={{ top: 0, width: 200, height: 200 }}
                    imageLoading={imageLoading}
                    showImageRotate={true}
                    onRotationSaved={onRotationSaved}
                />
                {/* <View style={{
                    display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end",
                    marginTop: 0, paddingHorizontal: 20
                }}>
                    <KText style={{ marginRight: 5 }}>Edit Password</KText>
                    <Pressable
                        style={{
                            backgroundColor: variables.colors.lightGrey,
                            borderRadius: 100,
                            margin: 5,
                        }}
                        onPress={() => {
                            console.log('Password icon pressed');
                            setIsModalVisible(true);
                        }}
                    >
                        <KIcon name="edit" size={"large"} />
                    </Pressable>
                </View> */}

                <FormField label="Description" labelAlign="left" style={{ paddingHorizontal: 20 }}>
                    <KTextInput
                        placeholder="Description"
                        onChangeText={hobby => onChange({ ...creds, hobby })}
                        multiline
                        numberOfLines={6}
                        value={creds.hobby}
                        inputStyles={{ textAlign: 'left' }}
                    />
                </FormField>
                <FormField label="Your Job" labelAlign="left" style={{ paddingHorizontal: 20 }}>
                    <KTextInput
                        placeholder="Enter your job"
                        onChangeText={job => onChange({ ...creds, job })}
                        value={creds.job}
                        inputStyles={{ textAlign: 'left' }}
                    />
                </FormField>
                <FormField label="Social Media" labelAlign="left" style={{ paddingHorizontal: 20 }}>
                    <KTextInput
                        placeholder="Enter a link to your social media profile"
                        onChangeText={socialMedia => onChange({ ...creds, socialMedia })}
                        value={creds.socialMedia}
                        inputStyles={{ textAlign: 'left' }}
                    />
                </FormField>

                {/* Password updates code */}
                <View style={{
                    margin: 10, backgroundColor: variables.colors.lightGrey,
                    borderRadius: 30, paddingHorizontal: 20, paddingBottom: 13, paddingTop: 30
                }}>


                    <FormField label="Current Password" labelAlign="left">
                        <KPasswordInput
                            inputStyles={{ ...inputStyles }}
                            placeholder="Enter Current Password"
                            value={creds.currentPassword || ''}
                            onChangeText={(currentPassword) => onChange({ ...creds, currentPassword })}
                        />
                    </FormField>
                    <FormField label="New Password" labelAlign="left">
                        <KPasswordInput
                            inputStyles={{ ...inputStyles }}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </FormField>
                    <FormField label="Confirm Password" labelAlign="left">
                        <KPasswordInput
                            inputStyles={{ ...inputStyles }}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </FormField>
                    <View style={{ marginTop: 0, alignItems: 'center' }}>
                        {/* <KButton text="Cancel" color="light" onPress={() => setIsModalVisible(false)} style={{ marginHorizontal: 10, width: 150 }} /> */}
                        <KButton text="Change Password" onPress={handleSaveChanges}
                            style={{ backgroundColor: variables.colors.yellow, width: 175 }}
                            textStyle={{ color: variables.colors.black, fontWeight: '600' }} />
                    </View>
                </View>

                {/* Password Reset Modal */}

            </>
            {/* <KModal
                visible={isModalVisible}
                setVisibility={() => setIsModalVisible(false)}
                style={{
                    padding: 15, backgroundColor: 'white', alignSelf: "flex-end", position: "absolute", bottom: 0, right: 0,
                    width: '100%', maxWidth: 400, borderBottomEndRadius: 0, borderBottomStartRadius: 0
                }}
                showCross={false}
            // text="Edit Password"
            >
                <View style={{
                    width: "15%",
                    height: 3,
                    backgroundColor: variables.colors.yellow,
                    borderRadius: 10,
                    marginTop: 0,
                    overflow: "hidden",
                }}></View>

                <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <KText style={{ fontSize: 18, fontWeight: '600', marginBottom: 20 }}>Edit Password</KText>
                    <Pressable
                        style={{
                            position: "absolute",
                            top: -5,
                            right: -110,
                            backgroundColor: variables.colors.yellow,
                            borderRadius: 50,
                            padding: 6,
                        }}
                        onPress={() => { }}
                    >
                        <KIcon name="edit" size={"large"} style={{ stroke: variables.colors.black }} />
                    </Pressable>
                </View>

                <FormField label="Current Password" labelAlign="left">
                    <KPasswordInput
                        inputStyles={{ ...inputStyles }}
                        placeholder="**********"
                        value={creds.currentPassword || ''}
                        onChangeText={(currentPassword) => onChange({ ...creds, currentPassword })}
                    />
                </FormField>
                <FormField label="New Password" labelAlign="left">
                    <KPasswordInput
                        inputStyles={{ ...inputStyles }}
                        placeholder="Insert new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </FormField>
                <FormField label="Confirm Password" labelAlign="left">
                    <KPasswordInput
                        inputStyles={{ ...inputStyles }}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </FormField>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                    <KButton text="Cancel" color="light" onPress={() => setIsModalVisible(false)} style={{ marginHorizontal: 10, width: 150 }} />
                    <KButton text="Save Changes" onPress={handleSaveChanges} style={{ marginHorizontal: 10, width: 150 }} />
                </View>
            </KModal> */}
        </View>
    )
}