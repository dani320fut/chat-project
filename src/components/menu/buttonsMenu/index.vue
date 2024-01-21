<script lang="ts">
import { LabelType } from '../../../constants/index'

type ButtonData = {
    buttons: string[]
    activeButton: (typeof LabelType)[keyof typeof LabelType]
}
export default {
    name: 'ButtonsMenu',
    props: ['newActiveButton'],
    data() {
        return {
            buttons: [
                LabelType.TODAY,
                LabelType.WEEK,
                LabelType.MONTH,
                LabelType.YEAR
            ],
            activeButton: LabelType.YEAR
        } as ButtonData
    },
    watch: {
        newActiveButton: function (
            newId: (typeof LabelType)[keyof typeof LabelType]
        ) {
            this.activeButton = newId
        }
    },
    mounted() {},
    methods: {
        changeButton(newId: string) {
            this.$emit('changeButton', newId)
        }
    }
}
</script>

<template>
    <div class="root">
        <button
            v-for="button in buttons"
            :class="['button', button === activeButton ? 'active' : '']"
            @click="changeButton(button)"
        >
            {{ button }}
        </button>
    </div>
</template>

<style scoped>
.root {
    display: flex;
    justify-content: end;
    gap: 10px;
}

.button {
    font-weight: 550;
    min-width: 35px;
    height: 35px;
    border: 0px;
    border-radius: 6px;
    color: #9c9ca0;
    background-color: #f3f4f6;
    transition:
        background-color 0.5s ease,
        color 0.5s ease,
        transform 0.5s ease;
}

.active,
.button:hover {
    background-color: #f0f9ff;
    color: #147199;
    cursor: pointer;
}

@media (max-width: 400px) {
    .root {
        flex-wrap: wrap;
    }
}
</style>
