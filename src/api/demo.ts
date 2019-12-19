import { get } from "@/utils/ajax"

export const getDemoList = (
  params: QYParams<Pageable>
): QYResponse<
  Pagination<{
    name: string
    age: number
    remark: string
  }>
> =>
  new Promise(resolve => {
    setTimeout(
      () =>
        resolve({
          total_count: 25,
          items: [
            {
              name: "aaa",
              age: 12,
              remark: "很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长"
            },
            {
              name: "aaa",
              age: 50,
              remark: "很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长"
            }
          ]
        }),
      1000
    )
  })
