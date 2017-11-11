import Vue from "vue";
import Component from "vue-class-component";

import { ddragon } from "../../constants";


export interface LeagueClient{
    Id: number;
    Username:string;
    Password:string;
    Path:string;
    Port:number;
    summoner: { displayName: string, profileIconId: number };
    Selected:boolean;
}

// Represents a result from the LCU api.
export interface Result {
    // Status code of the API call.
    status: number;
    // Parsed JSON of the response body.
    content: any;
}

@Component({
    components: {
    }
})
export default class Root extends Vue {
    connected = false;
    selected = -1;
    socket: WebSocket;
    instances: LeagueClient[] = [];
    selectedInstance: LeagueClient;
    notifications: string[] = [];

    manualButtonType = "confirm";
    normalButtonType = "normal";
    connecting = false;
    hostname = (localStorage && localStorage.getItem("hostname")) || "";

    /**
     * @returns the most recent notification, if there is one
     */
    get notification() {
        return this.notifications[0];
    }

    /**
     * Handles any incoming messages from the websocket connection and notifies
     * listeners/resolves promises when applicable.
     */
    handleWebsocketMessage = (event: any) => {
        let data = JSON.parse(event.data);
        switch(data.EventName)
        {
            case "Error":
                console.log("Error: " + data);
                break;
            case "EventListInstance":
                for (let entry of data.List) {
                    console.log(entry);
                    this.addClient(entry);
                }
                break;
            case "EventInstanceStarted":
                console.log("EventInstanceStarted");
                this.addClient(data.Instance);
                break;
            case "EventInstanceClosed":
                console.log("EventInstanceClosed");
                console.log(data.Id);
                break;
            case "EventInstanceMessage":
                let parsedData = JSON.parse(data.Data);
                console.log(parsedData[2].uri);
                console.log(parsedData[2]);
                break;
            default:
                console.error("Unknown EventName: " + data.EventName)
        }
    };

    private addClient(data: any){
        const newClient: LeagueClient = data;
        newClient.Id = data["Id"];
        newClient.summoner = { displayName: "Not Logged in", profileIconId: 0 };
        this.instances.push(newClient);
    }

    private selectToThis(instance : LeagueClient){
        this.selected = instance.Id;
        if(this.selectedInstance != null){
            //DeselectOld
            this.selectedInstance.Selected = false;
        }
        this.selectedInstance = instance;
        this.selectedInstance.Selected = true;
    }

    /**
     * Automatically (re)connects to the websocket.
     */
    private connect() {
        localStorage && localStorage.setItem("hostname", this.hostname);
        this.connecting = true;

        try {
            this.socket = new WebSocket("ws://" + this.hostname + ":20000/");

            this.socket.onopen = () => {
                this.connected = true;
                this.connecting = false;
                let list: { [l: string]: string; } = { };
                list['RequestName'] = "RequestInstanceList";
                console.log(list);
                this.socket.send(JSON.stringify(list));
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
        let list: { [l: string]: string; } = { };
        list['RequestName'] = "RequestInstanceStart";
        list["Path"] = "E:\\Riot Games\\League of Legends";
        this.socket.send(JSON.stringify(list));
    }

    /**
     * Shows a connecting error in the second button.
     */
    private showConnectingError(message: string) {
        this.connecting = false;
        this.manualButtonType = "deny";
        setTimeout(() => this.manualButtonType = "confirm", 2500);
        this.showNotification("Failed to connect: " + message + ". Is VoliBot running?");
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