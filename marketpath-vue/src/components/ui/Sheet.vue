<script setup lang="ts">
import { DialogRoot } from "reka-ui";

const props = defineProps<{ open?: boolean }>();
const emit = defineEmits<{ (e: "update:open", value: boolean): void }>();
</script>

<template>
  <DialogRoot
    :open="props.open"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <slot />
  </DialogRoot>
</template>
