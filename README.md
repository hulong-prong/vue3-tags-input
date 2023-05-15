## vue3-tags-input

这是基于 vue3 的 tags 输入框
<br />

## 示例

```html
<template>
  <div class="w-[600px]">
    <TagInput
      v-model:value="tags"
      placeholder="请输入"
      :check-tag="handleCheckTag"
      :disabled="false"
    >
    </TagInput>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import TagInput from "vue-tags-input"

const tags = ref<string[]>([])
// 错误校验示例
const handleCheckTag = (value: string) => {
  if (tags.value.includes(value)) {
    return Promise.reject("tag已存在")
  }
  return Promise.resolve("")
}
```

### props

value: string[] // tags 值
placeholder: string
disabled: boolean
check-tag: () => Promise<T>

### emit

change: (tags: string[]) => void
