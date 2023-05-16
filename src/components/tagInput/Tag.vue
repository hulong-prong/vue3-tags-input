<script lang="ts" setup>
import { computed } from "vue"
import deleteIcon from "../../assets/deleteIcon.png"

const props = defineProps({
  tag: String,
  maxWidth: Number,
  disabled: {
    type: Boolean,
    defalut: false,
  },
})
const emit = defineEmits<{
  (event: "delete"): void
}>()

const deleteTag = () => {
  if (props.disabled) return
  emit("delete")
}

/**
 * @description: 设置最大宽度
 * @param {*} computed
 * @return {*}
 */
const maxDomWidth = computed(() => {
  return !props.maxWidth ? "auto" : `${props.maxWidth! - 28}px`
})
</script>

<template>
  <div class="tag_item_box" :title="tag" :class="{ disabled_box: disabled }">
    <span :style="{ maxWidth: maxDomWidth }" class="tag_value">{{ tag }}</span>
    <span @click="deleteTag">
      <img
        class="delete_icon"
        :class="{ disabled_icon: disabled }"
        :src="deleteIcon"
      />
    </span>
  </div>
</template>

<style lang="less" scoped>
.tag_item_box {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #f0f0f0;
  padding: 0 4px 0 8px;
  margin: 2px 4px 2px 0px;
}
.tag_value {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
}
.delete_icon {
  width: 10px;
  object-fit: contain;
  margin-left: 4px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
}
.disabled_icon {
  cursor: not-allowed;
}
.disabled_box {
  border: 1px solid #ccc9c9;
  cursor: not-allowed;
}
</style>
