declare namespace QyTable {
  interface IColumn {
    prop: string
    label: string
    width?: string
  }

  interface ActionColumn extends IColumn {
    type: "action"
    options: Array<{
      label: string
      type?: "primary" | "danger"
      disabled?(row: any): boolean
      handler(row: any): void
    }>
  }

  type Column = IColumn | ActionColumn

  interface IOperation {
    type: string
    label: string
    handler: Function
  }

  interface SelectOperation extends IOperation {
    type: "selection"
    handler: (selection: any[]) => void
  }

  interface CurrentRowOperation extends IOperation {
    type: "currentRow"
    handler: (currentRow: any) => void
  }

  interface ExportOperation extends IOperation {
    type: "export"
    handler: (params: any) => void
  }

  type Operation = IOperation | SelectOperation | ExportOperation | CurrentRowOperation

  interface Fetcher {
    (pagination: Pageable & object): Promise<Pagination<any>>
  }

  interface Props {
    tableConfig: Column[]
    searchConfig?: QyForm.Field[]
    operationConfg?: Operation[]
    onFetchTableData: Fetcher
    currentRow?: any
    paramsInUrl?: boolean
  }
}
