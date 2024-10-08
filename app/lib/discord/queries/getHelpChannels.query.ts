// GENERATED by @edgedb/generate v0.5.4

import type {Executor} from "edgedb";


export type GetHelpChannelsReturns = Array<{
  "channel_id": string;
  "name": string;
}>;

export function getHelpChannels(client: Executor): Promise<GetHelpChannelsReturns> {
  return client.query(`\
select discord::HelpChannel {
  channel_id,
  name,
}`);

}
