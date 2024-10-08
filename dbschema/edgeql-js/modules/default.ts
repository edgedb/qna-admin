// GENERATED by @edgedb/generate v0.5.6

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _extauth from "./ext/auth";
import type * as _discord from "./discord";
import type * as ___default from "./_default_10";
export type $ModeratorλShape = $.typeutil.flatten<
  _std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
    account: $.LinkDesc<
      $User,
      $.Cardinality.One,
      {},
      true,
      false,
      false,
      false
    >;
    identity: $.LinkDesc<
      _extauth.$Identity,
      $.Cardinality.One,
      {},
      true,
      false,
      false,
      false
    >;
    email: $.PropertyDesc<
      _std.$str,
      $.Cardinality.One,
      true,
      false,
      false,
      false
    >;
  }
>;
type $Moderator = $.ObjectType<
  "default::Moderator",
  $ModeratorλShape,
  null,
  [
    ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588["__exclusives__"],
    {
      email: {
        __element__: _std.$str;
        __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne;
      };
    },
    {
      account: {
        __element__: $User;
        __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne;
      };
    },
    {
      identity: {
        __element__: _extauth.$Identity;
        __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne;
      };
    }
  ]
>;
const $Moderator = $.makeType<$Moderator>(
  _.spec,
  "eb21a491-eb6e-11ee-872b-258f21f9331a",
  _.syntax.literal
);

const Moderator: $.$expr_PathNode<
  $.TypeSet<$Moderator, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($Moderator, $.Cardinality.Many), null);

export type $MessageλShape = $.typeutil.flatten<
  _std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
    author: $.LinkDesc<
      $User,
      $.Cardinality.One,
      {},
      false,
      false,
      false,
      false
    >;
    content: $.PropertyDesc<
      _std.$str,
      $.Cardinality.One,
      false,
      false,
      false,
      false
    >;
    created_at: $.PropertyDesc<
      _std.$datetime,
      $.Cardinality.One,
      false,
      false,
      false,
      true
    >;
    attachments: $.PropertyDesc<
      $.ArrayType<_std.$str>,
      $.Cardinality.AtMostOne,
      false,
      false,
      false,
      false
    >;
    "<messages[is Thread]": $.LinkDesc<
      $Thread,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<messages[is discord::Thread]": $.LinkDesc<
      _discord.$Thread,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<messages": $.LinkDesc<
      $.ObjectType,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
  }
>;
type $Message = $.ObjectType<
  "default::Message",
  $MessageλShape,
  null,
  [..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588["__exclusives__"]]
>;
const $Message = $.makeType<$Message>(
  _.spec,
  "f2b39b07-cb60-11ee-8932-574e660fc2ee",
  _.syntax.literal
);

const Message: $.$expr_PathNode<
  $.TypeSet<$Message, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($Message, $.Cardinality.Many), null);

export type $SingletonλShape = $.typeutil.flatten<
  _std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {}
>;
type $Singleton = $.ObjectType<
  "default::Singleton",
  $SingletonλShape,
  null,
  [..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588["__exclusives__"]]
>;
const $Singleton = $.makeType<$Singleton>(
  _.spec,
  "d7b11f07-33ed-11ef-84c5-29b065b1f64f",
  _.syntax.literal
);

const Singleton: $.$expr_PathNode<
  $.TypeSet<$Singleton, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($Singleton, $.Cardinality.Many), null);

export type $PromptλShape = $.typeutil.flatten<
  $SingletonλShape & {
    content: $.PropertyDesc<
      _std.$str,
      $.Cardinality.One,
      false,
      false,
      false,
      false
    >;
  }
>;
type $Prompt = $.ObjectType<
  "default::Prompt",
  $PromptλShape,
  null,
  [...$Singleton["__exclusives__"]]
>;
const $Prompt = $.makeType<$Prompt>(
  _.spec,
  "fa1a1c9a-3397-11ef-9a43-99403ef2cc44",
  _.syntax.literal
);

const Prompt: $.$expr_PathNode<
  $.TypeSet<$Prompt, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($Prompt, $.Cardinality.Many), null);

export type $QNAλShape = $.typeutil.flatten<
  _std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
    thread: $.LinkDesc<
      $Thread,
      $.Cardinality.One,
      {},
      true,
      false,
      false,
      false
    >;
    answer: $.PropertyDesc<
      _std.$str,
      $.Cardinality.One,
      false,
      false,
      false,
      false
    >;
    question: $.PropertyDesc<
      _std.$str,
      $.Cardinality.One,
      false,
      false,
      false,
      false
    >;
    tags: $.PropertyDesc<
      _std.$str,
      $.Cardinality.Many,
      false,
      true,
      false,
      false
    >;
    title: $.PropertyDesc<
      _std.$str,
      $.Cardinality.One,
      false,
      false,
      false,
      false
    >;
    linkedTags: $.LinkDesc<
      $Tag,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<qna[is Thread]": $.LinkDesc<
      $Thread,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<qna[is discord::Thread]": $.LinkDesc<
      _discord.$Thread,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<qnas[is Tag]": $.LinkDesc<
      $Tag,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<qna": $.LinkDesc<
      $.ObjectType,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<qnas": $.LinkDesc<
      $.ObjectType,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
  }
