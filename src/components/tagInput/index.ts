import { App } from "vue"
import TagInput from "/@/components/tagInput/index.vue"

export { TagInput }

export default {
  install(app: App) {
    app.component("TagInput", TagInput)
  },
}
