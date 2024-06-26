import { ActivityIndicator, Image, ImageBackground, Pressable, TextStyle, View } from "react-native"
import FormField from "../../Form/FormField/FormField"
import variables from "../../../styles/variables"
import { RefObject, createRef, useEffect, useRef, useState } from "react"
import { Property } from "."
import KImageUpload, {Handle as KImageUploadHandle, KImageUploadWidth} from "../../KImageUpload"
import properties from "../../../api/properties"
import useIsMobile from "../../../hooks/useIsMobile"
import KDragAndDropZone from "../../Form/KDragAndDropZone"
import CheckBox from "../../CheckBox/CheckBox"
import KText from "../../KText"
import KButton from "../../KButton/KButton"
import { toastError } from "../../Toast/Toast"
import useConfig from "../../../hooks/useConfig"

type Props = {
    onChange: (property:Property) => void,
    property: Property,
    showRotate?: boolean,
}

export default (props:Props) => {
    // if(props.showRotate === undefined) props.showRotate = false
    const {config} = useConfig()
    const [pics, setPics] = useState<string[]>(props.property.pics || [])
    const [primaryImage, setPrimaryImage] = useState<string | undefined>(props.property.primaryImage || (props.property.pics ? props.property.pics[0] : undefined))
    const {isMobile} = useIsMobile()
    const iuRef = useRef<KImageUploadHandle>(null)
    const [imageLoading, setImageLoading] = useState<(false | string)[]>([])
    const [picsRotate, setPicsRotate] = useState<number[]>(new Array(pics.length).fill(0))
    const [imagesLoading, setImagesLoading] = useState<boolean[]>(new Array(pics.length).fill(false))

    useEffect(() => {
        // console.log("pics", pics.map(p => !!p))
        props.onChange({...props.property, pics})
        setImageLoading(new Array(pics.length).fill(false))
    }, [pics])

    useEffect(() => {
        // console.log("pics", pics.map(p => !!p))
        props.onChange({...props.property, primaryImage: primaryImage})
    }, [primaryImage])

    useEffect(() => {
        if(props.property.pics && props.property.pics.length !== pics.length) {
            setPics([...props.property.pics])
            if(props.property.pics.length === 1)
                setPrimaryImage(props.property.pics[0])
        }
    }, [props.property.pics])

    useEffect(() => {
        console.log(imageLoading)
    }, [imageLoading])

    const uploadFn = async (b64array:string[]) => {
        if(!props.property.id)  return;
        setImageLoading([...imageLoading].concat([...b64array]))
        const imgs = b64array.map(b64 => b64.startsWith("data:image/") ? b64.split(",")[1] : b64)
        const res = await properties.pictures.post(props.property.id, imgs)
        if(props.property.pics && props.property.pics.length === 0)
            setPrimaryImage(res.data.images[0])
        return res.data.images
    }

    const onLoadedFn = (b64array:(string | null)[]) => {
        b64array.forEach(b64 => {
            if(b64) pics.push(b64.startsWith("data:image/") ? b64.split(",")[1] : b64)
        })
        // console.log(pics)
        setPics([...pics]);
        setImageLoading(new Array(pics.length).fill(false))
    }

    const rotateFn = async (id:string, degrees:number) => {
        if(!props.property.id)  return;
        const res = await properties.pictures.rotate(props.property.id, id, degrees)
        setPics(res.data.images.split(","))
        return res.data.images
    }

    const nbSquares = Math.max(imageLoading.length, pics.length, 6)
    return <View style={{
        width: "100%",
        }}>
        <FormField label={isMobile ? "" : "Add pictures of your place"} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <KDragAndDropZone
                onPress={() => iuRef.current?.open()}
                style={{
                    width: "99%",
                    height: isMobile ? 130: 200,
                    borderWidth: 1,
                    borderColor: variables.colors.grey,
                    borderStyle: "dashed",
                    borderRadius: 20,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 10
                }}
                onDrop={(f) => {
                    Promise.all(f)
                    .then(ff => iuRef.current?.onFiles(ff))
                }}/>
            <View style={{
                maxWidth: (KImageUploadWidth*3)+(2*20),
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                // flexBasis: "30%",
                width: isMobile ? (KImageUploadWidth*2)+20 : "100%",
            }}>
                {pics.map((pic, i) => {
                    return <View
                        style={{marginRight: 10}}
                        key={`pic_${i}`}
                        >
                        <KImageUpload
                            pressable={false}
                            imageId={props.property.id+"/"+pics[i]}
                            type="properties"
                            loading={imagesLoading[i]}
                            imageStyle={{
                                transform: `rotate(${picsRotate[i]}deg)`,
                            }}
                            thumbnail={false}
                            onDeleted={() => {
                                const newPics = [...pics];
                                newPics.splice(i, 1);
                                setPics([...newPics]);
                            }}
                            deleteFn={async () => {
                                if(!props.property.id)  return;
                                await properties.pictures.delete(props.property.id, pics[i])
                            }}
                            onLoaded={(b64) => {
                                if(!b64) return;
                                pics[i] = b64[0]!;
                                setPics([...pics]);
                            }}
                            />
                        <View style={{
                            display: props.showRotate ? "flex" : "none",
                            flexDirection: "row",
                            position: "absolute",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            width: "100%",
                            bottom: 30,
                        }}>
                            <KText style={{
                                color: variables.colors.grey,
                                fontSize: 20,
                                textAlign: "center",
                                backgroundColor: "#000000",
                                padding: 1,
                                borderRadius: 50,
                                width: 35
                            }} onPress={() => {
                                if(imagesLoading[i]) return;
                                picsRotate[i] = (picsRotate[i]+90)%360
                                setPicsRotate([...picsRotate])
                            }}>↻</KText>
                            <KButton
                                text="Save"
                                onPress={() => {
                                    imagesLoading[i] = true
                                    setImagesLoading([...imagesLoading])
                                    return rotateFn(pic, picsRotate[i])
                                    .catch(() => {toastError("Failed to save rotation")})
                                    .finally(() => {
                                        picsRotate[i] = 0
                                        setPicsRotate([...picsRotate])
                                        imagesLoading[i] = false
                                        setImagesLoading([...imagesLoading])
                                    })
                                }}
                                loading={imagesLoading[i]}
                                disabled={picsRotate[i] === 0}
                                style={{height: 25, width: 50}}/>
                        </View>
                        <CheckBox
                            checked={primaryImage === pic}
                            name={"Main picture"}
                            onPress={() => setPrimaryImage(pic)}
                            style={{
                                marginTop: 2,
                                width: "100%",
                                alignContent: "center",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            />
                    </View>
                })}
                <View style={{display: "none"}}>
                    <KImageUpload
                        key={`pic_new`}
                        ref={iuRef}
                        multiple={true}
                        src={null}
                        onDeleted={() => {}}
                        uploadFn={uploadFn}
                        resizeMaxSize={config?.images.properties.resizePx || 1200}
                        onLoading={loading => {
                            if(loading) {
                                const narray = [...imageLoading, ""]
                                console.log(loading, narray)
                                setImageLoading(narray)
                            } else {
                                setImageLoading([...imageLoading.slice(0, imageLoading.length-1), false])
                            }
                        }}
                        onLoaded={b64 => {
                            if(!b64) return;
                            onLoadedFn(b64)
                        }}
                        />
                </View>
                {pics.length < nbSquares ? new Array(pics.length > nbSquares ? 1 : nbSquares - pics.length).fill(0).map((_, i) => {
                    return <Pressable onPress={() => iuRef.current?.open()}
                    style={{
                        marginRight: 10,
                        width: KImageUploadWidth,
                        height: KImageUploadWidth,
                        borderWidth: 1,
                        borderColor: variables.colors.greenLight,
                        backgroundColor: variables.colors.greenLight,
                        borderRadius: 20, 
                        marginTop: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }} key={`pic_placeholder_${i}`}>
                        {imageLoading[i+pics.length] ? 
                        <View style={{width: "100%", height: "100%", borderRadius: 20}}>
                            <Image
                                source={{uri: imageLoading[i+pics.length] as string}}
                                style={{width: "100%", height: "100%", borderRadius: 20}} />
                            <View style={{width: "100%", height: "100%", backgroundColor: "#000000aa", position: "absolute", borderRadius: 20}} />
                            <ActivityIndicator size="large" color={variables.colors.yellow} style={{position: "absolute", width: "100%", height: "100%"}} />
                        </View> : null}
                    </Pressable>
                }) : null}
            </View>
        </FormField>
    </View>
}