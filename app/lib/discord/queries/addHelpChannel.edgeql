insert discord::HelpChannel {
  channel_id := <str>$channelId,
  name := <str>$channelName
}
unless conflict on .channel_id else (
  select discord::HelpChannel
)