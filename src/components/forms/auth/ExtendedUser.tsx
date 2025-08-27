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

    const inputStyles: TextStyle = {
        textAlign: "left",
        height: variables.button.size.medium.height,
        // marginHorizontal: 10,
    }

    return <>
        <BaseUser
            creds={creds}
            error={error}
            onChange={onChange}
            imageStyles={{ top: 0, width: 200, height: 200 }}
            imageLoading={imageLoading}
            showImageRotate={true}
            onRotationSaved={onRotationSaved}
        />
        {/* Current Password section matching design */}
        <FormField label="Current Password" labelAlign="left" style={{ paddingHorizontal: 20 }}>
            <KPasswordInput
                inputStyles={{ ...inputStyles }}
                placeholder="**********"
                value={creds.currentPassword || ''}
                onChangeText={(currentPassword) => onChange({ ...creds, currentPassword })}
            // inputStyles={{textAlign: 'left'}}
            />
            {/* Inline Edit Password action */}
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 0 }}>
                <KText style={{ marginRight: 5 }}>Edit Password</KText>
                {/* <KButton
                    color="light"
                    style={{ height: 30, width: 30, paddingLeft: 0, paddingRight: 0, backgroundColor:'silver', borderRadius: 50 }}
                    onPress={resetPassword}
                    icon="edit"
                    text={undefined as any}
                    disabled={resetPasswordStatus === 'sent'}
                    loading={resetPasswordStatus === 'loading'}
                /> */}
                 <Pressable
                    style={{
                        // position: "absolute",
                        // top: 45,
                        // right: 20,
                        backgroundColor: variables.colors.lightGrey,
                        borderRadius: 100,
                        margin: 5,
                    }}
                    onPress={() => {
                        // console.log('close modal pressed')
                        // console.log('close modal pressed', isSideModalOpen)
                        // setIsSideModalOpen(false);
                    }}
                >
                    <KIcon name="edit" size={"large"} />
                </Pressable>
            </View>
        </FormField>
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
    </>
}