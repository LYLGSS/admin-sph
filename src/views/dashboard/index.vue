<template>
  <div class="dashboard-container">
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'

export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    this.$store.dispatch('home/getData')
  }
}
</script>

<style lang="scss" scoped>
// .dashboard {
// &-container {
//   margin: 10px;
// }
// &-text {
//   font-size: 30px;
//   line-height: 46px;
// }
// }
</style>
