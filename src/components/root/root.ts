import Vue from "vue";
import Component from "vue-class-component";

import Lobby = require("../lobby/lobby.vue");
import Queue = require("../queue/queue.vue");
import ReadyCheck = require("../ready-check/ready-check.vue");
import ChampSelect = require("../champ-select/champ-select.vue");
import Invites = require("../invites/invites.vue");

import { ddragon } from "../../constants";

// Represents a result from the LCU api.
export interface Result {
    // Status code of the API call.
    status: number;
    // Parsed JSON of the response body.
    content: any;
}

// Represents an LCU Instance
export class Instance{
    // Is RiftScooter connected to the LCU instance
    connected: boolean;
    // Path used for the LCU Instance
    path: string;
    // Port used for the LCU Instance
    port: number;
    // Display Name
    clientName: string;
    // Display Status
    clientStatus: string = "Status: " + this.connected;

    constructor(connected: boolean, path: string, port: number, clientName: string) {
        this.connected = connected;
        this.path = path;
        this.port = port;
        this.clientName = clientName;
    }
}

// Type 1: an observed path changed. Format: [1, path_that_changed, new_status, new_content]
// Type 2: a request was completed. Format: [2, request_id, status, response]
// Type 3: a response to an info request. Format: [3, conduit_version, machine_name]
type WebsocketMessage = [0, string, any] | [1, string, number, any] | [2, number, number, any] | [3, string, string];

@Component({
    components: {
        lobby: Lobby,
        queue: Queue,
        readyCheck: ReadyCheck,
        champSelect: ChampSelect,
        invites: Invites
    }
})

export default class Root extends Vue {
    connected = false;
    socket: WebSocket;
    instances: Instance[] = [];
    notifications: string[] = [];

    manualButtonType = "confirm";
    connecting = false;
    hostname = (localStorage && localStorage.getItem("hostname")) || "";

    idCounter = 0;
    observers: { matcher: RegExp, handler: (res: Result) => void }[] = [];
    requests: { [key: number]: Function } = {};

    /**
     * @returns the most recent notification, if there is one
     */
    get notification() {
        return this.notifications[0];
    }

    /**
     * Starts observing the specified url. The handler will be called
     * whenever the endpoints contents or HTTP status change. Only a single
     * instance can observe the same path at a time.
     */
    observe(path: RegExp | string, handler: (result: Result) => void) {
        if (typeof path === "string") {
            // Make initial request to populate the handler.
            this.request(path).then(handler);

            path = new RegExp("^" + path + "$");
        }

        this.observers.push({ matcher: path, handler });
        this.socket.send(JSON.stringify([1, path.source])); // ask to observe the specified path.
    }

    /**
     * Stop observing the specified path. Does nothing if the path
     * isn't currently being observed.
     */
    unobserve(path: RegExp | string) {
        if (typeof path === "string") path = new RegExp("^" + path + "$");

        this.observers = this.observers.filter(x => {
            if (x.matcher.toString() !== path.toString()) return true;

            if (this.socket.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify([2, (path as RegExp).source])); // ask to stop observing
            return false;
        });
    }

    /**
     * Makes a request to the specified LCU endpoint with the specified
     * method and optional body. Returns a promise that resolves when the call
     * completes. Note that this promise will never be rejected, even for non-200
     * responses.
     */
    request(path: string, method: string = "GET", body?: string): Promise<Result> {
        return new Promise(resolve => {
            const id = this.idCounter++;
            this.socket.send(JSON.stringify([3, id, path, method, body]));
            this.requests[id] = resolve;
        });
    }

    /**
     * Handles any incoming messages from the websocket connection and notifies
     * listeners/resolves promises when applicable.
     */
    handleWebsocketMessage = (msg: MessageEvent) => {
        const data: WebsocketMessage = JSON.parse(msg.data);

        if (data[0] === 0) {
            if(data[1] == "list"){
                let instances = data[2];
                for (let entry of instances) {
                    this.instances.push(new Instance(entry["Connected"], entry["Path"], entry["Port"], "Client " + (this.instances.length + 1)));
                }
                //console.log(this.instances);
            }
            if(data[1] == "addToList"){
                let instances = data[2];
                this.instances.push(new Instance(instances["Connected"], instances["Path"], instances["Port"], "Client " + (this.instances.length + 1)));
            }
        }

        if (data[0] === 1) {
            this.observers
                .filter(x => !!x.matcher.exec(data[1] as string))
                .forEach(x => x.handler({ status: +data[2], content: data[3] }));
        }

        if (data[0] === 2 && this.requests[data[1] as number]) {
            this.requests[data[1] as number]({ status: data[2], content: data[3] });
            delete this.requests[data[1] as number];
        }

        if (data[0] === 3) {
            this.showNotification("Connected to " + data[2]);
        }
    };

    /**
     * Automatically (re)connects to the websocket.
     */
    private connect() {
        localStorage && localStorage.setItem("hostname", this.hostname);
        this.connecting = true;

        try {
            this.socket = new WebSocket("ws://" + this.hostname + ":10200/socket");

            this.socket.onopen = () => {
                this.connected = true;
                this.connecting = false;
                this.socket.send("[4]");
            };

            this.socket.onmessage = this.handleWebsocketMessage;

            this.socket.onclose = ev => {
                if (this.connecting) {
                    this.showConnectingError("Closed unexpectedly (" + ev.reason + ")");
                    return;
                }

                this.connected = false;
                this.showNotification("Connection to host closed.");
            };
        } catch (e) {
            this.showConnectingError(e.message);
        }
    }

    /**
     * Automatically (re)connects to the websocket.
     */
    private addNewClient() {
        try {
            this.socket.send("[99]");
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Shows a connecting error in the second button.
     */
    private showConnectingError(message: string) {
        this.connecting = false;
        this.manualButtonType = "deny";
        setTimeout(() => this.manualButtonType = "confirm", 2500);
        this.showNotification("Failed to connect: " + message + ". Is Conduit running?");
    }

    /**
     * Shows a notification that hides after a few moments.
     */
    private showNotification(content: string) {
        this.notifications.push(content);
        setTimeout(() => {
            this.notifications.splice(this.notifications.indexOf(content), 1);
        }, 8000);
    }

    /**
     * @returns the path to the summoner icon for the inviter
     */
    getSummonerIcon(id: number): string {
        return `http://ddragon.leagueoflegends.com/cdn/${ddragon()}/img/profileicon/${id}.png`;
    }
}