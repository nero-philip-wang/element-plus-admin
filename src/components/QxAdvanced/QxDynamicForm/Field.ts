export enum FieldType {
  Input,
  InputNumber,
  Radio,
  Checkbox,
  Select,
  Switch,
  DateTimePicker,
  DateTimeRange,
  // Text, 待实现
  Slot,
}

export class Field {
  /** 字段，对应prop v-model  */
  public key!: string

  /** 标题，对应 label */
  public title!: string

  /** 占位 */
  public placeholder?: string

  /** 只读 */
  public readonly = false

  /** 是否隐藏 */
  public hidden = false

  /** 所占位置 */
  public size: 1 | 2 = 1

  /** 样式 */
  public class?: string

  /** 显示类型 */
  public type: FieldType = FieldType.Input

  /** 校验规则 */
  public rule: Array<any> = []

  /** 格式化工具，Text时生效，Function的入参为(value 当前单元格的值, row 本行的值) */
  public formatter?: (value: any, row: any) => string

  /** 选项来源 */
  public options: Array<{ label?: string; value?: any }> = []

  /** 额外字段 */
  public attributes: {
    multiple?: boolean // 多选
    maxlength?: number // 最大长度
    min?: number // 最小值
    max?: number // 最大值
    inputType?: 'text' | 'password' | 'textarea' | 'price' | 'time' | 'date' | 'year' | 'month' | 'date' | 'dates' | 'week' | 'datetime' // 输入框类型
    range?: { startKey: string; endKey: string; root: boolean } // 时间范围绑定字段
  } = {}

  /** 当单元格内发生变化，如 switch */
  public onChange?: (value: any, event: any) => void

  public constructor(init?: Partial<Field>) {
    Object.assign(this, init)
  }
}
