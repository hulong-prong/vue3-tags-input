<script lang="ts" setup>
import {
  PropType,
  onMounted,
  onUnmounted,
  reactive,
  toRef,
  ref,
  nextTick,
  computed,
} from "vue"
import { stateType } from "./type"
import Tag from "./Tag.vue"

const props = defineProps({
  value: {
    type: Object as PropType<string[]>,
  },
  defaultValue: {
    type: Object as PropType<string[]>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "请输入",
  },
  checkTag: {
    type: Function as PropType<(val: string) => Promise<string>>, // 返回值决定校验是否通过，通过才会添加为tag
  },
})
const emit = defineEmits<{
  (event: "change", tags: string[]): void
  (event: "update:value", tags: string[]): void
}>()
const inputRef = ref<HTMLInputElement>() // 输入框
const tagsContainerRef = ref<HTMLDivElement>() // 外部输入框容器
const tagInputLabelRef = ref<HTMLSpanElement>() // 输入框label

const tags = toRef(props, "value")
const state = reactive<stateType>({
  inputValue: "",
  boxWidth: 0,
  isError: false,
  errorText: "",
  focus: false,
  hasText: false, // 验证是否输入文本的，因为inputVal有延迟
})
/**
 * @description: 设置label的默认值，用于高度撑开
 * @return {*}
 */
const setLabelDefaultValue = () => {
  if (tagInputLabelRef.value) tagInputLabelRef.value.innerHTML = "&nbsp;"
}

/**
 * @description: 输入框回车键回调
 * @param {*} e
 * @return {*}
 */
const enterInput = async () => {
  if (state.inputValue) {
    // 将新的tag传递回去
    try {
      await props.checkTag?.(state.inputValue)
      const newTags = tags.value
        ? [...tags.value, state.inputValue]
        : [state.inputValue]
      emit("update:value", newTags)
      emit("change", newTags)
      // 清空输入框的值
      state.inputValue = ""
      setLabelDefaultValue()
      return
    } catch (error: any) {
      // TODO: 校验失败了，错误提示，将border变成红色
      state.isError = true
      state.errorText = error
    }
  }
}
/**
 * @description: 点击外部容器获取输入框焦点
 * @return {*}
 */
const clickContainer = () => {
  inputRef.value?.focus()
}
/**
 * @description: 输入框, 动态改变输入框的大小
 * @return {*}
 */
const inputEvent = () => {
  if (inputRef.value?.value) {
    state.hasText = true
  } else {
    state.hasText = false
  }
  // 去除错误
  state.isError = false
  state.errorText = ""
  if (tagInputLabelRef.value) {
    if (inputRef.value?.value) {
      tagInputLabelRef.value.innerHTML = `${inputRef.value?.value}&nbsp;`
    } else {
      setLabelDefaultValue()
    }
  }
}
/**
 * @description: 删除Input
 * @return {*}
 */
const deleteInput = () => {
  // 当输入框没有数据的时候触发删除前一个tag
  if (!inputRef.value?.value && tags.value && tags.value.length > 0) {
    tags.value.splice(tags.value.length - 1, 1)
    emit("change", tags.value)
  }
}
/**
 * @description: 获取焦点设置样式
 * @return {*}
 */
const inputFocus = () => {
  state.focus = true
}
/**
 * @description: 失去焦点的时候，将值给抛弃
 * @return {*}
 */
const inputBlur = () => {
  state.hasText = false
  state.inputValue = ""
  setLabelDefaultValue()
  state.focus = false
  state.isError = false
  state.errorText = ""
}

/**
 * @description: 点击删除tag
 * @param {*} index
 * @return {*}
 */
const deleteTag = (index: number) => {
  if (index >= 0) {
    tags.value?.splice(index, 1)
    emit("change", tags.value ?? [])
  }
}
/**
 * @description: 用于判断是否显示placeholder
 * @param {*} computed
 * @return {*}
 */
const showPlaceholder = computed(() => {
  if (!tags.value?.length && !state.hasText) {
    return true
  }
  return false
})

// 缩放函数
const resizeContainerDom = () => {
  nextTick(() => {
    state.boxWidth = tagsContainerRef.value?.clientWidth ?? 0
  })
}

onMounted(() => {
  tagsContainerRef.value?.addEventListener("resize", resizeContainerDom)
  // 设置容器款第
  state.boxWidth = tagsContainerRef.value?.clientWidth ?? 0
})
onUnmounted(() => {
  tagsContainerRef.value?.removeEventListener("resize", resizeContainerDom)
})
</script>

<template>
  <div>
    <div
      ref="tagsContainerRef"
      class="tags_input_container"
      :class="{
        error_box: state.isError,
        disabled_box: disabled,
        focus_box: state.focus,
      }"
      @click="clickContainer"
    >
      <Tag
        v-for="(tag, index) in tags"
        :key="tag"
        :tag="tag"
        :maxWidth="state.boxWidth"
        @delete="() => deleteTag(index)"
        :disabled="disabled"
      ></Tag>
      <div class="input_width_box">
        <label id="tag_input_label" ref="tagInputLabelRef" for="tag_input"
          >&nbsp;</label
        >
        <input
          ref="inputRef"
          id="tag_input"
          class="tag_input"
          type="text"
          :disabled="disabled"
          v-model="state.inputValue"
          autocomplete="off"
          @keyup.enter="enterInput"
          @keyup.delete="deleteInput"
          @blur="inputBlur"
          @focus="inputFocus"
          @input="inputEvent"
        />
      </div>
      <span
        v-if="showPlaceholder"
        class="placeholder_box"
        :style="{
          maxWidth: state.boxWidth ? `${state.boxWidth - 20}px` : 'auto',
        }"
        >{{ placeholder }}</span
      >
    </div>
    <div v-if="state.isError" class="error_text">
      {{ state.errorText }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.tags_input_container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid #ccc;
  padding: 2px 4px;
  min-height: 32px;
  &:hover {
    border-color: #40a9ff;
  }
  #tag_input_label {
    visibility: hidden;
    white-space: pre;
  }
  .input_width_box {
    min-width: 4px;
    padding-right: 4px;
    position: relative;
  }
  .tag_input {
    position: absolute;
    outline: none;
    left: 0;
    top: 0;
    width: 100%;
  }
}
.focus_box {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.disabled_box {
  cursor: not-allowed;
  color: #00000040;
  border-color: #d9d9d9;
  background: #f5f5f5;
  text-shadow: none;
  box-shadow: none;
}
.error_box {
  border-color: red;
  box-shadow: none;
}
.error_text {
  text-align: left;
  color: red;
  font-weight: 400;
  position: absolute;
}
.placeholder_box {
  position: absolute;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #d9d9d9;
}
</style>
