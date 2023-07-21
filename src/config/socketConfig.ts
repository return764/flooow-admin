// @ts-ignore
import * as SockJS from 'sockjs-client/dist/sockjs';
import Stomp, {Frame, Message} from "stompjs";


class Socket {
    private baseUrl: string
    private endpoint: string
    private sockJS: SockJS
    private client: Stomp.Client
    private retryCount: number = 0

    constructor(baseUrl: string, endpoint: string) {
        this.baseUrl = baseUrl
        this.endpoint = endpoint
        this.sockJS = new SockJS(this.getFullUrl())
        this.client = Stomp.over(this.sockJS)
    }

    private getFullUrl(): string{
        return new URL(this.endpoint, this.baseUrl).toString()
    }

    connect(connectedCallback: (frame: Frame|undefined) => void) {
        if (!this.client.connected) {
            this.sockJS = new SockJS(this.getFullUrl())
            this.client = Stomp.over(this.sockJS)
            this.client.connect({}, connectedCallback, () => {
                this.retry(connectedCallback)
            })
        }
    }

    subscribe(destination: string, callBack: (message: Message) => any, headers?: {}) {
        this.client.subscribe(destination, callBack, headers)
    }

    isConnected(): boolean {
        return this.client.connected
    }

    disconnect = () => {
        this.client.disconnect(() => {})
    };

    send(destination: string, body?: any, header?: {}) {
        this.client.send(destination, header, typeof body === 'string' ? body : JSON.stringify(body))
    }

    private retry(connectedCallback: (frame: Frame|undefined) => void) {
        const timer = setInterval(() => {
            if (!this.client.connected) {
                this.sockJS = new SockJS(this.getFullUrl())
                this.client = Stomp.over(this.sockJS)
                this.client.connect({}, (frame) => {
                    this.retryCount = 0
                    connectedCallback(frame)
                    console.log("retry success")
                }, () => {
                    console.log(`socket retry times ${this.retryCount}`)
                    if (this.retryCount < 10) {
                        this.retryCount ++
                    } else {
                        this.retryCount = 0
                        clearInterval(timer)
                    }
                })
            }
        }, 1000)
    }
}

const socket = new Socket("http://localhost:8080", "/ws")

export default socket
