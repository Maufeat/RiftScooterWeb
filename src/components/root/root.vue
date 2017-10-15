<template>
    <div>
        <div v-if="!connected" class="intro">
            <span class="header">Welcome to RiftScooter</span>

            <div class="manual">
                <span>Enter your computer's IP address.</span>
                <input v-model="hostname" placeholder="192.168.1.1">
                <lcu-button :disabled="(!hostname) || connecting" :type="manualButtonType" @click="connect()">Connect</lcu-button>
            </div>
        </div>

        <div v-else="" class="body">
            <div class="left-sidebar">
                <ul id="client-list">
                    <li v-for="item in instances">
                        <div class="sum-icon">
                            <img :src="getSummonerIcon(1)">
                        </div>
                        <div class="client-name">
                            <h2>{{ item.clientName }}</h2>
                            <small>{{ item.clientStatus }}</small>
                        </div>
                    </li>
                </ul>
                <div class="btn-pad">
                    <lcu-button :type="manualButtonType" @click="addNewClient()">Add new Client</lcu-button>
                </div>
            </div>
            <div class="main">
                <champ-select></champ-select>
                <ready-check></ready-check>
                <invites></invites>
                <queue></queue>
                <lobby></lobby>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./root.ts"></script>

<style lang="stylus" scoped>
    :focus
        outline 0
    // Intro
    // Position the message in the center.
    .intro
        position absolute
        background-image url(../../static/magic-background.jpg)
        left 0
        top 0
        right 0
        bottom 0
        display flex
        flex-direction column
        justify-content center
        align-items center

        .header
            position absolute
            top 100px
            left 0
            right 0
            text-align center
            font-family "LoL Header"
            font-size 80px
            color #f0e6d3
            padding 50px
            & > small
                font-size 60px
                color #dcd2bf

        .automatic, .manual
            width 95%
            display flex
            flex-direction column
            justify-content center
            align-items center
            padding 20px 0
        .automatic > span, .manual > span
            color #f0e6d3
            font-family "LoL Body"
            font-size 40px
            padding 10px 10px 20px 20px
            align-self flex-start
        .or
            width 100%
            display flex
            align-items center
            justify-content space-around
            flex-direction row
        .or div
            flex 1 0
            height 3px
            background-color alpha(#fffce1, 0.6)
        .or span
            flex 0
            padding 10px
            color #d5d9c9
            font-family "LoL Body"
            font-size 40px
        .manual input
            width 100%
            box-sizing border-box
            height 110px
            padding 20px
            margin 10px 60px 30px 60px
            -webkit-appearance none
            outline none
            border-radius 0
            color #f0e6d2
            font-size 40px
            font-family "LoL Body"
            border 3px solid #785a28
            background-color black

    // Make sure the body has the full size.
    .body
        display flex
        flex-direction row
        height 100%
        background-color black
        background-image url(../../static/magic-background.jpg)
        background-size cover
        background-position center
        overflow hidden

        .left-sidebar
            width 300px
            background-color #101217
            display flex
            flex-direction column
            box-shadow 0 0 15px 5px rgba(0,0,0,0.5)
            z-index 9999
            overflow hidden

            .btn-pad
                padding 15px

            #client-list
                height 100%
                list-style none
                padding 0
                margin 0
                overflow-y auto
                overflow-x hidden

                li
                    color rgba(255,255,255,0.5)
                    border-bottom 2px solid #32281f
                    transition all 0.2s
                    padding 10px
                    cursor pointer
                    display flex

                    &:hover
                        color rgba(255,255,255,0.8)
                        border-color #7e633b
                        background-color #14181d

                    .sum-icon
                        margin-right 10px
                        img
                            width 60px
                            height 60px
                            border 1px solid rgba(255, 255, 255, 0.2)
                            ^[-1]:hover &
                                border 1px solid rgba(255, 255, 255, 0.5)

                    .client-name
                        h2
                            margin-top 7px
                            margin-bottom 5px


            button#button
                margin-top auto

        .main
            width 100%

    .notification
        z-index 1000
        position absolute
        background-color black
        padding 10px
        text-transform uppercase
        border-top 2px solid #785a28
        bottom 0
        left 0
        right 0
        color #d5d9c9
        font-family "LoL Body"
        font-size 40px
        text-align center
</style>