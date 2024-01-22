<script lang="ts">
export default {
    name: 'MenuSelect',
    props: ['newSelected'],
    emits: ['changeSelect'],
    data() {
        return {
            enterprises: ['Todos', 'Wikipedia', 'Google', 'Github', 'Example'],
            selected: 'Todos'
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
    <select id="cars" v-model="selected" name="cars" @change="selectButton()">
        <option
            v-for="enterprise in enterprises"
            :value="enterprise"
            :key="enterprise"
        >
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
