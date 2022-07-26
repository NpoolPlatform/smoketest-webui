interface ProductProfit {
  Product: string
  ProductID: string
  Rate: number
  Units: number
  Unit: string
  TotalSales: number
  SaleUnit: string
  Commission: number
  Name: string
}
interface UserProfit {
  UserID: string
  InviterID: string
  EmailAddress: string
  Profit?: Array<ProductProfit>
}
interface UsersProfit {
  User: Array<UserProfit>
}

export {
  UserProfit,
  ProductProfit,
  UsersProfit
}