>;
type $QNA = $.ObjectType<
  "default::QNA",
  $QNAλShape,
  null,
  [
    ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588["__exclusives__"],
    {
      thread: {
        __element__: $Thread;
        __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne;
      };
    }
  ]
>;
const $QNA = $.makeType<$QNA>(
  _.spec,
  "f2beb492-cb60-11ee-913c-5f2df51806bf",
  _.syntax.literal
);

const QNA: $.$expr_PathNode<
  $.TypeSet<$QNA, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($QNA, $.Cardinality.Many), null);

export type $QNADraftλShape = $.typeutil.flatten<
  _std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
    tags: $.PropertyDesc<
      _std.$str,
      $.Cardinality.Many,
      false,
      true,
      false,
      false
    >;
    thread: $.LinkDesc<
      $Thread,
      $.Cardinality.One,
      {},
      true,
      false,
      false,
      false
    >;
    answer: $.PropertyDesc<
      _std.$str,
      $.Cardinality.AtMostOne,
      false,
      false,
      false,
      false
    >;
    prompt: $.PropertyDesc<
      _std.$str,
      $.Cardinality.AtMostOne,
      false,
      false,
      false,
      false
    >;
    question: $.PropertyDesc<
      _std.$str,
      $.Cardinality.AtMostOne,
      false,
      false,
      false,
      false
    >;
    title: $.PropertyDesc<
      _std.$str,
      $.Cardinality.AtMostOne,
      false,
      false,
      false,
      false
    >;
    linkedTags: $.LinkDesc<
      $Tag,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<draft[is Thread]": $.LinkDesc<
      $Thread,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<draft[is discord::Thread]": $.LinkDesc<
      _discord.$Thread,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<draft": $.LinkDesc<
      $.ObjectType,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
  }
>;
type $QNADraft = $.ObjectType<
  "default::QNADraft",
  $QNADraftλShape,
  null,
  [
    ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588["__exclusives__"],
    {
      thread: {
        __element__: $Thread;
        __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne;
      };
    }
  ]
>;
const $QNADraft = $.makeType<$QNADraft>(
  _.spec,
  "f2c81e42-cb60-11ee-80b4-67f718ede6b5",
  _.syntax.literal
);

const QNADraft: $.$expr_PathNode<
  $.TypeSet<$QNADraft, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($QNADraft, $.Cardinality.Many), null);

export type $TagλShape = $.typeutil.flatten<
  _std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
    name: $.PropertyDesc<
      _std.$str,
      $.Cardinality.One,
      true,
      false,
      false,
      false
    >;
    qnas: $.LinkDesc<$QNA, $.Cardinality.Many, {}, false, true, false, false>;
    disabled: $.PropertyDesc<
      _std.$bool,
      $.Cardinality.AtMostOne,
      false,
      false,
      false,
      true
    >;
    "<linkedTags[is QNA]": $.LinkDesc<
      $QNA,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<linkedTags[is QNADraft]": $.LinkDesc<
      $QNADraft,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<linkedTags": $.LinkDesc<
      $.ObjectType,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
  }
>;
type $Tag = $.ObjectType<
  "default::Tag",
  $TagλShape,
  null,
  [
    ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588["__exclusives__"],
    {
      name: {
        __element__: _std.$str;
        __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne;
      };
    }
  ]
>;
const $Tag = $.makeType<$Tag>(
  _.spec,
  "f2c14ddd-cb60-11ee-be2d-cdb3ed44def2",
  _.syntax.literal
);

const Tag: $.$expr_PathNode<
  $.TypeSet<$Tag, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($Tag, $.Cardinality.Many), null);

export type $ThreadλShape = $.typeutil.flatten<
  _std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
    messages: $.LinkDesc<
      $Message,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    qna: $.LinkDesc<
      $QNA,
      $.Cardinality.AtMostOne,
      {},
      false,
      true,
      false,
      false
    >;
    draft: $.LinkDesc<
      $QNADraft,
      $.Cardinality.AtMostOne,
      {},
      false,
      true,
      false,
      false
    >;
    "<thread[is QNA]": $.LinkDesc<
      $QNA,
      $.Cardinality.AtMostOne,
      {},
      true,
      false,
      false,
      false
    >;
    "<thread[is QNADraft]": $.LinkDesc<
      $QNADraft,
      $.Cardinality.AtMostOne,
      {},
      true,
      false,
      false,
      false
    >;
    "<thread": $.LinkDesc<
      $.ObjectType,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
  }
