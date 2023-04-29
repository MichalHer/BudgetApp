interface IPrediction {
  ID_Pred: number
  purpose_of_the_expendture: string
}

interface IAccount {
  ID_Acc: number
  name: string
  currency: string
}

interface ICategories {
  ID_Cat: number
  name: string
}

export default interface IOperation {
    value: number,
    purpose_of_the_expendture: string,
    date: any,
    predictions?: IPrediction,
    accounts: IAccount,
    categories: ICategories,
    ID_Op: number
  }