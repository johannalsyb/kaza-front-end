import { useEffect, useState } from "react"
import useAuthentication from "../../../hooks/useAuthentication"
import { Api } from "../../../common"
import users from "../../../api/users"
import { toastError } from "../../Toast/Toast"
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native"
import variables from "../../../styles/variables"
import KText from "../../KText"
import { timeAgo } from "../../../utils"
import KIcon from "../../KIcon/KIcon"
import { CircleImage } from "../../CircleImage/CircleImage"
import useIsMobile from "../../../hooks/useIsMobile"
import KButton from "../../KButton/KButton"
import storage from '../../../utils/Storage/storageNew'

type Props = {
  unreadNotifications: number,
}

export default (props: Props) => {
  const auth = useAuthentication()
  const { isMobile } = useIsMobile()
  const [loading, setLoading] = useState<boolean>(true)
  const [notifications, setNotifications] = useState<Api.Users.Notifications>()
  const [hovered, setHovered] = useState<string | null>(null);

  const readNotification = (id: string) => {
    return auth.notifications.read(id)
      .then(async () => {
        setNotifications(notifications?.filter(nn => id !== nn.id));

        const newCount = (notifications?.length || 1) - 1;
        await storage.setItem("unreadNotifications", `${newCount}`);
      });
  };

  const readAllNotifications = () => {
    return auth.notifications.readAll()
      .then(async () => {
        setNotifications([]);
        await storage.setItem("unreadNotifications", `0`);
      });
  };


  useEffect(() => {
    if (!auth.user) return
    setLoading(true)
    auth.notifications.get()
      .then(setNotifications)
      .catch(e => {
        if (typeof e === "object") {
          // DO NOTHING
        } else {
          toastError(e)
        }
      })
      .finally(() => setLoading(false))

  }, [props.unreadNotifications])

  if (!auth.user || loading) return <ActivityIndicator color={variables.colors.yellow} />

  if (notifications?.length) {
    return <View style={{
      flex: 1,
      width: isMobile ? "100%" : 320,
      paddingTop: isMobile ? 10 : 0,
      paddingLeft: isMobile ? 10 : 0,
      paddingRight: isMobile ? 10 : 0,
      backgroundColor: variables.colors.white,
    }}>
      {!isMobile && <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        <KText style={{ textAlign: "left" }}>Notifications</KText>
        <KText
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginRight: isMobile ? 40 : 0
          }}
          onPress={() => readAllNotifications()}>
          <KIcon name="tickCircle" size="small" style={{ marginRight: 5 }} />
          Mark all as read
        </KText>
      </View>}
      <ScrollView>
        {notifications.map(n => {
          const notificationTimeAgo = timeAgo(n.time)
          const isHovered = hovered === n.id || hovered === n.id + "_delete"
          return <View
            key={n.id}
            style={{
              padding: 5,
              backgroundColor: n?.title?.toLowerCase()?.includes("accepted") ? variables.colors.green : variables.colors.yellow,
              marginBottom: 5,
              borderRadius: 15,
              maxHeight: 70
            }}>
            <Pressable
              onHoverIn={() => setHovered(n.id)}
              onHoverOut={() => setHovered(null)}
              onPress={() => {
                if (n.url) Linking.openURL(n.url)
                readNotification(n.id)
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              {n.from ? <CircleImage source={users.getProfilePictureUrl(n.from)} size="xxsmall" style={{ marginRight: 10, borderWidth: 0 }} /> : null}
              {isMobile && <KText style={{ textAlign: "right", position: "absolute", right: 5, top: 5, fontSize: 10, fontWeight: '500', opacity: 0.5 }}>{notificationTimeAgo}</KText>}
              <View style={{ flexDirection: "column", alignItems: "flex-start", gap: 5 }}>
                <KText style={{ textAlign: "right", fontSize: 13, fontWeight: '500' }}>{n.title || "Click to open"}</KText>
                <KText style={{ textAlign: "right", fontSize: 10, fontWeight: '500', opacity: 0.5 }}>{notificationTimeAgo}</KText>
              </View>
            </Pressable>
            {/* <Pressable
              onHoverIn={() => setHovered(n.id + "_delete")}
              onHoverOut={() => setHovered(null)}
              onPress={() => readNotification(n.id)}
              style={{
                backgroundColor: variables.colors.orange,
                position: "absolute",
                borderRadius: 20,
                padding: 5,
                right: 0,
                top: -2,
                display: isHovered ? "flex" : "none",
                zIndex: 100,
              }}>
              <KIcon name="crossCircle" />
            </Pressable> */}
          </View>
        })}
      </ScrollView>
      {isMobile && (
        <KButton
          text={"Mark all as read"}
          onPress={() => readAllNotifications()}
          color="primary"
          style={{ zIndex: 101, paddingHorizontal: 10, paddingVertical: 30, position: "absolute", bottom: 160, alignSelf: "center", minWidth: 170 }}
          textStyle={{ color: variables.colors.white }}
          iconPosition="left"
          icon="tickCircle"
          iconStyle={{ opacity: 0.5, stroke: variables.colors.white }}
        />
      )}
    </View>
  } else {
    return (isMobile ?
      <View style={{
        flex: 1,
        width: '100%',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: variables.colors.greenLight,
      }}>
        <KText
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: '600',
            fontSize: 25,
            lineHeight: 29,
            letterSpacing: -0.5
          }}
        >
          No Notifications Yet
        </KText>
        <KText
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: '500',
            fontSize: 15,
            lineHeight: 21,
            letterSpacing: -0.5,
            opacity: 0.5,
            textAlign: 'center',
            width: '80%'
          }}
        >
          No worries, once you send a swap request, you'll start receiving updates here!
        </KText>
      </View>
      :
      <View style={{ paddingVertical: 5, paddingHorizontal: 15 }}>
        <KText
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: '500',
            fontSize: isMobile ? 18 : 12
          }}
        >
          You don't have any notifications
        </KText>
      </View>)
  }
}