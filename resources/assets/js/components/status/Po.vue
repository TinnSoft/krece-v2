<template>
    <span>
        <div v-if="id === 1" class="my-label text-white bg-secondary">
            <small>Borrador</small>
        </div>
        <div v-else-if="id === 2" class="my-label text-white bg-orange">
            <small>Anulada</small>
        </div>
         <div v-else-if="id === 3" class="my-label text-white bg-green">
            <small>Facturada</small>
        </div>
    </span>
</template>
<script type="text/javascript">


export default {
    props: ['id']
}
</script>
<style lang="stylus">
.my-label
  padding 4px
  border-radius 3px
  display inline-block
</style>