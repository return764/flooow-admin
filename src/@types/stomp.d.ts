import 'stompjs'

declare module 'stompjs' {
    interface Message {
        headers: {
            [key: string]: string
        }
    }
}
