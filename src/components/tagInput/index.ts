import { App } from "vue"
import TagInput from "./index.vue"

export { TagInput }

export default {
  install(app: App) {
    app.component("TagInput", TagInput)
  },
}
