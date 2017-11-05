import Vue from "vue";

import Root = require("./components/root/root.vue");
import "vue2-animate/dist/vue2-animate.min.css";

import LcuButton = require("./components/common/lcu-button.vue");
import LeagueClientComponent = require("./components/root/league-client.vue");

Vue.component("lcu-button", LcuButton);
Vue.component("league-client", LeagueClientComponent);

new (<any>Root)().$mount("#root");