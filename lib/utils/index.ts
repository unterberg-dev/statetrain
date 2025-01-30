export const ruleOfThree = (value: number, min: number, max: number) => (value / 100) * (max - min) + min

export const getPercent = (value: number, min: number, max: number) =>
  Number((((value - min) / (max - min)) * 100).toFixed(2))

export type PixiConfigMinMax = {
  min: number
  max: number
}

export type GetPercentSingleValue = {
  value: number
} & PixiConfigMinMax

export const getPercentSingleValue = (item: GetPercentSingleValue) =>
  getPercent(item.value, item.min, item.max)
