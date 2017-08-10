<template>
    <div class="text-input">
        <input class="input" :placeholder="placeholder" :value="value" @input="$emit('input', $event.target.value)" :type="type" />
        <span></span>
    </div>    
</template>
<script>
export default {
    props: {
        placeholder: String,
        value: String,
        type: {
            type: String,
            default: 'text'
        }
    },
    data () {
        return {

        }
    }
}
</script>
<style lang="sass" scoped>
.text-input {
    position: relative;
    input {
        height: 26px;
        width: 200px;
        border: none;
        background: transparent;
        text-align: center;
        font-weight: bold;
        font-size: 20px;
        font-family: serif;
        &:focus {
            outline: none;
        }
    }
    .input {
        border-bottom: 2px solid #f5f5f5;
        margin-left: 50%;
        transform: translateX(-50%);
        & + span {
            height: 2px;
            width: 0px;
            transition: .3s cubic-bezier(0.18, 0.89, 0.32, 1.28);;
            transform-origin: center;
            background-color: #2888e5;
            margin-left: 50%;
            margin-top: -2px;
            transform: translateX(-50%);
            position: absolute;
        }
        &:focus {
            & + span {
                width: 200px;
            }
        }
    }
    ::-webkit-input-placeholder {
        color: #d0d0d0;
    }
}
</style>


