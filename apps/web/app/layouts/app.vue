<script setup lang="ts">
const route = useRoute()

const showAppShell = computed(() => route.meta.appShell !== 'none')

const contentPadClass = computed(() => {
  if (!showAppShell.value) return ''
  return 'pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0'
})
</script>

<template>
  <div
    class="box-border flex min-h-dvh w-full flex-col items-center bg-gradient-to-br from-nomi-emerald via-nomi-deep to-[#004d34] font-sans text-nomi-mint"
  >
    <AppDesktopHeader v-if="showAppShell" />
    <div
      class="flex w-full flex-1 flex-col items-center"
      :class="contentPadClass"
    >
      <slot />
    </div>
    <AppMobileTabBar v-if="showAppShell" />
  </div>
</template>
