import { JsonObject, JsonProperty } from "json2typescript"


@JsonObject("GoogleImg")
export default class GoogleImg {

    @JsonProperty("title", String, true)
    title?: string = undefined
    @JsonProperty("link", String, true)
    link?: string = undefined

}