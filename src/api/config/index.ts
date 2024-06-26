import Api from "../../common/types/api";
import api from "..";
export * from  "./config"

export default {
    get: () => api.get<Api.Config.Response>(`/config`)
}