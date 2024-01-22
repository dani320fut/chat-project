<script setup lang="ts"></script>

<script lang="ts">
export default {
    name: 'MenuSelect',
    props: ['newSelected'],
    data() {
        return {
            enterprises: ['All', 'Wikipedia', 'Google', 'Github', 'Example'],
            selected: 'All'
        }
    },
    watch: {
        newSelected: function (newSelected) {
            this.selected = newSelected
        }
    },
    methods: {
        selectButton() {
            this.$emit('changeSelect', this.selected)
        }
    }
}
</script>

<template>
    <select name="cars" id="cars" @change="selectButton()" v-model="selected">
        <option v-for="enterprise in enterprises" :value="enterprise">
            {{ enterprise }}
        </option>
    </select>
</template>

<style scoped>
select {
    border-color: #adadad;
    border-radius: 8px;
    outline: 0;
    color: rgb(97, 97, 97);
    padding: 5px 10px 5px 10px;
    cursor: pointer;
    height: 35px;
}
@media (max-width: 400px) {
    select {
        height: 30px;
    }
}
</style>
