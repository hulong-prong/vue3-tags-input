<script setup lang="ts">
import { ref } from "vue"
import TagInput from "./components/tagInput/index.vue"
const tags = ref<string[]>([])
const handleCheckTag = (value: string) => {
  if (tags.value.includes(value)) {
    return Promise.reject("tag已存在")
  }
  return Promise.resolve("")
}
</script>
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
