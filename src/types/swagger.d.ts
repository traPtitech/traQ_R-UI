declare namespace Components {
  namespace Parameters {
    namespace BotIdInPath {
      export type BotID = string // uuid
    }
    namespace ChannelIdInPath {
      export type ChannelID = string // uuid
    }
    namespace ClientIdInPath {
      export type ClientID = string // uuid
    }
    namespace ClipIdInPath {
      export type ClipID = string
    }
    namespace FileIdInPath {
      export type FileID = string
    }
    namespace GroupIdInPath {
      export type GroupID = string // uuid
    }
    namespace MessageIdInPath {
      export type MessageID = string // uuid
    }
    namespace Oauth2TokenIdInPath {
      export type Oauth2TokenID = string // uuid
    }
    namespace PinIdInPath {
      export type PinID = string
    }
    namespace StampIdInPath {
      export type StampID = string // uuid
    }
    namespace TagIdInPath {
      export type TagID = string // uuid
    }
    namespace UserIdInPath {
      export type UserID = string // uuid
    }
    namespace WebhookIdInPath {
      export type WebhookID = string // uuid
    }
  }
  namespace Schemas {
    export interface AllowedClientInfo {
      tokenId?: string // uuid
      clientId?: string // uuid
      name?: string
      description?: string
      creatorId?: string // uuid
      scopes?: string[]
      approvedAt?: string // date-time
    }
    export interface Bot {
      botId?: string // uuid
      botUserId?: string // uuid
      description?: string
      subscribeEvents?: string[]
      state?: number
      creatorId?: string // uuid
      createdAt?: string // date-time
      updatedAt?: string // date-time
    }
    export interface BotDetail {
      botId?: string // uuid
      botUserId?: string // uuid
      description?: string
      subscribeEvents?: string[]
      state?: number
      creatorId?: string // uuid
      createdAt?: string // date-time
      updatedAt?: string // date-time
      verificationCode?: string
      accessToken?: string
      postUrl?: string
      privileged?: boolean
      botCode?: string
    }
    export interface Channel {
      channelId?: string // uuid
      name?: string
      /**
       * privateチャンネルの場合は参加しているメンバー、公開チャンネルの場合は空
       */
      member?: string /* uuid */[]
      /**
       * 親の階層のチャンネルId
       */
      parent?: string // uuid
      /**
       * 子のチャンネルIdの配列
       */
      children?: string /* uuid */[]
      /**
       * チャンネルの可視状態
       */
      visibility?: boolean
      /**
       * 強制通知チャンネルか
       */
      force?: boolean
      /**
       * プライベートチャンネルか
       */
      private?: boolean
      /**
       * ダイレクトメッセージチャンネルか
       */
      dm?: boolean
    }
    export type ChannelList = Channel[]
    export interface ChannelTopic {
      text?: string
    }
    export interface ClientInfo {
      clientId?: string // uuid
      name?: string
      description?: string
      creatorId?: string // uuid
    }
    export interface ClipsFolder {
      /**
       * フォルダID
       */
      id?: string // uuid
      /**
       * フォルダ名
       */
      name?: string
    }
    export interface FileInfo {
      fileId?: string // uuid
      name?: string
      mime?: string
      size?: number
      dateTime?: string // date-time
      hasThumb?: boolean
      thumbWidth?: number
      thumbHeight?: number
    }
    /**
     * example:
     * [object Object]
     */
    export interface HeartbeatRes {
      userStatuses?: UserHeartbeatStatus[]
      channelId?: string // uuid
    }
    export interface Message {
      messageId?: string // uuid
      userId?: string // uuid
      parentChannelId?: string
      pin?: boolean
      reported?: boolean
      content?: string
      createdAt?: string // date-time
      updatedAt?: string // date-time
      stampList?: MessageStamp[]
    }
    export type MessageList = Message[]
    export interface MessageStamp {
      userId?: string // uuid
      stampId?: string // uuid
      count?: number
      createdAt?: string // date-time
      updatedAt?: string // date-time
    }
    export interface OwnedClientInfo {
      clientId?: string // uuid
      name?: string
      description?: string
      creatorId?: string // uuid
      scopes?: string[]
      redirectUri?: string // uri
      secret?: string
    }
    export interface Pin {
      pinId?: string // uuid
      channelId?: string // uuid
      userId?: string // uuid
      dateTime?: string // date-time
      message?: Message
    }
    export type PinList = Pin[]
    export interface Stamp {
      id?: string // uuid
      name?: string
      creatorId?: string // uuid
      fileId?: string // uuid
      createdAt?: string // date-time
      updatedAt?: string // date-time
    }
    export interface Tag {
      tagId?: string // uuid
      tag?: string
      isLocked?: boolean
      createdAt?: string // date-time
      updatedAt?: string // date-time
    }
    export type TagList = Tag[]
    export type UUIDs = string /* uuid */[]
    export interface User {
      userId?: string // uuid
      name?: string
      displayName?: string
      iconFileId?: string // uuid
      bot?: boolean
      twitterId?: string
      /**
       * 最終オンライン日時(オンラインに１度もなってない場合はnull)
       */
      lastOnline?: string // date-time
      /**
       * 現在オンラインかどうか
       */
      isOnline?: boolean
      /**
       * アカウントが停止中かどうか
       */
      suspended?: boolean
      /**
       * アカウントの状態 (0:停止,1:有効,2:一時停止)
       */
      accountStatus?: number
    }
    export interface UserDetail {
      userId?: string // uuid
      name?: string
      displayName?: string
      iconFileId?: string // uuid
      bot?: boolean
      twitterId?: string
      /**
       * 最終オンライン日時(オンラインに１度もなってない場合はnull)
       */
      lastOnline?: string // date-time
      /**
       * 現在オンラインかどうか
       */
      isOnline?: boolean
      /**
       * アカウントが停止中かどうか
       */
      suspended?: boolean
      /**
       * アカウントの状態 (0:停止,1:有効,2:一時停止)
       */
      accountStatus?: number
      tagList?: TagList
    }
    export interface UserGroup {
      groupId?: string // uuid
      name?: string
      description?: string
      adminUserId?: string // uuid
      members?: UUIDs
      createdAt?: string // date-time
      updatedAt?: string // date-time
    }
    /**
     * example:
     * [object Object]
     */
    export interface UserHeartbeatStatus {
      userId?: string // uuid
      status?: 'monitoring' | 'editing'
    }
    export type UserList = User[]
    export interface Webhook {
      webhookId?: string // uuid
      botUserId?: string // uuid
      displayName?: string
      description?: string
      secure?: boolean
      channelId?: string // uuid
      creatorId?: string // uuid
      createdAt?: string // date-time
      updatedAt?: string // date-time
    }
  }
}
declare namespace Paths {
  namespace ActivityLatestMessages {
    namespace Get {
      namespace Parameters {
        export type Limit = number
        export type Subscribe = boolean
      }
      export interface QueryParameters {
        limit?: Parameters.Limit
        subscribe?: Parameters.Subscribe
      }
      namespace Responses {
        export type $200 = Components.Schemas.MessageList
      }
    }
  }
  namespace Bots {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Bot[]
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * botユーザーID(16文字まで)。自動的に先頭に"BOT_"が付与されます
         */
        name: string
        /**
         * botユーザーの表示名(32文字まで)
         */
        displayName: string
        /**
         * botの説明
         */
        description: string
        /**
         * botのPOSTエンドポイント
         */
        postUrl: string // url
      }
      namespace Responses {
        export type $201 = Components.Schemas.BotDetail
      }
    }
  }
  namespace Bots$BotID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Bot
      }
    }
    namespace Patch {
      export interface RequestBody {
        /**
         * Bot表示名
         */
        displayName?: string
        /**
         * Bot説明
         */
        description?: string
        /**
         * privileged属性
         */
        privileged?: boolean
        /**
         * BotのPOSTエンドポイント
         */
        webhookUrl?: string // url
      }
    }
  }
  namespace Bots$BotIDChannels {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
  }
  namespace Bots$BotIDDetail {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.BotDetail
      }
    }
  }
  namespace Bots$BotIDEvents {
    namespace Put {
      export interface RequestBody {
        /**
         * 購読するイベントの配列
         */
        events: string[]
      }
    }
  }
  namespace Bots$BotIDReissue {
    namespace Post {
      namespace Responses {
        export interface $200 {
          /**
           * Verification Token
           */
          verificationToken?: string
          /**
           * BOTアクセストークン
           */
          accessToken?: string
          /**
           * BOTインストールコード
           */
          botCode?: string
        }
      }
    }
  }
  namespace Bots$BotIDState {
    namespace Put {
      export interface RequestBody {
        /**
         * activeまたはinactive
         */
        state: string
      }
    }
  }
  namespace Channels {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.ChannelList
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * プライベートチャンネルかどうか
         */
        private?: boolean
        member?: string /* uuid */[]
        /**
         * チャンネル名
         * example:
         * random
         */
        name?: string
        /**
         * 親のチャンネルID
         * example:
         * xxxxxxxx-xxxx-xxxx-Nxxx-xxxxxxxxxxxx
         */
        parent?: string // uuid
      }
      namespace Responses {
        export type $201 = Components.Schemas.Channel
      }
    }
  }
  namespace Channels$ChannelID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Channel
      }
    }
    namespace Patch {
      export interface RequestBody {
        /**
         * チャンネル名
         * example:
         * gps
         */
        name?: string
        /**
         * 変更後のvisibility
         * example:
         * true
         */
        visibility?: boolean
        /**
         * 強制通知かどうか
         */
        force?: boolean
      }
    }
  }
  namespace Channels$ChannelIDBots {
    namespace Get {
      namespace Responses {
        export type $200 = {
          /**
           * BotのID
           */
          botId?: string // uuid
          /**
           * BotのユーザーID
           */
          botUserId?: string // uuid
        }[]
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * ボットコード
         */
        code: string
      }
      namespace Responses {
        export interface $200 {
          /**
           * 参加したBotのID
           */
          botId?: string // uuid
        }
      }
    }
  }
  namespace Channels$ChannelIDChildren {
    namespace Post {
      export interface RequestBody {
        /**
         * チャンネル名
         * example:
         * random
         */
        name: string
      }
      namespace Responses {
        export type $201 = Components.Schemas.Channel
      }
    }
  }
  namespace Channels$ChannelIDMessages {
    namespace Get {
      namespace Parameters {
        export type Limit = number
        export type Offset = number
      }
      export interface QueryParameters {
        limit?: Parameters.Limit
        offset?: Parameters.Offset
      }
      namespace Responses {
        export type $200 = Components.Schemas.MessageList
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * Markdown形式のメッセージ本文
         * example:
         * Raskって誰？
         */
        text: string
      }
      namespace Responses {
        export type $201 = Components.Schemas.Message
      }
    }
  }
  namespace Channels$ChannelIDNotification {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
    namespace Put {
      export interface RequestBody {
        /**
         * 通知をつける人のユーザーIDの配列
         */
        on?: string /* uuid */[]
        /**
         * 通知をつけない人のユーザーIDの配列
         */
        off?: string /* uuid */[]
      }
    }
  }
  namespace Channels$ChannelIDParent {
    namespace Put {
      export interface RequestBody {
        /**
         * 変更後の親チャンネルID
         */
        parent: string // uuid
      }
    }
  }
  namespace Channels$ChannelIDPins {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.PinList
      }
    }
  }
  namespace Channels$ChannelIDTopic {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.ChannelTopic
      }
    }
    namespace Put {
      export interface RequestBody {
        /**
         * チャンネルの説明
         * example:
         * なんでも良いチャンネルです!!
         */
        text: string
      }
    }
  }
  namespace Clients {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.OwnedClientInfo[]
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * クライアント名(1-32文字)
         */
        name: string
        /**
         * クライアントの説明
         */
        description: string
        /**
         * リダイレクト先のURI
         */
        redirectUri: string // uri
        /**
         * 要求するスコープ(必ず１つ以上)
         */
        scopes: string[]
      }
      namespace Responses {
        export type $200 = Components.Schemas.OwnedClientInfo
      }
    }
  }
  namespace Clients$ClientID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.ClientInfo
      }
    }
    namespace Patch {
      export interface RequestBody {
        /**
         * クライアント名(1-32文字)
         */
        name?: string
        /**
         * 説明
         */
        description?: string
        /**
         * リダイレクト先のURI
         */
        redirectUri?: string // uri
      }
    }
  }
  namespace EditMessageById {
    export interface RequestBody {
      /**
       * Markdown形式のメッセージ本文
       * example:
       * Raskって誰？
       */
      text: string
    }
  }
  namespace Files {
    namespace Post {
      namespace Responses {
        export type $201 = Components.Schemas.FileInfo
      }
    }
  }
  namespace Files$FileID {
    namespace Get {
      namespace Parameters {
        export type Dl = number
      }
      export interface QueryParameters {
        dl?: Parameters.Dl
      }
    }
  }
  namespace Files$FileIDMeta {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.FileInfo
      }
    }
  }
  namespace GetMessageById {
    namespace Responses {
      export type $200 = Components.Schemas.Message
    }
  }
  namespace Groups {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UserGroup[]
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * グループ名(30文字以内)
         */
        name: string
        /**
         * 説明
         */
        description?: string
      }
      namespace Responses {
        export type $201 = Components.Schemas.UserGroup
      }
    }
  }
  namespace Groups$GroupID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UserGroup
      }
    }
    namespace Patch {
      export interface RequestBody {
        /**
         * グループ名(30文字以内)
         */
        name?: string
        /**
         * 説明
         */
        description?: string
        /**
         * 管理ユーザー
         */
        adminUserId?: string // uuid
      }
    }
  }
  namespace Groups$GroupIDMembers {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * 追加するユーザーのID
         */
        userId: string // uuid
      }
    }
  }
  namespace Heartbeat {
    namespace Get {
      namespace Parameters {
        export type ChannelId = string // uuid
      }
      export interface QueryParameters {
        channelId: Parameters.ChannelId // uuid
      }
      namespace Responses {
        export type $200 = Components.Schemas.HeartbeatRes
      }
    }
    namespace Post {
      namespace Parameters {
        export type ChannelId = string // uuid
        export type Status = 'none' | 'monitoring' | 'editing'
      }
      export interface QueryParameters {
        status: Parameters.Status
        channelId: Parameters.ChannelId // uuid
      }
    }
  }
  namespace Login {
    namespace Post {
      namespace Parameters {
        export type Redirect = string
      }
      export interface QueryParameters {
        redirect?: Parameters.Redirect
      }
      export interface RequestBody {
        name: string
        pass: string
      }
    }
  }
  namespace Logout {
    namespace Post {
      namespace Parameters {
        export type Redirect = string
      }
      export interface QueryParameters {
        redirect?: Parameters.Redirect
      }
    }
  }
  namespace Messages$MessageIDReport {
    namespace Post {
      export interface RequestBody {
        /**
         * 通報理由(100文字以内)
         */
        reason: string
      }
    }
  }
  namespace Messages$MessageIDStamps {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.MessageStamp[]
      }
    }
  }
  namespace MessagesReports {
    namespace Get {
      namespace Parameters {
        export type P = number
      }
      export interface QueryParameters {
        p?: Parameters.P
      }
      namespace Responses {
        export type $200 = {
          /**
           * 通報ID
           */
          id?: string // uuid
          /**
           * 通報対象のメッセージID
           */
          messageId?: string // uuid
          /**
           * 通報者ID
           */
          reporter?: string // uuid
          /**
           * 通報内容
           */
          reason?: string
          /**
           * 通報日時
           */
          createdAt?: string // date-time
        }[]
      }
    }
  }
  namespace NotificationDevice {
    namespace Post {
      export interface RequestBody {
        /**
         * FCMのデバイストークン
         * example:
         * bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1
         */
        token: string
      }
    }
  }
  namespace Oauth2Authorize {
    namespace Get {
      namespace Parameters {
        export type ClientId = string
        export type CodeChallenge = string
        export type CodeChallengeMethod = string
        export type Nonce = string
        export type Prompt = string
        export type RedirectUri = string
        export type ResponseType = string
        export type Scope = string
        export type State = string
      }
      export interface QueryParameters {
        response_type?: Parameters.ResponseType
        client_id?: Parameters.ClientId
        redirect_uri?: Parameters.RedirectUri
        scope?: Parameters.Scope
        state?: Parameters.State
        code_challenge?: Parameters.CodeChallenge
        code_challenge_method?: Parameters.CodeChallengeMethod
        nonce?: Parameters.Nonce
        prompt?: Parameters.Prompt
      }
    }
  }
  namespace Oauth2Token {
    namespace Post {
      namespace Responses {
        export interface $200 {
          access_token: string
          token_type: string
          expires_in?: number
          refresh_token?: string
          scope?: string
          id_token?: string
        }
      }
    }
  }
  namespace Pins {
    namespace Post {
      export interface RequestBody {
        /**
         * ピン留めするメッセージID
         */
        messageId: string // uuid
      }
      namespace Responses {
        export interface $201 {
          /**
           * ピンID
           */
          id?: string // uuid
        }
      }
    }
  }
  namespace Pins$PinID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Pin
      }
    }
  }
  namespace Stamps {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Stamp[]
      }
    }
    namespace Post {
      namespace Responses {
        export type $201 = Components.Schemas.Stamp
      }
    }
  }
  namespace Stamps$StampID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Stamp
      }
    }
  }
  namespace Tags$TagID {
    namespace Get {
      namespace Responses {
        export interface $200 {
          tagId?: string // uuid
          tag?: string
          users?: Components.Schemas.UUIDs
        }
      }
    }
  }
  namespace Users {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UserList
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * ユーザー名(半角英数字とアンダーバー(_)の1文字以上32文字以下)
         */
        name: string
        /**
         * パスワード
         */
        password: string // password
      }
    }
  }
  namespace Users$UserID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UserDetail
      }
    }
  }
  namespace Users$UserIDGroups {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
  }
  namespace Users$UserIDMessages {
    namespace Get {
      namespace Parameters {
        export type Limit = number
        export type Offset = number
      }
      export interface QueryParameters {
        limit?: Parameters.Limit
        offset?: Parameters.Offset
      }
      namespace Responses {
        export type $200 = Components.Schemas.MessageList
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * Markdown形式のメッセージ本文
         * example:
         * Raskって誰？
         */
        text: string
      }
      namespace Responses {
        export type $201 = Components.Schemas.Message
      }
    }
  }
  namespace Users$UserIDNotification {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
  }
  namespace Users$UserIDTags {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.TagList
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * 追加するタグ(30文字まで)
         * example:
         * 山田太郎
         */
        tag: string
      }
    }
  }
  namespace Users$UserIDTagsTagID {
    namespace Patch {
      export interface RequestBody {
        /**
         * lockするときはtrue,解除するときはfalse
         * example:
         * true
         */
        isLocked: boolean
      }
    }
  }
  namespace UsersMe {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.User
      }
    }
    namespace Patch {
      export interface RequestBody {
        /**
         * 新しい表示名(0-32文字)。変更しない場合は""
         */
        displayName?: string
        /**
         * TwitterID
         */
        twitterId?: string
      }
    }
  }
  namespace UsersMeClips {
    namespace Get {
      namespace Responses {
        export type $200 = {
          /**
           * フォルダID
           */
          folderId?: string // uuid
          /**
           * クリップID
           */
          clipId?: string // uuid
          /**
           * クリップ日時
           */
          clippedAt?: string // date-time
          message?: Components.Schemas.Message
        }[]
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * クリップするメッセージID
         */
        messageId: string // uuid
        /**
         * クリップフォルダ名
         */
        folderId?: string // uuid
      }
      namespace Responses {
        export interface $201 {
          /**
           * クリップID
           */
          id?: string // uuid
        }
      }
    }
  }
  namespace UsersMeClips$ClipID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Message
      }
    }
  }
  namespace UsersMeClips$ClipIDFolder {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.ClipsFolder
      }
    }
    namespace Put {
      export interface RequestBody {
        /**
         * フォルダID
         */
        folderId: string // uuid
      }
    }
  }
  namespace UsersMeClipsFolders {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.ClipsFolder[]
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * フォルダ名(30文字以内)
         */
        name: string
      }
      namespace Responses {
        export type $201 = Components.Schemas.ClipsFolder
      }
    }
  }
  namespace UsersMeClipsFolders$FolderID {
    namespace Get {
      namespace Responses {
        export type $200 = {
          /**
           * クリップID
           */
          clipId?: string // uuid
          /**
           * クリップ日時
           */
          clippedAt?: string // date-time
          message?: Components.Schemas.Message
        }[]
      }
    }
    namespace Parameters {
      export type FolderID = string // uuid
    }
    namespace Patch {
      export interface RequestBody {
        /**
         * フォルダ名(30文字以内)
         */
        name: string
      }
    }
    export interface PathParameters {
      folderID: Parameters.FolderID // uuid
    }
  }
  namespace UsersMeGroups {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
  }
  namespace UsersMeMute {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
  }
  namespace UsersMeNotification {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
  }
  namespace UsersMePassword {
    namespace Put {
      export interface RequestBody {
        /**
         * 現在のパスワード
         */
        password: string
        /**
         * 新しいパスワード(10文字以上32文字以下のアスキー文字)
         */
        newPassword: string
      }
    }
  }
  namespace UsersMeSessions {
    namespace Get {
      namespace Responses {
        export type $200 = {
          id?: string // uuid
          lastIP?: string
          lastUserAgent?: string
          lastAccess?: string // date-time
          createdAt?: string // date-time
        }[]
      }
    }
  }
  namespace UsersMeSessions$ReferenceID {
    namespace Parameters {
      export type ReferenceID = string
    }
    export interface PathParameters {
      referenceID: Parameters.ReferenceID
    }
  }
  namespace UsersMeStampHistory {
    namespace Get {
      namespace Responses {
        export type $200 = {
          /**
           * スタンプID
           */
          stampId?: string // uuid
          /**
           * そのスタンプが最後に押された日時
           */
          datetime?: string // date-time
        }[]
      }
    }
  }
  namespace UsersMeStars {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.UUIDs
      }
    }
  }
  namespace UsersMeTokens {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.AllowedClientInfo[]
      }
    }
  }
  namespace UsersMeUnreadChannels {
    namespace Get {
      namespace Responses {
        export type $200 = {
          /**
           * チャンネルID
           */
          channelId?: string // uuid
          /**
           * そのチャンネルの未読メッセージ数
           */
          count?: number
          /**
           * 自分にメンションされたメッセージを含んでいるかどうか
           */
          noticeable?: boolean
          /**
           * そのチャンネルの最古の未読メッセージの日時
           */
          since?: string // date-time
          /**
           * そのチャンネルの最新の未読メッセージの日時
           */
          updatedAt?: string // date-time
        }[]
      }
    }
  }
  namespace Webhooks {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Webhook[]
      }
    }
    namespace Post {
      export interface RequestBody {
        /**
         * webhookユーザーの表示名(32文字まで)
         */
        name: string
        /**
         * webhookの説明
         */
        description: string
        /**
         * デフォルトの投稿先チャンネル(パブリックチャンネルのみ)
         */
        channelId: string // uuid
        /**
         * webhookシークレット
         */
        secret?: string
      }
      namespace Responses {
        export type $201 = Components.Schemas.Webhook
      }
    }
  }
  namespace Webhooks$WebhookID {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.Webhook
      }
    }
    namespace Patch {
      export interface RequestBody {
        /**
         * webhookユーザーの表示名(32文字まで)
         */
        name?: string
        /**
         * webhookの説明
         */
        description?: string
        /**
         * デフォルトの投稿先チャンネル(パブリックチャンネルのみ)
         */
        channelId?: string // uuid
        /**
         * webhookシークレット
         */
        secret?: string
      }
    }
    namespace Post {
      export interface HeaderParameters {
        'X-TRAQ-Channel-Id'?: Parameters.XTRAQChannelId // uuid
        'X-TRAQ-Signature'?: Parameters.XTRAQSignature
      }
      namespace Parameters {
        export type XTRAQChannelId = string // uuid
        export type XTRAQSignature = string
      }
    }
  }
  namespace Webhooks$WebhookIDGithub {
    namespace Post {
      export interface RequestBody {}
    }
  }
}
