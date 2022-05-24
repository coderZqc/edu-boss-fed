<template>
  <create-or-edit :isEdit="false" />
</template>

<script>
import CreateOrEdit from './component/createOrEdit.vue'

export default {
  name: 'MenuCreate',
  components: {
    CreateOrEdit
  }
}
</script>

<style>

</style>