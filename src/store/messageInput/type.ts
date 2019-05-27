import Schemas = Components.Schemas

export interface S {
  inputTextMap: { [channelId: string]: string }
  inputFilesMap: { [channelId: string]: any[] }
}

export interface G {
  inputText: (channelId: string) => string
  inputFiles: (channelId: string) => any[]
}

export interface RG {
  'messageInput/inputText': G['inputText']
  'messageInput/inputFiles': G['inputFiles']
}

export interface M {
  setInputText: { channelId: string; inputText: string }
  setInputFiles: { channelId: string; files: any[] }
  addStampToInputText: { channelId: string; stampName: string }
}

export interface RM {
  'messageInput/setInputText': M['setInputText']
  'messageInput/setInputFiles': M['setInputFiles']
  'messageInput/addStampToInputText': M['addStampToInputText']
}

export interface A {
  execStamp: Schemas.Stamp
  addStampToMessage: string
}

export interface RA {
  'messageInput/execStamp': A['execStamp']
  'messageInput/addStampToMessage': A['addStampToMessage']
}
