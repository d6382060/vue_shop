<template>
  <!-- <router-view></router-view> -->
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script>

export default {
  name: 'App',

}
</script>

<style>
</style>
