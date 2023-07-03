
type BaseRectData = {
    label: string,
}

export type RectData = {
    type?: RectType,
} & BaseRectData

export type RectType = 'input' | 'process' | 'output'
