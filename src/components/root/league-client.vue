<template>
    <div class="league-client">
        <div class="left">
            <img :src="summonerIcon">
            <div class="texts">
                <span>
                    {{ instance.summoner.displayName }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import { LeagueClient } from "./root";
    import { ddragon } from "../../constants";

    @Component
    export default class LeagueClientComponent extends Vue {

        @Prop()
        instance: LeagueClient;

        get summonerIcon(): string {
            return `http://ddragon.leagueoflegends.com/cdn/${ddragon()}/img/profileicon/${this.instance.summoner.profileIconId}.png`;
        }
    }
</script>

<style lang="stylus" scoped>
    .lobby-member
        display flex
        flex-direction row
        align-items center
        justify-content space-between
        margin 0 20px
        padding 20px 0
        border-bottom 1px solid rgba(255, 255, 255, 0.3)
        .left
            display flex
            flex-direction row
            align-items center
        .left img
            box-sizing border-box
            width 110px
            height 110px
            border-radius 50%
            border 3px solid #ae8939
        .left .texts
            display flex
            flex-direction column
            justify-content center
            align-items space-between
        .left span
            margin-left 20px
            color white
            font-size 56px
            &.positions
                color #fffaef
                font-size 36px
        .left span i
            color #f0e6d3
            margin-right 4px
        .right
            display flex
            flex-direction row
            justify-content center
            color white
            font-size 70px
        .right i
            margin 20px
        .right img
            width 85px
            height 85px
            margin 0 15px
</style>