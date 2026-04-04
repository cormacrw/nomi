<script setup>
useHead({
  title: 'Nomi',
  meta: [
    { name: 'description', content: 'Social that stays between people you actually know.' },
  ],
})
</script>

<template>
  <div class="page">
    <main class="main">
      <p class="eyebrow">Private social</p>
      <h1 class="title">Nomi</h1>
      <p class="lede">
        Connections limited to people you actually know — verified by phone, discovered on purpose.
      </p>
    </main>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
}

.page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: radial-gradient(120% 80% at 50% 0%, #0f3d24 0%, #0a0f0c 55%, #050706 100%);
  color: #e8f5ec;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.main {
  max-width: 28rem;
  text-align: center;
}

.eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7dd3a0;
}

.title {
  margin: 0 0 1rem;
  font-size: clamp(2.5rem, 8vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.lede {
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.55;
  color: #b8d4c4;
}
</style>
