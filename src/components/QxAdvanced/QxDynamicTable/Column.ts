export enum ColumnType {
  text,
  image,
  switch,
  buttons,
  slot,
}

export class Column {
  /** 要显示的字段 */
  public key!: string

  /** 表头 */
  public title!: string

  /** 显示类型 */
  public type: ColumnType = ColumnType.text

  /** 宽度，width:'>50px' 代表 minWidth:'50px' */
  public width = '>50px'

  /** 是否隐藏 */
  public hidden = false

  /** 该字段是否需要求和 */
  public sumable = false

  /** 固定到一侧 */
  public fixed: false | 'left' | 'right' = false

  /** 按钮 */
  public buttons: (row: any) => Array<{ title: string; hidden: boolean }> = () => []

  /** 格式化工具，有一些预支的格式化工具，Function的入参为(value 当前单元格的值, row 本行的值) */
  public formatter?: (value: any, row: any) => string

  /** 当单元格内发生变化，如 switch */
  public onChange?: (value: any, event: any) => void

  /** 当单元格内点击按钮，如 buttons */
  public onClick?: (value: any, event: any) => void

  public constructor(init?: Partial<Column>) {
    Object.assign(this, init)
  }
}
