<template>
  <create-or-edit :isEdit="true"/>
</template>

<script>
import CreateOrEdit from './component/createOrEdit.vue'

export default {
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  }
}
</script>

<style>

</style>