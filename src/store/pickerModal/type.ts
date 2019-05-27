import Schemas = Components.Schemas

export interface S {
  stampPickerActive: boolean
  stampPickerMode: string
  stampPickerModel: any
}

export interface G {
  stampPickerActive: boolean
  stampPickerModel: any
}

export interface RG {
  'pickerModal/stampPickerActive': G['stampPickerActive']
  'pickerModal/stampPickerModel': G['stampPickerModel']
}

export interface M {
  setStampPickerModel: any
  setStampPickerActive: boolean
  setStampPickerModeAsMessage: void
  setStampPickerModeAsInput: void
}

export interface RM {
  'pickerModal/setStampPickerModel': M['setStampPickerModel']
  'pickerModal/setStampPickerActive': M['setStampPickerActive']
  'pickerModal/setStampPickerModeAsMessage': M['setStampPickerModeAsMessage']
  'pickerModal/setStampPickerModeAsInput': M['setStampPickerModeAsInput']
}

export interface A {}

export interface RA {}
