export default class Player {

    #audio;
    #playerStatus;
    #playlist = [];
    #currentTrackIndex = 0;
    #currentMode = Player.PLAY_MODE.REPEAT_ALL;
   
    constructor(pl, cTrk=null) {

        this.#playlist = pl;

        if(cTrk) this.#currentTrackIndex = pl.findIndex(itm => itm.id === cTrk.id);
        this.#audio = new Audio();
        // const t = this.isPlaying;
        this.#playerStatus = Player.Actions.PAUSED;

        this.#audio.onended = () =>  {
            switch (this.#currentMode) {
                case Player.PLAY_MODE.REPEAT_ALL:
                    if(this.#currentTrackIndex < this.#playlist.length-1) { this.next(); }
                    break;
                case Player.PLAY_MODE.REPEAT_CURRENT:
                    this.play(this.#playlist, this.#currentTrackIndex);
                    break;
                case Player.PLAY_MODE.SHUFFLE:
                    // this.next();
                    break;
                default:
                    break;
            }
            this.#audio.dispatchEvent(new CustomEvent(Player.ACTION, {detail: {type:Player.Actions.ENDED}}));
        };
    }

    async play(pl=null, index=null) {

        if(index !== null) this.#currentTrackIndex = index;
        if(pl !== null)  this.#playlist = pl;
        
        if(this.#playlist[this.#currentTrackIndex].url !== this.#audio.src) {
            this.#audio.src = this.#playlist[this.#currentTrackIndex].url;
        };

        this.#audio.dispatchEvent(new CustomEvent(Player.ACTION, {detail: {type:Player.Actions.LOADING}}));

        try {
            await this.#audio.play();
            this.#audio.dispatchEvent(new CustomEvent(Player.ACTION, {detail: {type:Player.Actions.PLAYING}}));
            if(Number.isFinite(this.duration)) {
                this.#audio.ontimeupdate = () => {
                    this.#audio.dispatchEvent(new CustomEvent(Player.ACTION, {
                        detail: {
                            type:Player.Actions.TIME_UPDATE,
                            time:this.currentTime / this.duration
                        }
                    }   ));
                }
            } else {
                 this.#audio.ontimeupdate = null;
            }
        } catch (err) {
            if(!this.#audio.error) return;

            let message;
            switch(this.#audio.error.code) {
                case MediaError.MEDIA_ERR_ABORTED: message = 'Aborted!';
                    break;
                case MediaError.MEDIA_ERR_NETWORK: message = 'No Network!';
                    break;
                case MediaError.MEDIA_ERR_DECODE: message = 'Error decoding!';
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: message = 'Not Suported/Found!';
                    break;
                default: message = 'UnknownError';
                    break;
            }
            this.#audio.dispatchEvent(new CustomEvent(Player.ACTION, {detail: {type:Player.Actions.ERROR, error:err, message:message}}));
        }
    }

    pause() {
        this.#audio.pause();
        this.#audio.dispatchEvent(new CustomEvent(Player.ACTION, {detail: {type:Player.Actions.PAUSED}}));
    }

    next() {
        if(this.#playlist.length <= 1 && this.#currentMode === Player.PLAY_MODE.REPEAT_ALL) return;
        this.#currentTrackIndex++;
        if(this.#currentTrackIndex >= this.#playlist.length) this.#currentTrackIndex = 0;
        this.play();
    }

    previous() {
        if(this.#playlist.length <= 1) return;
        this.#currentTrackIndex--;
        if(this.#currentTrackIndex < 0) this.#currentTrackIndex = this.#playlist.length - 1;
        this.play();
    }

    addEventListener(name, event) {
        this.#audio.addEventListener(name, event);
    }

    set volume(val) { 
        this.#audio.volume = val;
        this.#audio.dispatchEvent(new CustomEvent(Player.ACTION, {detail: {type:Player.Actions.VOLUME}}))
    }
    get volume() { return this.#audio.volume}

    get playmode() { return this.#currentMode}
    set playmode(value) { {
        this.#currentMode = value;
        console.log('changing play mode to', value)
    }}

    get state() {this.#playerStatus}
    get duration() {return this.#audio.duration}
    set currentTime(value) {
        if(!this.currentTrack ) return;
        if(this.currentTrack.type === 'stream') return;
        this.#audio.currentTime = value * this.#audio.duration;
    }
    get currentTime() {
        if (Number.isFinite(this.duration)) return this.#audio.currentTime;
        else return -1;
    }
    get currentTrack() {
        if(!this.#playlist.length) return null;
        return {
            ...this.#playlist[this.#currentTrackIndex],
            duration: this.duration,
            currentTime: this.currentTime
        };
    }
    get isPlaying() {return !this.#audio.paused}

}
Player.ACTION = 'playeraction';
Player.Actions = {
    LOADING: 'playeractionsloading',
    PLAYING: 'playeractionsplaying',
    PAUSED: 'playeractionspaused',
    ENDED: 'playeractionsended',
    VOLUME: 'playeractionsvolume',
    TIME_UPDATE: 'playeractionstimeupdate',
    ERROR: 'playeractionserror'
}
Player.PLAY_MODE = {
    REPEAT_ALL: 'repeat_all',
    REPEAT_CURRENT: 'repeat_current',
    SHUFFLE: 'shuffle'
}