>;
type $Thread = $.ObjectType<
  "default::Thread",
  $ThreadλShape,
  null,
  [..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588["__exclusives__"]]
>;
const $Thread = $.makeType<$Thread>(
  _.spec,
  "f2b933a9-cb60-11ee-bbb3-736fcf79bab4",
  _.syntax.literal
);

const Thread: $.$expr_PathNode<
  $.TypeSet<$Thread, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($Thread, $.Cardinality.Many), null);

export type $UserλShape = $.typeutil.flatten<
  _std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
    name: $.PropertyDesc<
      _std.$str,
      $.Cardinality.AtMostOne,
      false,
      false,
      false,
      false
    >;
    user_id: $.PropertyDesc<
      _std.$str,
      $.Cardinality.One,
      true,
      false,
      false,
      false
    >;
    "<account[is Moderator]": $.LinkDesc<
      $Moderator,
      $.Cardinality.AtMostOne,
      {},
      true,
      false,
      false,
      false
    >;
    "<account[is __default::current_moderator]": $.LinkDesc<
      ___default.$current_moderator,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<account[is current_moderator]": $.LinkDesc<
      $current_moderator,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<author[is Message]": $.LinkDesc<
      $Message,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<author[is discord::Message]": $.LinkDesc<
      _discord.$Message,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<account": $.LinkDesc<
      $.ObjectType,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
    "<author": $.LinkDesc<
      $.ObjectType,
      $.Cardinality.Many,
      {},
      false,
      false,
      false,
      false
    >;
  }
>;
type $User = $.ObjectType<
  "default::User",
  $UserλShape,
  null,
  [
    ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588["__exclusives__"],
    {
      user_id: {
        __element__: _std.$str;
        __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne;
      };
    }
  ]
>;
const $User = $.makeType<$User>(
  _.spec,
  "f2adaa3c-cb60-11ee-aa0a-71a17697e2f5",
  _.syntax.literal
);

const User: $.$expr_PathNode<
  $.TypeSet<$User, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);

export type $current_moderatorλShape = $.typeutil.flatten<
  $ModeratorλShape & {}
>;
type $current_moderator = $.ObjectType<
  "default::current_moderator",
  $current_moderatorλShape,
  null,
  [...$Moderator["__exclusives__"]]
>;
const $current_moderator = $.makeType<$current_moderator>(
  _.spec,
  "75327916-28b5-11ef-9950-2d2eed37d5f2",
  _.syntax.literal
);

const current_moderator: $.$expr_PathNode<
  $.TypeSet<$current_moderator, $.Cardinality.Many>,
  null
> = _.syntax.$PathNode($.$toSet($current_moderator, $.Cardinality.Many), null);

const $default__globals: {
  current_moderator: _.syntax.$expr_Global<
    // "default::current_moderator",
    $current_moderator,
    $.Cardinality.AtMostOne
  >;
} = {
  current_moderator: _.syntax.makeGlobal(
    "default::current_moderator",
    $.makeType(
      _.spec,
      "75327916-28b5-11ef-9950-2d2eed37d5f2",
      _.syntax.literal
    ),
    $.Cardinality.AtMostOne
  ) as any,
};

export {
  $Moderator,
  Moderator,
  $Message,
  Message,
  $Singleton,
  Singleton,
  $Prompt,
  Prompt,
  $QNA,
  QNA,
  $QNADraft,
  QNADraft,
  $Tag,
  Tag,
  $Thread,
  Thread,
  $User,
  User,
  $current_moderator,
  current_moderator,
};

type __defaultExports = {
  Moderator: typeof Moderator;
  Message: typeof Message;
  Singleton: typeof Singleton;
  Prompt: typeof Prompt;
  QNA: typeof QNA;
  QNADraft: typeof QNADraft;
  Tag: typeof Tag;
  Thread: typeof Thread;
  User: typeof User;
  current_moderator: typeof current_moderator;
  global: typeof $default__globals;
};
const __defaultExports: __defaultExports = {
  Moderator: Moderator,
  Message: Message,
  Singleton: Singleton,
  Prompt: Prompt,
  QNA: QNA,
  QNADraft: QNADraft,
  Tag: Tag,
  Thread: Thread,
  User: User,
  current_moderator: current_moderator,
  global: $default__globals,
};
export default __defaultExports;
