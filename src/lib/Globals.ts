export const Globals: GlobalsInterface = {
    members: [],
    audioFiles: [],
    whitelist: [],
    forcedmutes: [],
    currentlyPlayingAudio: null,
    selectedAudio: ""
}
interface GlobalsInterface {
    members: Member[]
    audioFiles: string[]
    whitelist: number[]
    forcedmutes: number[],
    currentlyPlayingAudio: {
        filename: string,
        state: string,
        seconds: number,
    } | null
    selectedAudio: string;
}

export interface Member {
    name: string;
    surname?: string;
    id: number;
    username: string;
    muted: boolean;
}
export enum WebsocketCommands {
    GetParticipants = "GET_PART",
}

export enum WebsocketEvents {
    Introduction = "INTRODUCTION",
    UserJoin = "JOIN_VC",
    UserQuit = "QUIT_VC",
    UserMuted = "MUTE_PART",
    UserUnmuted = "UNMUTE_PART",
    NetworkChange = "NET_CHANGE",
    AudioStateUpdate = "AUDIO_STATE_UPDATE"
}

export enum WebsocketResponses {
    ParticipantsAck = "PART_ACK",
    ParticipantsError = "PART_ERR",
    Unrecognized = "UNRECOGNIZED"
}