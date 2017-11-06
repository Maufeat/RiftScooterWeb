<template>
    <button class="button_test" :class="className + ' ' + type" @click="$emit('click')" :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";

    export type ButtonType = "normal" | "confirm" | "deny";

    @Component
    export default class LCUButton extends Vue {
        @Prop({ default: false })
        disabled: boolean;

        @Prop({ default: "" })
        className: string;

        @Prop({ default: "normal" })
        type: ButtonType;
    }
</script>

<style lang="stylus" scoped>
    .button_test
        cursor: pointer
        width: 100%
        padding: 12px;
        background-color: #1e2328;
        border: 2px solid transparent;
        border-color: #0596aa;
        -moz-border-image: -moz-linear-gradient(top,#0596aa 0,#005a82 100%);
        -webkit-border-image: -webkit-linear-gradient(top,#0596aa 0,#005a82 100%);
        border-image: linear-gradient(to bottom,#0596aa 0,#005a82 100%);
        border-image-slice: 1;
        position: relative;
        font-family "LoL Display Bold",sans-serif
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-smoothing: antialiased;
        font-size: 14px;
        letter-spacing: 1.2px;
        color: #b2d9db;
        text-transform: uppercase;
        text-decoration: none;
        transition: all .4s ease;

        &:hover
            &:before
                opacity: .5;
                animation-play-state: running;
            &:after
                animation-name: flashingBG;
                animation-duration: .8s;
                animation-timing-function: ease-out;
                animation-fill-mode: forwards;

        &:before
            content: '';
            display: block;
            background: url(https://signup.na.leagueoflegends.com/assets/img/button-bg-pattern.png) repeat-x top left;
            background-size: auto 100%;
            background-position: 0 0;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: .3;
            animation: movingBG 500s linear infinite;
            animation-play-state: paused;
            will-change: background-position;

        &:after
            content: '';
            display: block;
            background: linear-gradient(to bottom,rgba(205,250,250,0) 0,rgba(205,250,250,0) 60%,rgba(205,250,250,.4) 100%);
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;

        &.normal
            color #cdbe91
            border-image linear-gradient(to top, #785b28 0%, #c89c3c 55%, #c8a355 71%, #c8aa6e 100%) 1 stretch
            &:hover
                background-color: #3d3e2f;
                color #d7c998
            &:before
                filter: hue-rotate(200deg);

        &.confirm
            border-color: #0596aa;
            -moz-border-image: -moz-linear-gradient(top,#0596aa 0,#005a82 100%);
            -webkit-border-image: -webkit-linear-gradient(top,#0596aa 0,#005a82 100%);
            border-image: linear-gradient(to bottom,#0596aa 0,#005a82 100%);
            border-image-slice: 1;
            &:hover
                background-color: #202f3e;
                color: #cdfafa;

        &.deny
            color #bd253c
            border-image linear-gradient(to top, #c6403b 0%, #f9413f 44%, #ec3930 93%, #ee241d 100%) 1 stretch
            &:hover
                background-color: #3e2625;
                color #cd253c
            &:before
                filter: hue-rotate(160deg);

        &[disabled]
            cursor not-allowed
            background-color #1e2328
            color #5c5b57
            border-image linear-gradient(to top, grey 0%, #a99092 44%, grey 93%, #a99092 100%) 1 stretch
            filter: grayscale(100%);
            &:hover
                color #5c5b57
                background-color #1e2328
                &:before
                    animation-play-state: paused;
                    opacity: .3;
                &:after
                    display none

    @keyframes movingBG
        from
            background-position:0 0
        to
            background-position:10000px 0

    @keyframes flashingBG
        0%
            opacity:0
        100%
            opacity:.3
</style>