export interface FormProps {
  handleClose: () => void | ((to: To) => void)
  afterCreate: (_data: any) => void
}
