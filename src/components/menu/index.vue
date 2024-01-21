<script setup lang="ts">
import ButtonMenu from './buttonsMenu/index.vue'
import MenuSelect from './selectMenu/index.vue'
</script>

<script lang="ts">
export default {
    name: 'Menu',
    props: ['newActiveButton', 'newSelected'],
    mounted() {},
    methods: {
        changeSelect(value: string) {
            this.$emit('changeSelect', value)
        },
        changeButton(value: string) {
            this.$emit('changeButton', value)
        }
    }
}
</script>

<template>
    <div class="root">
        <ButtonMenu
            @change-button="changeButton"
            :newActiveButton="newActiveButton"
        />
        <MenuSelect @change-select="changeSelect" :newSelected="newSelected" />
    </div>
</template>

<style scoped>
.root {
    display: flex;
    gap: 10px;
}
</style>
