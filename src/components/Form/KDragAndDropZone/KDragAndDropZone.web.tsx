import { View } from "react-native"
import { Props } from "."
import KText from "../../KText"
import KIcon from "../../KIcon/KIcon"
import variables from "../../../styles/variables"
import useIsMobile from "../../../hooks/useIsMobile"

export default (props: Props) => {
    const { isMobile } = useIsMobile()
    return (
        <>
            {!isMobile && <KText style={{
                color: 'rgba(0,0,0,.5)',
                position: "absolute",
                top: 0, right: 10,
                fontSize: 12,
                letterSpacing: -0.5
            }}>
                minimum 4 pictures
            </KText>}
            <div
                onClick={() => {
                    props.onPress && props.onPress()
                }}
                style={props.style}
                id="drop_zone"
                onDrop={(e) => {
                    e.preventDefault()
                    props.onDrop(Array.from(e.dataTransfer.files).map((file: File) => {
                        const reader = new FileReader()
                        reader.readAsDataURL(file)
                        return new Promise<string>((resolve) => {
                            reader.onload = () => {
                                resolve(reader.result as string)
                            }
                        })
                    }))
                }}
                onDragOver={e => {
                    e.preventDefault()
                    props.onDragOver && props.onDragOver()
                }}
            >
                {props.children || <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 20 }}>
                    <KIcon name="addPicture" size={isMobile ? 25 : 50} style={{ marginBottom: 10 }} />
                    {isMobile ?
                        <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <KText style={{ color: "black" }}>Add pictures of your place</KText>
                            <KText style={{ color: variables.colors.grey }}>minimum 4 pictures</KText>
                        </View>
                        : <KText style={{ color: variables.colors.grey }}>Drag and drop files here, or <KText style={{ color: "black" }}>click to browse</KText></KText>}
                </View>}
            </div>
        </>
    )
}