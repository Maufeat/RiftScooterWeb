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
                    <li v-for="client in instances" @click="selectToThis(client)" v-bind:class="{ active: client.Selected }">
                        <div class="sum-icon">
                            <img :src="getSummonerIcon(client.summoner.profileIconId)">
                        </div>
                        <div class="client-name">
                            <h2>{{ client.summoner.displayName }}</h2>
                            <small></small>
                        </div>
                    </li>
                </ul>
                <div class="btn-pad">
                    <lcu-button :type="manualButtonType" @click="addNewClient()">Add new Client</lcu-button>
                </div>
            </div>
            <div v-if="selected != -1" class="main">
                <league-client
                        :key="selectedInstance.Id"
                        :instance="selectedInstance">
                </league-client>
            </div>
            <div v-else="" class="bot-nofocus">
                <h1>Please select or start an instance</h1>
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
            color: rgb(240, 230, 210)
            margin:15px 0
            font-family "LoL Body"
            background-color black
            background: #1e2328;
            border: 1px solid #785b28;
            box-shadow: 0 3px 5px rgba(1,10,19,.5) inset;
            padding: 8px 30px 8px 10px;
            border-radius: 0;

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
            background-color #000a13
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
                    background-color #101217
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

                .active
                    color rgba(255,255,255,0.8)
                    border-color #7e6532
                    background-color #1b2027
                    &:hover
                        color rgba(255,255,255,0.8)
                        border-color #7e633b
                        background-color #222931

            button#button
                margin-top auto

        .main
            width 100%
            display flex
            flex-flow column
            color #242929

            .header
                height 150px
                padding 0 25px;

            .tab-menu
                height 100px

            .container
                height 100%

        .bot-nofocus
            width 100%
            h1
                text-align: center
                line-height calc(100vh - 39px)
                color rgb(255, 255, 255)
                text-shadow 0 0 20px rgb(255, 35, 0)
                text-transform uppercase

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