// GENERATED by @edgedb/generate v0.5.6

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _default from "./default";
export type $current_moderatorλShape = $.typeutil.flatten<Omit<_default.$ModeratorλShape, "account"> & {
  "account": $.LinkDesc<_default.$User, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $current_moderator = $.ObjectType<"__default::current_moderator", $current_moderatorλShape, null, [
  ..._default.$Moderator['__exclusives__'],
]>;
const $current_moderator = $.makeType<$current_moderator>(_.spec, "7531d991-28b5-11ef-83af-f92cc3345b7c", _.syntax.literal);

const current_moderator: $.$expr_PathNode<$.TypeSet<$current_moderator, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($current_moderator, $.Cardinality.Many), null);



export { $current_moderator, current_moderator };

type __defaultExports = {
  "current_moderator": typeof current_moderator
};
const __defaultExports: __defaultExports = {
  "current_moderator": current_moderator
};
export default __defaultExports;
