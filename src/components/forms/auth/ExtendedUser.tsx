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
import KIcon from "../../KIcon/KIcon"
import KModal from "../../KModal/KModal"
import { set } from "react-hook-form"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { request } from "../../../api"
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NavStackParamList } from "../../../navigation/screens"
import { password } from "../../KIcon/icons"


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
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const { logout: authLogout } = useAuthentication();


    const route = useRoute<RouteProp<NavStackParamList, "ResetPassword">>()
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
    }

    // Password changed function
    const handleSaveChanges = async () => {
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        if (!creds.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }
        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(msg => msg.length > 0);
        if (hasErrors) return;

        try {
            await auth.changePassword.request(creds?.currentPassword, newPassword);
            toastSuccess("Password updated successfully. Please log in again.");
            authLogout();
            toastSuccess("Password updated successfully. Please log in again.");

            navigation.navigate("/login" as never);
        } catch (err: any) {
            console.log("Full error response:", err?.response);
            const msg = err?.response?.data?.data?.error || "Current password is incorrect";
            console.log("Error changing password:", msg);
            setErrors(prev => ({
                ...prev,
                currentPassword: msg
            }));
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
                            inputStyles={inputStyles}
                            placeholder="Enter Current Password"
                            value={creds.currentPassword || ''}
                            onChangeText={(currentPassword) => {
                                onChange({ ...creds, currentPassword });
                                setErrors(prev => ({ ...prev, currentPassword: '' }));
                            }}
                            error={errors.currentPassword}
                        />
                    </FormField>
                    <FormField label="New Password" labelAlign="left">
                        <KPasswordInput
                            inputStyles={inputStyles}
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                setErrors(prev => ({ ...prev, newPassword: '' }));
                            }}
                            error={errors.newPassword}
                        />
                    </FormField>
                    <FormField label="Confirm Password" labelAlign="left">
                        <KPasswordInput
                            inputStyles={inputStyles}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                            error={errors.confirmPassword}
                        />
                    </FormField>
                    <View style={{ marginTop: 0, alignItems: 'center' }}>
                        {/* <KButton text="Cancel" color="light" onPress={() => setIsModalVisible(false)} style={{ marginHorizontal: 10, width: 150 }} /> */}
                        <KButton text="Change Password" onPress={handleSaveChanges}
                            style={{ backgroundColor: variables.colors.yellow, width: 175 }}
                            textStyle={{ color: variables.colors.black, fontWeight: '600' }} />
                    </View>
                </View>

            </>
        </View>
    )
}